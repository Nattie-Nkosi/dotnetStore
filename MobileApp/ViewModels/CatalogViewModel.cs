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

    [ObservableProperty]
    private ObservableCollection<string> brands = new();

    [ObservableProperty]
    private ObservableCollection<string> types = new();

    [ObservableProperty]
    private string? selectedBrand;

    [ObservableProperty]
    private string? selectedType;

    [ObservableProperty]
    private string selectedSortOption = "Name A-Z";

    [ObservableProperty]
    private bool showInStockOnly = false;

    [ObservableProperty]
    private bool isFilterVisible = false;

    public ObservableCollection<string> SortOptions { get; } = new()
    {
        "Name A-Z",
        "Name Z-A",
        "Price: Low to High",
        "Price: High to Low",
        "Stock: High to Low"
    };

    private List<Product> _allProducts = new();

    public CatalogViewModel(IProductService productService)
    {
        _productService = productService;
    }

    partial void OnSearchTextChanged(string value)
    {
        ApplyFiltersAndSort();
    }

    partial void OnSelectedBrandChanged(string? value)
    {
        ApplyFiltersAndSort();
    }

    partial void OnSelectedTypeChanged(string? value)
    {
        ApplyFiltersAndSort();
    }

    partial void OnSelectedSortOptionChanged(string value)
    {
        ApplyFiltersAndSort();
    }

    partial void OnShowInStockOnlyChanged(bool value)
    {
        ApplyFiltersAndSort();
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

            Brands.Clear();
            Brands.Add("All Brands");
            var uniqueBrands = _allProducts.Select(p => p.Brand).Distinct().OrderBy(b => b);
            foreach (var brand in uniqueBrands)
            {
                Brands.Add(brand);
            }

            Types.Clear();
            Types.Add("All Types");
            var uniqueTypes = _allProducts.Select(p => p.Type).Distinct().OrderBy(t => t);
            foreach (var type in uniqueTypes)
            {
                Types.Add(type);
            }

            ApplyFiltersAndSort();

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

            Brands.Clear();
            Brands.Add("All Brands");
            var uniqueBrands = _allProducts.Select(p => p.Brand).Distinct().OrderBy(b => b);
            foreach (var brand in uniqueBrands)
            {
                Brands.Add(brand);
            }

            Types.Clear();
            Types.Add("All Types");
            var uniqueTypes = _allProducts.Select(p => p.Type).Distinct().OrderBy(t => t);
            foreach (var type in uniqueTypes)
            {
                Types.Add(type);
            }

            ApplyFiltersAndSort();
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
        ApplyFiltersAndSort();
    }

    [RelayCommand]
    private void ToggleFilter()
    {
        IsFilterVisible = !IsFilterVisible;
    }

    [RelayCommand]
    private void ClearFilters()
    {
        SelectedBrand = null;
        SelectedType = null;
        ShowInStockOnly = false;
        SearchText = string.Empty;
        SelectedSortOption = "Name A-Z";
    }

    private void ApplyFiltersAndSort()
    {
        var filtered = _allProducts.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(SearchText))
        {
            filtered = filtered.Where(p =>
                p.Name.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                p.Brand.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                p.Type.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                p.Description.Contains(SearchText, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(SelectedBrand) && SelectedBrand != "All Brands")
        {
            filtered = filtered.Where(p => p.Brand == SelectedBrand);
        }

        if (!string.IsNullOrWhiteSpace(SelectedType) && SelectedType != "All Types")
        {
            filtered = filtered.Where(p => p.Type == SelectedType);
        }

        if (ShowInStockOnly)
        {
            filtered = filtered.Where(p => p.IsInStock);
        }

        var sorted = SelectedSortOption switch
        {
            "Name A-Z" => filtered.OrderBy(p => p.Name),
            "Name Z-A" => filtered.OrderByDescending(p => p.Name),
            "Price: Low to High" => filtered.OrderBy(p => p.Price),
            "Price: High to Low" => filtered.OrderByDescending(p => p.Price),
            "Stock: High to Low" => filtered.OrderByDescending(p => p.QuantityInStock),
            _ => filtered.OrderBy(p => p.Name)
        };

        Products.Clear();
        foreach (var product in sorted)
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
