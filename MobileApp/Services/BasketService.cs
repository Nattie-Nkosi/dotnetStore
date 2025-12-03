using System.Net.Http.Json;
using System.Diagnostics;
using MobileApp.Models;

namespace MobileApp.Services;

public class BasketService : IBasketService
{
    private readonly HttpClient _httpClient;

    public BasketService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<Basket?> GetBasketAsync()
    {
        try
        {
            Debug.WriteLine($"[BasketService] Getting basket from: {_httpClient.BaseAddress}basket");

            var response = await _httpClient.GetAsync("basket");

            Debug.WriteLine($"[BasketService] Response Status: {response.StatusCode}");

            if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                Debug.WriteLine("[BasketService] No basket found (204)");
                return null;
            }

            if (response.IsSuccessStatusCode)
            {
                var basket = await response.Content.ReadFromJsonAsync<Basket>();
                Debug.WriteLine($"[BasketService] Received basket with {basket?.Items.Count ?? 0} items");
                return basket;
            }
            else
            {
                Debug.WriteLine($"[BasketService] Error: {response.StatusCode}");
                return null;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[BasketService] Error getting basket: {ex.Message}");
            return null;
        }
    }

    public async Task<Basket?> AddItemToBasketAsync(int productId, int quantity)
    {
        try
        {
            Debug.WriteLine($"[BasketService] Adding product {productId} x{quantity} to basket");

            var response = await _httpClient.PostAsync($"basket?productId={productId}&quantity={quantity}", null);

            Debug.WriteLine($"[BasketService] Add response Status: {response.StatusCode}");

            if (response.IsSuccessStatusCode)
            {
                var basket = await response.Content.ReadFromJsonAsync<Basket>();
                Debug.WriteLine($"[BasketService] Basket now has {basket?.Items.Count ?? 0} items");
                return basket;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"[BasketService] Error adding to basket: {response.StatusCode} - {errorContent}");
                throw new Exception($"Failed to add item to basket: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[BasketService] Error adding to basket: {ex.Message}");
            throw new Exception($"Failed to add item to basket: {ex.Message}", ex);
        }
    }

    public async Task<bool> RemoveItemFromBasketAsync(int productId, int quantity)
    {
        try
        {
            Debug.WriteLine($"[BasketService] Removing product {productId} x{quantity} from basket");

            var response = await _httpClient.DeleteAsync($"basket?productId={productId}&quantity={quantity}");

            Debug.WriteLine($"[BasketService] Remove response Status: {response.StatusCode}");

            if (response.IsSuccessStatusCode)
            {
                Debug.WriteLine("[BasketService] Item removed successfully");
                return true;
            }
            else
            {
                Debug.WriteLine($"[BasketService] Error removing from basket: {response.StatusCode}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[BasketService] Error removing from basket: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> ClearBasketAsync()
    {
        try
        {
            Debug.WriteLine("[BasketService] Clearing basket");

            var response = await _httpClient.DeleteAsync("basket/clear");

            Debug.WriteLine($"[BasketService] Clear response Status: {response.StatusCode}");

            return response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.NoContent;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[BasketService] Error clearing basket: {ex.Message}");
            return false;
        }
    }
}
