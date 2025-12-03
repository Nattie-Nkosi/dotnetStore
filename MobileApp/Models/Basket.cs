namespace MobileApp.Models;

public class Basket
{
    public int Id { get; set; }
    public string BuyerId { get; set; } = string.Empty;
    public List<BasketItem> Items { get; set; } = new();
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }

    public int TotalItems => Items.Sum(item => item.Quantity);

    public string FormattedTotal => $"R{(Items.Sum(item => item.Price * item.Quantity) / 100.0):F2}";

    public long Total => Items.Sum(item => item.Price * item.Quantity);
}
