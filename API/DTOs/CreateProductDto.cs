using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProductDto
{
	[Required]
	public string Name { get; set; } = string.Empty;

	[Required]
	public string Description { get; set; } = string.Empty;

	[Required]
	[Range(100, double.MaxValue)]
	public long Price { get; set; }

	public string PictureUrl { get; set; } = string.Empty;

	[Required]
	public string Type { get; set; } = string.Empty;

	[Required]
	public string Brand { get; set; } = string.Empty;

	[Required]
	[Range(0, int.MaxValue)]
	public int QuantityInStock { get; set; }
}
