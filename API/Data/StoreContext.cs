using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
	public required DbSet<Product> Products { get; set; }
	public required DbSet<Basket> Baskets { get; set; }
	public required DbSet<Address> Addresses { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
		
		builder.Entity<IdentityRole>()
			.HasData(
				new IdentityRole
				{
					Id = "d290f1ee-6c54-4b01-90e6-d701748f0851",
					Name = "Member",
					NormalizedName = "MEMBER"
				},
				new IdentityRole
				{
					Id = "c4b3017e-1d4b-4f3b-9a8f-8f2f4b5e6c7d",
					Name = "Admin",
					NormalizedName = "ADMIN"
				}
			);
		
	}
}
