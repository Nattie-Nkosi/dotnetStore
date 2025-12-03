namespace MobileApp.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public long Price { get; set; }
    public string PictureUrl { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int QuantityInStock { get; set; }

    public string FormattedPrice => $"R{Price / 100.0:F2}";

    public bool IsInStock => QuantityInStock > 0;

    public bool HasFreeDelivery => Price >= 50000;

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
