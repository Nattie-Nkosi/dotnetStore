using Microsoft.Extensions.Logging;
using MobileApp.Pages;
using MobileApp.Services;
using MobileApp.ViewModels;

namespace MobileApp;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

#if DEBUG
		builder.Logging.AddDebug();
#endif

		// Create shared HttpClient handler with cookie support
		var cookieContainer = new System.Net.CookieContainer();

		builder.Services.AddHttpClient<IProductService, ProductService>(client =>
		{
#if WINDOWS
			client.BaseAddress = new Uri("https://localhost:5001/api/");
#elif ANDROID
			client.BaseAddress = new Uri("https://10.0.2.2:5001/api/");
#else
			client.BaseAddress = new Uri("https://localhost:5001/api/");
#endif
			client.Timeout = TimeSpan.FromSeconds(30);
		})
		.ConfigurePrimaryHttpMessageHandler(() =>
		{
#if WINDOWS
			var handler = new HttpClientHandler();
			handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
			handler.UseCookies = true;
			handler.CookieContainer = cookieContainer;
			return handler;
#elif ANDROID
			var handler = new Xamarin.Android.Net.AndroidMessageHandler();
			handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
			return handler;
#else
			return new HttpClientHandler
			{
				ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true,
				UseCookies = true,
				CookieContainer = cookieContainer
			};
#endif
		});

		builder.Services.AddHttpClient<IBasketService, BasketService>(client =>
		{
#if WINDOWS
			client.BaseAddress = new Uri("https://localhost:5001/api/");
#elif ANDROID
			client.BaseAddress = new Uri("https://10.0.2.2:5001/api/");
#else
			client.BaseAddress = new Uri("https://localhost:5001/api/");
#endif
			client.Timeout = TimeSpan.FromSeconds(30);
		})
		.ConfigurePrimaryHttpMessageHandler(() =>
		{
#if WINDOWS
			var handler = new HttpClientHandler();
			handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
			handler.UseCookies = true;
			handler.CookieContainer = cookieContainer;
			return handler;
#elif ANDROID
			var handler = new Xamarin.Android.Net.AndroidMessageHandler();
			handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
			return handler;
#else
			return new HttpClientHandler
			{
				ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true,
				UseCookies = true,
				CookieContainer = cookieContainer
			};
#endif
		});

		builder.Services.AddSingleton<HomeViewModel>();
		builder.Services.AddSingleton<CatalogViewModel>();
		builder.Services.AddSingleton<BasketViewModel>();
		builder.Services.AddTransient<ProductDetailViewModel>();

		builder.Services.AddSingleton<HomePage>();
		builder.Services.AddSingleton<CatalogPage>();
		builder.Services.AddSingleton<BasketPage>();
		builder.Services.AddTransient<ProductDetailPage>();

		return builder.Build();
	}
}
