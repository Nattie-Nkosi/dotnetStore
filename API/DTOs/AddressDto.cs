using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.DTOs;

public class AddressDto
{
	[Required]
	public required string Name { get; set; }

	[Required]
	public required string Line1 { get; set; }

	public string? Line2 { get; set; }

	[Required]
	public required string City { get; set; }

	[Required]
	public required string State { get; set; }

	[Required]
	[JsonPropertyName("postal_code")]
	public required string PostalCode { get; set; }

	[Required]
	public required string Country { get; set; }
}
