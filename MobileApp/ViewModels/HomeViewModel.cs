using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MobileApp.Models;
using MobileApp.Services;
using System.Collections.ObjectModel;

namespace MobileApp.ViewModels;

public partial class HomeViewModel : ObservableObject
{
    private readonly IProductService _productService;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private ObservableCollection<Product> featuredProducts = new();

    public HomeViewModel(IProductService productService)
    {
        _productService = productService;
    }

    [RelayCommand]
    private async Task LoadFeaturedProductsAsync()
    {
        if (IsLoading)
            return;

        try
        {
            IsLoading = true;
            var products = await _productService.GetProductsAsync();

            FeaturedProducts.Clear();
            foreach (var product in products.Take(6))
            {
                FeaturedProducts.Add(product);
            }

            if (!products.Any())
            {
                await Shell.Current.DisplayAlert(
                    "No Products",
                    "Unable to load products. Please check:\n\n1. API is running at https://localhost:5001\n2. Network connection\n3. Check Debug Output for errors",
                    "OK");
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to load products:\n\n{ex.Message}",
                "OK");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task NavigateToCatalogAsync()
    {
        await Shell.Current.GoToAsync("//CatalogPage");
    }

    [RelayCommand]
    private async Task ProductTappedAsync(Product product)
    {
        if (product == null)
            return;

        await Shell.Current.GoToAsync($"productdetail?productId={product.Id}");
    }
}
