using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
	public static class HttpExtensions
	{
		public static void AddPaginationHeader(this HttpResponse response, PaginationMetadata metaData)
		{
			var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

			response.Headers.Append("Pagination", JsonSerializer.Serialize(metaData, options));
			// Note: Access-Control-Expose-Headers is already configured in CORS middleware with "*"
			// No need to manually add it here as it can cause conflicts
		}
	}
}
