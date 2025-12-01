namespace API.DTOs;

public class OrderDto
{
	public int Id { get; set; }
	public required string BuyerId { get; set; }
	public required ShippingAddressDto ShippingAddress { get; set; }
	public DateTime OrderDate { get; set; }
	public List<OrderItemDto> OrderItems { get; set; } = [];
	public long Subtotal { get; set; }
	public long DeliveryFee { get; set; }
	public required string OrderStatus { get; set; }
	public PaymentSummaryDto? PaymentSummary { get; set; }
	public long Total { get; set; }
}
