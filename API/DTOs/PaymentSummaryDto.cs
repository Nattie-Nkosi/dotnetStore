namespace API.DTOs;

public class PaymentSummaryDto
{
	public required string Last4 { get; set; }
	public required string Brand { get; set; }
	public int ExpMonth { get; set; }
	public int ExpYear { get; set; }
}
