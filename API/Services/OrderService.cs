using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Order = API.Entities.OrderAggregate.Order;
using Address = API.Entities.Address;

namespace API.Services;

public class OrderService
{
	private readonly StoreContext _context;
	private readonly IConfiguration _config;

	public OrderService(StoreContext context, IConfiguration config)
	{
		_context = context;
		_config = config;
	}

	public async Task<Order?> CreateOrderFromPaymentIntent(string paymentIntentId, ShippingAddressDto? shippingAddress = null, bool saveAddress = false, string? buyerId = null)
	{
		var basket = await _context.Baskets
			.Include(b => b.Items)
			.ThenInclude(i => i.Product)
			.FirstOrDefaultAsync(b => b.PaymentIntentId == paymentIntentId);

		if (basket == null) return null;

		StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
		var service = new PaymentIntentService();
		var intent = await service.GetAsync(paymentIntentId);

		if (intent == null || intent.Status != "succeeded") return null;

		var actualBuyerId = buyerId ?? basket.BuyerId;
		if (string.IsNullOrEmpty(actualBuyerId)) return null;

		var items = new List<OrderItem>();
		foreach (var item in basket.Items)
		{
			var productItem = await _context.Products.FindAsync(item.ProductId);
			if (productItem == null) continue;

			if (productItem.QuantityInStock < item.Quantity)
			{
				return null;
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

		if (items.Count == 0) return null;

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

		ShippingAddress? orderShippingAddress = null;
		if (shippingAddress != null)
		{
			orderShippingAddress = new ShippingAddress
			{
				Name = shippingAddress.Name,
				Line1 = shippingAddress.Line1,
				Line2 = shippingAddress.Line2,
				City = shippingAddress.City,
				State = shippingAddress.State,
				PostalCode = shippingAddress.PostalCode,
				Country = shippingAddress.Country
			};
		}
		else if (intent.Shipping != null)
		{
			orderShippingAddress = new ShippingAddress
			{
				Name = intent.Shipping.Name ?? "Unknown",
				Line1 = intent.Shipping.Address?.Line1 ?? "",
				Line2 = intent.Shipping.Address?.Line2,
				City = intent.Shipping.Address?.City ?? "",
				State = intent.Shipping.Address?.State ?? "",
				PostalCode = intent.Shipping.Address?.PostalCode ?? "",
				Country = intent.Shipping.Address?.Country ?? ""
			};
		}

		if (orderShippingAddress == null) return null;

		var order = new Order
		{
			BuyerId = actualBuyerId,
			ShippingAddress = orderShippingAddress,
			OrderItems = items,
			Subtotal = subtotal,
			DeliveryFee = deliveryFee,
			OrderStatus = OrderStatus.PaymentReceived,
			PaymentIntentId = paymentIntentId,
			PaymentSummary = paymentSummary
		};

		_context.Orders.Add(order);
		_context.Baskets.Remove(basket);

		if (saveAddress && !string.IsNullOrEmpty(buyerId))
		{
			var user = await _context.Users
				.Include(u => u.Address)
				.FirstOrDefaultAsync(u => u.UserName == buyerId);

			if (user != null)
			{
				user.Address = new Address
				{
					Name = orderShippingAddress.Name,
					Line1 = orderShippingAddress.Line1,
					Line2 = orderShippingAddress.Line2,
					City = orderShippingAddress.City,
					State = orderShippingAddress.State,
					PostalCode = orderShippingAddress.PostalCode,
					Country = orderShippingAddress.Country
				};
			}
		}

		var result = await _context.SaveChangesAsync() > 0;

		return result ? order : null;
	}
}
