using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentsController(PaymentService paymentService, StoreContext context) : BaseApiController
{
	private readonly PaymentService _paymentService = paymentService;
	private readonly StoreContext _context = context;

	[Authorize]
	[HttpPost]
	public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
	{
		var basket = await _context.Baskets
			.Include(b => b.Items)
			.ThenInclude(i => i.Product)
			.FirstOrDefaultAsync(b => b.BuyerId == User.Identity!.Name);

		if (basket == null) return NotFound();

		var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

		if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

		basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
		basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

		_context.Update(basket);

		var result = await _context.SaveChangesAsync() > 0;

		if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with payment intent" });

		return basket.MapBasketToDto();
	}
}
