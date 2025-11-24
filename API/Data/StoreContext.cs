using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : DbContext(options)
{
	public required DbSet<Product> Products { get; set; }
	public required DbSet<Basket> Baskets { get; set; }
	
	/* protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<Basket>()
			.HasMany(b => b.Items)
			.WithOne(i => i.Basket)
			.HasForeignKey(i => i.BasketId)
			.OnDelete(DeleteBehavior.Cascade);
	} */
}
