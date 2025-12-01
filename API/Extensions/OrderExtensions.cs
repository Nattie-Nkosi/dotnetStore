using API.DTOs;
using API.Entities.OrderAggregate;

namespace API.Extensions;

public static class OrderExtensions
{
	public static OrderDto MapOrderToDto(this Order order)
	{
		return new OrderDto
		{
			Id = order.Id,
			BuyerId = order.BuyerId,
			OrderDate = order.OrderDate,
			ShippingAddress = new ShippingAddressDto
			{
				Name = order.ShippingAddress.Name,
				Line1 = order.ShippingAddress.Line1,
				Line2 = order.ShippingAddress.Line2,
				City = order.ShippingAddress.City,
				State = order.ShippingAddress.State,
				PostalCode = order.ShippingAddress.PostalCode,
				Country = order.ShippingAddress.Country
			},
			OrderItems = order.OrderItems.Select(item => new OrderItemDto
			{
				ProductId = item.ProductId,
				Name = item.Name,
				PictureUrl = item.PictureUrl,
				Price = item.Price,
				Quantity = item.Quantity
			}).ToList(),
			Subtotal = order.Subtotal,
			DeliveryFee = order.DeliveryFee,
			OrderStatus = order.OrderStatus.ToString(),
			PaymentSummary = order.PaymentSummary != null ? new PaymentSummaryDto
			{
				Last4 = order.PaymentSummary.Last4,
				Brand = order.PaymentSummary.Brand,
				ExpMonth = order.PaymentSummary.ExpMonth,
				ExpYear = order.PaymentSummary.ExpYear
			} : null,
			Total = order.GetTotal()
		};
	}
}
