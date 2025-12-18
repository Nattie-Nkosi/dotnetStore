using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProductDto : CreateProductDto
{
	[Required]
	[Range(1, int.MaxValue)]
	public int Id { get; set; }
}
