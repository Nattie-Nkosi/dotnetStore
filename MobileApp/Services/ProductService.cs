using System.Net.Http.Json;
using System.Diagnostics;
using MobileApp.Models;

namespace MobileApp.Services;

public class ProductService : IProductService
{
    private readonly HttpClient _httpClient;

    public ProductService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<Product>> GetProductsAsync()
    {
        try
        {
            Debug.WriteLine($"[ProductService] Requesting products from: {_httpClient.BaseAddress}products");

            var response = await _httpClient.GetAsync("products");

            Debug.WriteLine($"[ProductService] Response Status: {response.StatusCode}");

            if (response.IsSuccessStatusCode)
            {
                var products = await response.Content.ReadFromJsonAsync<List<Product>>();
                Debug.WriteLine($"[ProductService] Received {products?.Count ?? 0} products");

                if (products != null && products.Any())
                {
                    var firstProduct = products.First();
                    Debug.WriteLine($"[ProductService] First product: {firstProduct.Name}");
                    Debug.WriteLine($"[ProductService] PictureUrl: {firstProduct.PictureUrl}");
                    Debug.WriteLine($"[ProductService] FullImageUrl: {firstProduct.FullImageUrl}");
                }

                return products ?? new List<Product>();
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"[ProductService] Error: {response.StatusCode} - {errorContent}");
                return new List<Product>();
            }
        }
        catch (HttpRequestException ex)
        {
            Debug.WriteLine($"[ProductService] HTTP Error: {ex.Message}");
            Debug.WriteLine($"[ProductService] InnerException: {ex.InnerException?.Message}");
            throw new Exception($"Network error: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[ProductService] Error fetching products: {ex.Message}");
            Debug.WriteLine($"[ProductService] StackTrace: {ex.StackTrace}");
            throw new Exception($"Failed to load products: {ex.Message}", ex);
        }
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        try
        {
            Debug.WriteLine($"[ProductService] Requesting product {id} from: {_httpClient.BaseAddress}products/{id}");

            var response = await _httpClient.GetAsync($"products/{id}");

            if (response.IsSuccessStatusCode)
            {
                var product = await response.Content.ReadFromJsonAsync<Product>();
                Debug.WriteLine($"[ProductService] Received product: {product?.Name}");
                return product;
            }
            else
            {
                Debug.WriteLine($"[ProductService] Error: {response.StatusCode}");
                return null;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[ProductService] Error fetching product {id}: {ex.Message}");
            throw new Exception($"Failed to load product: {ex.Message}", ex);
        }
    }
}
