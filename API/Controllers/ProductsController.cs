using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class ProductsController(StoreContext context) : BaseApiController
	{
		private readonly StoreContext context = context;

		[HttpGet]
		public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductParams productParams)
		{
			var query = context.Products
				.Search(productParams.SearchTerm)
				.Filter(productParams.Brands, productParams.Types)
				.Sort(productParams.OrderBy);

			var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

			Response.AddPaginationHeader(products.MetaData);

			return products.Items;
		}
		
		[HttpGet("{id}")]
		public async Task<ActionResult<Product>> GetProduct(int id)
		{
			var product = await context.Products.FindAsync(id);
			if (product == null) return NotFound();
			return product;
		}

		[HttpGet("filters")]
		public async Task<IActionResult> GetFilters()
		{
			var brands = await context.Products.Select(p => p.Brand).Distinct().ToListAsync();
			var types = await context.Products.Select(p => p.Type).Distinct().ToListAsync();

			return Ok(new { brands, types });
		}
	}
}
