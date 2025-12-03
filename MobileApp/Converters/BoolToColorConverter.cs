using System.Globalization;

namespace MobileApp.Converters;

public class BoolToColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is bool boolValue && parameter is string colors)
        {
            var colorParts = colors.Split(':');
            if (colorParts.Length == 2)
            {
                return Color.FromArgb(boolValue ? colorParts[0] : colorParts[1]);
            }
        }

        return Colors.Gray;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
