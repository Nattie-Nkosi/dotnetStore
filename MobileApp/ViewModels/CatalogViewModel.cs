using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MobileApp.Models;
using MobileApp.Services;
using System.Collections.ObjectModel;

namespace MobileApp.ViewModels;

public partial class CatalogViewModel : ObservableObject
{
    private readonly IProductService _productService;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private bool isRefreshing;

    [ObservableProperty]
    private ObservableCollection<Product> products = new();

    [ObservableProperty]
    private string searchText = string.Empty;

    private List<Product> _allProducts = new();

    public CatalogViewModel(IProductService productService)
    {
        _productService = productService;
    }

    [RelayCommand]
    private async Task LoadProductsAsync()
    {
        if (IsLoading)
            return;

        try
        {
            IsLoading = true;
            _allProducts = await _productService.GetProductsAsync();

            Products.Clear();
            foreach (var product in _allProducts)
            {
                Products.Add(product);
            }

            if (!_allProducts.Any())
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
    private async Task RefreshProductsAsync()
    {
        try
        {
            IsRefreshing = true;
            _allProducts = await _productService.GetProductsAsync();

            Products.Clear();
            foreach (var product in _allProducts)
            {
                Products.Add(product);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error refreshing products: {ex.Message}");
        }
        finally
        {
            IsRefreshing = false;
        }
    }

    [RelayCommand]
    private void SearchProducts()
    {
        if (string.IsNullOrWhiteSpace(SearchText))
        {
            Products.Clear();
            foreach (var product in _allProducts)
            {
                Products.Add(product);
            }
            return;
        }

        var filtered = _allProducts
            .Where(p => p.Name.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                       p.Brand.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                       p.Type.Contains(SearchText, StringComparison.OrdinalIgnoreCase))
            .ToList();

        Products.Clear();
        foreach (var product in filtered)
        {
            Products.Add(product);
        }
    }

    [RelayCommand]
    private async Task ProductTappedAsync(Product product)
    {
        if (product == null)
            return;

        await Shell.Current.GoToAsync($"productdetail?productId={product.Id}");
    }
}
