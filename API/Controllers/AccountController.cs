using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class AccountController(UserManager<User> userManager, SignInManager<User> signInManager, StoreContext context) : BaseApiController
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

		[HttpGet("user-info")]
		public async Task<ActionResult> GetUserInfo()
		{
			if (User?.Identity?.IsAuthenticated != true)
			{
				return NoContent();
			}

			var user = await userManager.GetUserAsync(User);

			if (user == null)
			{
				return Unauthorized();
			}

			return Ok(new
			{
				user.Email,
				user.UserName,
				Roles = await userManager.GetRolesAsync(user)
			});
		}

		[HttpPost("logout")]
		public async Task<ActionResult> Logout()
		{
			await signInManager.SignOutAsync();
			return NoContent();
		}

		[Authorize]
		[HttpGet("address")]
		public async Task<ActionResult<Address>> GetSavedAddress()
		{
			var user = await context.Users
				.Include(u => u.Address)
				.FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name);

			if (user == null) return Unauthorized();

			if (user.Address == null) return NoContent();

			return Ok(user.Address);
		}

		[Authorize]
		[HttpPost("address")]
		public async Task<ActionResult<Address>> CreateOrUpdateAddress(AddressDto addressDto)
		{
			var user = await context.Users
				.Include(u => u.Address)
				.FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name);

			if (user == null) return Unauthorized();

			if (user.Address == null)
			{
				user.Address = new Address
				{
					Name = addressDto.Name,
					Line1 = addressDto.Line1,
					Line2 = addressDto.Line2,
					City = addressDto.City,
					State = addressDto.State,
					PostalCode = addressDto.PostalCode,
					Country = addressDto.Country
				};
			}
			else
			{
				user.Address.Name = addressDto.Name;
				user.Address.Line1 = addressDto.Line1;
				user.Address.Line2 = addressDto.Line2;
				user.Address.City = addressDto.City;
				user.Address.State = addressDto.State;
				user.Address.PostalCode = addressDto.PostalCode;
				user.Address.Country = addressDto.Country;
			}

			var result = await context.SaveChangesAsync() > 0;

			if (result) return Ok(user.Address);

			return BadRequest("Problem saving address");
		}
	}
}
