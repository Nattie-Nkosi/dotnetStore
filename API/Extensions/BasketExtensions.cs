using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class BasketExtensions
{
	public static BasketDto MapBasketToDto(this Basket basket)
	{
		return new BasketDto
		{
			Id = basket.Id,
			BuyerId = basket.BuyerId,
			PaymentIntentId = basket.PaymentIntentId,
			ClientSecret = basket.ClientSecret,
			Items = basket.Items.Select(item => new BasketItemDto
			{
				ProductId = item.ProductId,
				Name = item.Product.Name,
				Price = item.Product.Price,
				PictureUrl = item.Product.PictureUrl,
				Brand = item.Product.Brand,
				Type = item.Product.Type,
				Quantity = item.Quantity
			}).ToList()
		};
	}
}
