using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
	//public required string Username { get; set; }
	[Required]
	public required string Email { get; set; } = string.Empty;
	public required string Password { get; set; }
}
