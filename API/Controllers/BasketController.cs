using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class BasketController(StoreContext context) : BaseApiController
	{
		private readonly StoreContext context = context;

		[HttpGet(Name = "GetBasket")]
		public async Task<ActionResult<BasketDto>> GetBasket()
		{
			var basket = await RetrieveBasket();
			if (basket == null) return NoContent();
			return basket.MapBasketToDto();
		}

		[HttpPost]
		public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
		{
			var basket = await RetrieveBasket() ?? CreateBasket();
			var product = await context.Products.FindAsync(productId);
			if (product == null) return NotFound();

			basket.AddItem(product, quantity);
			var result = await context.SaveChangesAsync() > 0;

			if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());
			return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
		}

		[HttpDelete]
		public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
		{
			var basket = await RetrieveBasket();
			if (basket == null) return BadRequest("Basket not found");

			basket.RemoveItem(productId, quantity);
			var result = await context.SaveChangesAsync() > 0;

			if (result) return Ok();
			return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
		}

		[HttpDelete("clear")]
		public async Task<ActionResult> ClearBasket()
		{
			var basket = await RetrieveBasket();
			if (basket == null) return NoContent();

			context.Baskets.Remove(basket);
			var result = await context.SaveChangesAsync() > 0;

			if (result) return NoContent();
			return BadRequest(new ProblemDetails { Title = "Problem clearing basket" });
		}

		private async Task<Basket?> RetrieveBasket()
		{
			var buyerId = GetBuyerId();

			return await context.Baskets
				.Include(b => b.Items)
				.ThenInclude(i => i.Product)
				.FirstOrDefaultAsync(b => b.BuyerId == buyerId);
		}

		private string GetBuyerId()
		{
			return User.Identity?.Name ?? Request.Cookies["buyerId"] ?? "";
		}

		private Basket CreateBasket()
		{
			var buyerId = GetBuyerId();

			if (string.IsNullOrEmpty(buyerId))
			{
				buyerId = Guid.NewGuid().ToString();
				var cookieOptions = new CookieOptions
				{
					IsEssential = true,
					Expires = DateTimeOffset.UtcNow.AddDays(30)
				};
				Response.Cookies.Append("buyerId", buyerId, cookieOptions);
			}

			var basket = new Basket { BuyerId = buyerId };
			context.Baskets.Add(basket);
			return basket;
		}
	}
}
