using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ProductsController(StoreContext context) : ControllerBase
	{
		private readonly StoreContext context = context;

		[HttpGet]
		public ActionResult<List<Product>> GetProducts()
		{
			return context.Products.ToList();
		}
		
		[HttpGet("{id}")]
		public ActionResult<Product> GetProduct(int id)
		{
			var product = context.Products.Find(id);
			if (product == null) return NotFound();
			return product;
		}
	}
}
