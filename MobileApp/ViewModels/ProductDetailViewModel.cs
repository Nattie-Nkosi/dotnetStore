using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MobileApp.Models;
using MobileApp.Services;

namespace MobileApp.ViewModels;

[QueryProperty(nameof(ProductId), "productId")]
public partial class ProductDetailViewModel : ObservableObject
{
    private readonly IProductService _productService;
    private readonly IBasketService _basketService;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private bool isAddingToCart;

    [ObservableProperty]
    private Product? product;

    [ObservableProperty]
    private int quantity = 1;

    [ObservableProperty]
    private int productId;

    public ProductDetailViewModel(IProductService productService, IBasketService basketService)
    {
        _productService = productService;
        _basketService = basketService;
    }

    partial void OnProductIdChanged(int value)
    {
        if (value > 0)
        {
            _ = LoadProductAsync(value);
        }
    }

    [RelayCommand]
    private async Task LoadProductAsync(int productId)
    {
        if (IsLoading)
            return;

        try
        {
            IsLoading = true;
            Product = await _productService.GetProductByIdAsync(productId);

            if (Product == null)
            {
                await Shell.Current.DisplayAlert(
                    "Error",
                    "Product not found",
                    "OK");
                await Shell.Current.GoToAsync("..");
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to load product:\n\n{ex.Message}",
                "OK");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private void IncreaseQuantity()
    {
        if (Product != null && Quantity < Product.QuantityInStock)
        {
            Quantity++;
        }
    }

    [RelayCommand]
    private void DecreaseQuantity()
    {
        if (Quantity > 1)
        {
            Quantity--;
        }
    }

    [RelayCommand]
    private async Task AddToCartAsync()
    {
        if (Product == null || IsAddingToCart)
            return;

        try
        {
            IsAddingToCart = true;

            await _basketService.AddItemToBasketAsync(Product.Id, Quantity);

            bool goToCart = await Shell.Current.DisplayAlert(
                "Added to Cart",
                $"{Quantity} x {Product.Name} added to your cart!",
                "View Cart",
                "Continue Shopping");

            if (goToCart)
            {
                await Shell.Current.GoToAsync("//BasketPage");
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert(
                "Error",
                $"Failed to add to cart:\n\n{ex.Message}",
                "OK");
        }
        finally
        {
            IsAddingToCart = false;
        }
    }
}
