using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class ProductsController(StoreContext context, IMapper mapper, ImageService imageService) : BaseApiController
	{
		private readonly StoreContext context = context;
		private readonly IMapper mapper = mapper;
		private readonly ImageService imageService = imageService;

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

		[Authorize(Roles = "Admin")]
		[HttpPost]
		public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto createProductDto, IFormFile? file)
		{
			var product = mapper.Map<Product>(createProductDto);

			if (file != null)
			{
				var imageResult = await imageService.AddImageAsync(file);
				if (imageResult.Error != null)
					return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

				product.PictureUrl = imageResult.SecureUrl.ToString();
				product.PublicId = imageResult.PublicId;
			}

			context.Products.Add(product);
			await context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
		}

		[Authorize(Roles = "Admin")]
		[HttpPut]
		public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto updateProductDto, IFormFile? file)
		{
			var product = await context.Products.FindAsync(updateProductDto.Id);
			if (product == null) return NotFound();

			mapper.Map(updateProductDto, product);

			if (file != null)
			{
				if (!string.IsNullOrEmpty(product.PublicId))
				{
					await imageService.DeleteImageAsync(product.PublicId);
				}

				var imageResult = await imageService.AddImageAsync(file);
				if (imageResult.Error != null)
					return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

				product.PictureUrl = imageResult.SecureUrl.ToString();
				product.PublicId = imageResult.PublicId;
			}

			product.Id = updateProductDto.Id;

			var result = await context.SaveChangesAsync() > 0;
			if (result) return Ok(product);

			return BadRequest(new ProblemDetails { Title = "Problem updating product" });
		}

		[Authorize(Roles = "Admin")]
		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteProduct(int id)
		{
			var product = await context.Products.FindAsync(id);
			if (product == null) return NotFound();

			if (!string.IsNullOrEmpty(product.PublicId))
			{
				await imageService.DeleteImageAsync(product.PublicId);
			}

			context.Products.Remove(product);

			var result = await context.SaveChangesAsync() > 0;
			if (result) return NoContent();

			return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
		}
	}
}
