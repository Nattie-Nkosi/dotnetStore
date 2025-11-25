using API.Entities;

namespace API.Extensions
{
	public static class ProductExtensions
	{
		public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
		{
			if (string.IsNullOrWhiteSpace(orderBy))
			{
				return query.OrderBy(p => p.Name);
			}

			query = orderBy.ToLower() switch
			{
				"name" => query.OrderBy(p => p.Name),
				"price" => query.OrderBy(p => p.Price),
				"priceDesc" => query.OrderByDescending(p => p.Price),
				_ => query.OrderBy(p => p.Name)
			};

			return query;
		}

		public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
		{
			if (string.IsNullOrWhiteSpace(searchTerm))
			{
				return query;
			}

			var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

			return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm) ||
									p.Brand.ToLower().Contains(lowerCaseSearchTerm) ||
									p.Type.ToLower().Contains(lowerCaseSearchTerm) ||
									p.Description.ToLower().Contains(lowerCaseSearchTerm));
		}

		public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? types)
		{
			var brandList = new List<string>();
			var typeList = new List<string>();

			if (!string.IsNullOrWhiteSpace(brands))
			{
				brandList.AddRange(brands.ToLower().Split(",").Select(b => b.Trim()));
			}

			if (!string.IsNullOrWhiteSpace(types))
			{
				typeList.AddRange(types.ToLower().Split(",").Select(t => t.Trim()));
			}

			if (brandList.Any())
			{
				query = query.Where(p => brandList.Contains(p.Brand.ToLower()));
			}

			if (typeList.Any())
			{
				query = query.Where(p => typeList.Contains(p.Type.ToLower()));
			}

			return query;
		}
	}
}
