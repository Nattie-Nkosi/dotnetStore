using MobileApp.ViewModels;

namespace MobileApp.Pages;

public partial class BasketPage : ContentPage
{
    private readonly BasketViewModel _viewModel;

    public BasketPage(BasketViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.LoadBasketCommand.ExecuteAsync(null);
    }
}
