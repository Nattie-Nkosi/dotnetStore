using Microsoft.AspNetCore.Mvc;
using Stripe;
using AppOrderService = API.Services.OrderService;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhookController : ControllerBase
{
	private readonly IConfiguration _config;
	private readonly AppOrderService _orderService;
	private readonly ILogger<WebhookController> _logger;

	public WebhookController(IConfiguration config, AppOrderService orderService, ILogger<WebhookController> logger)
	{
		_config = config;
		_orderService = orderService;
		_logger = logger;
	}

	[HttpPost]
	public async Task<IActionResult> Index()
	{
		var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

		try
		{
			var stripeSignature = Request.Headers["Stripe-Signature"].ToString();
			var webhookSecret = _config["StripeSettings:WebhookSecret"];

			if (string.IsNullOrEmpty(webhookSecret))
			{
				_logger.LogError("Webhook secret is not configured");
				return BadRequest("Webhook secret not configured");
			}

			var stripeEvent = EventUtility.ConstructEvent(
				json,
				stripeSignature,
				webhookSecret
			);

			_logger.LogInformation("Received Stripe webhook event: {EventType}", stripeEvent.Type);

			if (stripeEvent.Type == "payment_intent.succeeded")
			{
				var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
				if (paymentIntent != null)
				{
					_logger.LogInformation("Processing payment_intent.succeeded for PaymentIntent: {PaymentIntentId}", paymentIntent.Id);

					var order = await _orderService.CreateOrderFromPaymentIntent(paymentIntent.Id);

					if (order != null)
					{
						_logger.LogInformation("Order {OrderId} created successfully via webhook for PaymentIntent: {PaymentIntentId}",
							order.Id, paymentIntent.Id);
					}
					else
					{
						_logger.LogWarning("Failed to create order for PaymentIntent: {PaymentIntentId}. Order may already exist or basket not found.",
							paymentIntent.Id);
					}
				}
			}
			else if (stripeEvent.Type == "payment_intent.payment_failed")
			{
				var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
				if (paymentIntent != null)
				{
					_logger.LogWarning("Payment failed for PaymentIntent: {PaymentIntentId}", paymentIntent.Id);
				}
			}
			else
			{
				_logger.LogInformation("Unhandled event type: {EventType}", stripeEvent.Type);
			}

			return Ok();
		}
		catch (StripeException e)
		{
			_logger.LogError(e, "Stripe webhook signature verification failed");
			return BadRequest();
		}
		catch (Exception e)
		{
			_logger.LogError(e, "Error processing webhook");
			return StatusCode(500);
		}
	}
}
