using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities.OrderAggregate;

[Table("OrderItems")]
public class OrderItem
{
	public int Id { get; set; }
	public Product Product { get; set; } = null!;
	public int ProductId { get; set; }
	public required string Name { get; set; }
	public required string PictureUrl { get; set; }
	public long Price { get; set; }
	public int Quantity { get; set; }
	public int OrderId { get; set; }
	public Order Order { get; set; } = null!;
}
