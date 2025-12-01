using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Order = API.Entities.OrderAggregate.Order;
using Address = API.Entities.Address;

namespace API.Controllers;

[Authorize]
public class OrdersController(StoreContext context, IConfiguration config) : BaseApiController
{
	private readonly StoreContext _context = context;
	private readonly IConfiguration _config = config;

	[HttpGet]
	public async Task<ActionResult<List<OrderDto>>> GetOrders()
	{
		var orders = await _context.Orders
			.Include(o => o.OrderItems)
			.Where(o => o.BuyerId == User.GetUsername())
			.OrderByDescending(o => o.OrderDate)
			.ToListAsync();

		return orders.Select(o => o.MapOrderToDto()).ToList();
	}

	[HttpGet("{id}", Name = "GetOrder")]
	public async Task<ActionResult<OrderDto>> GetOrder(int id)
	{
		var order = await _context.Orders
			.Include(o => o.OrderItems)
			.FirstOrDefaultAsync(o => o.Id == id && o.BuyerId == User.GetUsername());

		if (order == null) return NotFound();

		return order.MapOrderToDto();
	}

	[HttpPost]
	public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
	{
		var basket = await _context.Baskets
			.Include(b => b.Items)
			.ThenInclude(i => i.Product)
			.FirstOrDefaultAsync(b => b.BuyerId == User.GetUsername());

		if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate basket" });

		if (string.IsNullOrEmpty(basket.PaymentIntentId))
		{
			return BadRequest(new ProblemDetails { Title = "No payment intent found" });
		}

		StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
		var service = new PaymentIntentService();
		var intent = await service.GetAsync(basket.PaymentIntentId);

		if (intent == null)
		{
			return BadRequest(new ProblemDetails { Title = "Payment intent not found" });
		}

		if (intent.Status != "succeeded")
		{
			return BadRequest(new ProblemDetails { Title = "Payment not successful" });
		}

		var items = new List<OrderItem>();
		foreach (var item in basket.Items)
		{
			var productItem = await _context.Products.FindAsync(item.ProductId);
			if (productItem == null)
			{
				return BadRequest(new ProblemDetails { Title = $"Product {item.ProductId} not found" });
			}

			if (productItem.QuantityInStock < item.Quantity)
			{
				return BadRequest(new ProblemDetails { Title = $"Not enough stock for {productItem.Name}. Only {productItem.QuantityInStock} available." });
			}

			var itemOrdered = new OrderItem
			{
				ProductId = productItem.Id,
				Product = null!,
				Name = productItem.Name,
				PictureUrl = productItem.PictureUrl,
				Price = productItem.Price,
				Quantity = item.Quantity
			};
			items.Add(itemOrdered);
			productItem.QuantityInStock -= item.Quantity;
		}

		if (items.Count == 0)
		{
			return BadRequest(new ProblemDetails { Title = "Basket is empty" });
		}

		var subtotal = items.Sum(item => item.Price * item.Quantity);
		var deliveryFee = subtotal >= 50000 ? 0 : 5000;

		PaymentSummary? paymentSummary = null;
		if (intent.PaymentMethod != null)
		{
			var paymentMethodService = new PaymentMethodService();
			var paymentMethod = await paymentMethodService.GetAsync(intent.PaymentMethod.ToString());

			if (paymentMethod?.Card != null)
			{
				paymentSummary = new PaymentSummary
				{
					Last4 = paymentMethod.Card.Last4,
					Brand = paymentMethod.Card.Brand,
					ExpMonth = (int)paymentMethod.Card.ExpMonth,
					ExpYear = (int)paymentMethod.Card.ExpYear
				};
			}
		}

		var order = new Order
		{
			BuyerId = User.GetUsername()!,
			ShippingAddress = new ShippingAddress
			{
				Name = orderDto.ShippingAddress.Name,
				Line1 = orderDto.ShippingAddress.Line1,
				Line2 = orderDto.ShippingAddress.Line2,
				City = orderDto.ShippingAddress.City,
				State = orderDto.ShippingAddress.State,
				PostalCode = orderDto.ShippingAddress.PostalCode,
				Country = orderDto.ShippingAddress.Country
			},
			OrderItems = items,
			Subtotal = subtotal,
			DeliveryFee = deliveryFee,
			OrderStatus = OrderStatus.PaymentReceived,
			PaymentIntentId = basket.PaymentIntentId,
			PaymentSummary = paymentSummary
		};

		_context.Orders.Add(order);
		_context.Baskets.Remove(basket);

		if (orderDto.SaveAddress)
		{
			var user = await _context.Users
				.Include(u => u.Address)
				.FirstOrDefaultAsync(u => u.UserName == User.GetUsername());

			if (user != null)
			{
				user.Address = new Address
				{
					Name = orderDto.ShippingAddress.Name,
					Line1 = orderDto.ShippingAddress.Line1,
					Line2 = orderDto.ShippingAddress.Line2,
					City = orderDto.ShippingAddress.City,
					State = orderDto.ShippingAddress.State,
					PostalCode = orderDto.ShippingAddress.PostalCode,
					Country = orderDto.ShippingAddress.Country
				};
			}
		}

		var result = await _context.SaveChangesAsync() > 0;

		if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

		return BadRequest(new ProblemDetails { Title = "Problem creating order" });
	}
}
