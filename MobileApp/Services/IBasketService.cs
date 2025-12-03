using MobileApp.Models;

namespace MobileApp.Services;

public interface IBasketService
{
    Task<Basket?> GetBasketAsync();
    Task<Basket?> AddItemToBasketAsync(int productId, int quantity);
    Task<bool> RemoveItemFromBasketAsync(int productId, int quantity);
    Task<bool> ClearBasketAsync();
}
