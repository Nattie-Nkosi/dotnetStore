using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MobileApp.Models;
using MobileApp.Services;
using System.Collections.ObjectModel;

namespace MobileApp.ViewModels;

public partial class BasketViewModel : ObservableObject
{
    private readonly IBasketService _basketService;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private ObservableCollection<BasketItem> basketItems = new();

    [ObservableProperty]
    private string totalAmount = "R0.00";

    [ObservableProperty]
    private int totalItems;

    public BasketViewModel(IBasketService basketService)
    {
        _basketService = basketService;
    }

    [RelayCommand]
    private async Task LoadBasketAsync()
    {
        if (IsLoading)
            return;

        try
        {
            IsLoading = true;
            var basket = await _basketService.GetBasketAsync();

            BasketItems.Clear();

            if (basket != null && basket.Items.Any())
            {
                foreach (var item in basket.Items)
                {
                    BasketItems.Add(item);
                }

                TotalAmount = basket.FormattedTotal;
                TotalItems = basket.TotalItems;
            }
            else
            {
                TotalAmount = "R0.00";
                TotalItems = 0;
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to load basket:\n\n{ex.Message}",
                "OK");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task IncreaseQuantityAsync(BasketItem item)
    {
        if (item == null)
            return;

        try
        {
            var basket = await _basketService.AddItemToBasketAsync(item.ProductId, 1);
            if (basket != null)
            {
                await LoadBasketAsync();
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to update quantity:\n\n{ex.Message}",
                "OK");
        }
    }

    [RelayCommand]
    private async Task DecreaseQuantityAsync(BasketItem item)
    {
        if (item == null)
            return;

        try
        {
            var success = await _basketService.RemoveItemFromBasketAsync(item.ProductId, 1);
            if (success)
            {
                await LoadBasketAsync();
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to update quantity:\n\n{ex.Message}",
                "OK");
        }
    }

    [RelayCommand]
    private async Task RemoveItemAsync(BasketItem item)
    {
        if (item == null)
            return;

        bool confirm = await Shell.Current.DisplayAlert(
            "Remove Item",
            $"Remove {item.Name} from cart?",
            "Yes",
            "No");

        if (!confirm)
            return;

        try
        {
            var success = await _basketService.RemoveItemFromBasketAsync(item.ProductId, item.Quantity);
            if (success)
            {
                await LoadBasketAsync();
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to remove item:\n\n{ex.Message}",
                "OK");
        }
    }

    [RelayCommand]
    private async Task ClearBasketAsync()
    {
        if (!BasketItems.Any())
            return;

        bool confirm = await Shell.Current.DisplayAlert(
            "Clear Cart",
            "Remove all items from your cart?",
            "Yes",
            "No");

        if (!confirm)
            return;

        try
        {
            var success = await _basketService.ClearBasketAsync();
            if (success)
            {
                await LoadBasketAsync();
                await Shell.Current.DisplayAlert(
                    "Success",
                    "Cart cleared successfully",
                    "OK");
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to clear cart:\n\n{ex.Message}",
                "OK");
        }
    }

    [RelayCommand]
    private async Task ContinueShoppingAsync()
    {
        await Shell.Current.GoToAsync("//CatalogPage");
    }

    [RelayCommand]
    private async Task CheckoutAsync()
    {
        if (!BasketItems.Any())
        {
            await Shell.Current.DisplayAlert(
                "Empty Cart",
                "Your cart is empty. Add some products first!",
                "OK");
            return;
        }

        await Shell.Current.DisplayAlert(
            "Checkout",
            "Checkout feature coming soon!",
            "OK");
    }
}
