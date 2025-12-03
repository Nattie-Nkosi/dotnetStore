using MobileApp.ViewModels;

namespace MobileApp.Pages;

public partial class ProductDetailPage : ContentPage
{
    public ProductDetailPage(ProductDetailViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    private async void OnBackToCatalogClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//CatalogPage");
    }
}
