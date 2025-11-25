using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser
{
	public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
