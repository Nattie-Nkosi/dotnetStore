namespace MobileApp.Models;

public class BasketItem
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public long Price { get; set; }
    public string PictureUrl { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Quantity { get; set; }

    public string FormattedPrice => $"R{Price / 100.0:F2}";
    public string FormattedSubtotal => $"R{(Price * Quantity) / 100.0:F2}";

    public string FullImageUrl
    {
        get
        {
            if (string.IsNullOrEmpty(PictureUrl))
                return string.Empty;

            if (PictureUrl.StartsWith("http"))
                return PictureUrl;

            return $"{AppSettings.ImageBaseUrl}{PictureUrl}";
        }
    }
}
