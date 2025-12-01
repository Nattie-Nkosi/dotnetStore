using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
	public static string? GetUsername(this ClaimsPrincipal user)
	{
		return user.Identity?.Name;
	}

	public static string? GetUserId(this ClaimsPrincipal user)
	{
		return user.FindFirstValue(ClaimTypes.NameIdentifier);
	}
}
