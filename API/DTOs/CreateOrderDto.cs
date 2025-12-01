namespace API.DTOs;

public class CreateOrderDto
{
	public bool SaveAddress { get; set; }
	public required ShippingAddressDto ShippingAddress { get; set; }
}
