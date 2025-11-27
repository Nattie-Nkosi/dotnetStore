namespace API.Entities;

public class Basket
{
	public int Id { get; set; }
	public required string BuyerId { get; set; }
	public List<BasketItem> Items { get; set; } = [];
	public string? PaymentIntentId { get; set; }
	public string? ClientSecret { get; set; }

	public void AddItem(Product product, int quantity)
	{
		ArgumentNullException.ThrowIfNull(product);
		if (quantity <= 0)
			throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

		var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);

		if (existingItem == null)
		{
			Items.Add(new BasketItem
			{
				Product = product,
				ProductId = product.Id,
				Quantity = quantity
			});
		}
		else
		{
			existingItem.Quantity += quantity;
		}
	}

	public void RemoveItem(int productId, int quantity)
	{
		if (productId <= 0)
			throw new ArgumentException("Product ID must be greater than zero.", nameof(productId));
		if (quantity <= 0)
			throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

		var item = Items.FirstOrDefault(item => item.ProductId == productId);
		if (item == null) return;

		item.Quantity -= quantity;

		if (item.Quantity <= 0)
		{
			Items.Remove(item);
		}
	}
}