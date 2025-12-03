using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure database based on environment
var usePostgres = builder.Configuration.GetValue<bool>("UsePostgreSQL");
builder.Services.AddDbContext<StoreContext>(opt =>
{
	if (usePostgres)
	{
		var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");
		opt.UseNpgsql(connectionString);
		Console.WriteLine("Using PostgreSQL database");
	}
	else
	{
		opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
		Console.WriteLine("Using SQLite database");
	}
});
builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
	opt.User.RequireUniqueEmail = true;
})
	.AddRoles<IdentityRole>()
	.AddEntityFrameworkStores<StoreContext>()
;

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(opt =>
{
	opt.AllowAnyHeader()
	   .AllowAnyMethod()
	   .AllowCredentials()
	   .WithOrigins("https://localhost:3000")
	   .SetIsOriginAllowedToAllowWildcardSubdomains();

	opt.WithExposedHeaders("*");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();

DbInitializer.InitDb(app);

app.Run();
