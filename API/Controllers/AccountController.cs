using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	public class AccountController(UserManager<User> userManager) : BaseApiController
	{
		[HttpPost("register")]
		public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
		{
			var user = new User
			{
				UserName = registerDto.Email,
				Email = registerDto.Email
			};

			var result = await userManager.CreateAsync(user, registerDto.Password);

			if (!result.Succeeded)
			{
				foreach (var error in result.Errors)
				{
					ModelState.AddModelError(error.Code, error.Description);
				}
				return ValidationProblem();
			}

			await userManager.AddToRoleAsync(user, "Member");

			return StatusCode(201);
		}

		[HttpGet("currentUser")]
		public async Task<ActionResult> GetCurrentUser()
		{
			var user = await userManager.FindByNameAsync(User.Identity?.Name ?? "");

			if (user == null) return Unauthorized();

			return Ok(new
			{
				email = user.Email,
				username = user.UserName
			});
		}
	}
}
