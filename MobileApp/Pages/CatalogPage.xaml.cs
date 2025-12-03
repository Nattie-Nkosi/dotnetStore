using MobileApp.ViewModels;

namespace MobileApp.Pages;

public partial class CatalogPage : ContentPage, IQueryAttributable
{
    private readonly CatalogViewModel _viewModel;

    public CatalogPage(CatalogViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.LoadProductsCommand.ExecuteAsync(null);
    }

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query.ContainsKey("category"))
        {
            var category = query["category"]?.ToString();
            if (!string.IsNullOrWhiteSpace(category))
            {
                _viewModel.SelectedType = category;
                _viewModel.IsFilterVisible = false;
            }
        }
    }
}
