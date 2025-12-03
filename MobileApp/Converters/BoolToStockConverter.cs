using System.Globalization;

namespace MobileApp.Converters;

public class BoolToStockConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is bool isInStock)
        {
            return isInStock ? "In Stock" : "Out of Stock";
        }

        return "Unknown";
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
