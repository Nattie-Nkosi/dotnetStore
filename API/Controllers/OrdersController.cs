using API.Data;
using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppOrderService = API.Services.OrderService;

namespace API.Controllers;

[Authorize]
public class OrdersController(StoreContext context, AppOrderService orderService) : BaseApiController
{
	private readonly StoreContext _context = context;
	private readonly AppOrderService _orderService = orderService;

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

		var existingOrder = await _context.Orders
			.FirstOrDefaultAsync(o => o.PaymentIntentId == basket.PaymentIntentId);

		if (existingOrder != null)
		{
			return CreatedAtRoute("GetOrder", new { id = existingOrder.Id }, existingOrder.Id);
		}

		var order = await _orderService.CreateOrderFromPaymentIntent(
			basket.PaymentIntentId,
			orderDto.ShippingAddress,
			orderDto.SaveAddress,
			User.GetUsername()
		);

		if (order == null)
		{
			return BadRequest(new ProblemDetails { Title = "Problem creating order" });
		}

		return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
	}
}
