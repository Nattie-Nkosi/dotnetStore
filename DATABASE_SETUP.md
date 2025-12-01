# Database Setup Guide

This guide covers setting up PostgreSQL for local development and production deployment.

## Local Development with Docker PostgreSQL

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- .NET 9 SDK installed

### Step 1: Start PostgreSQL with Docker

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify containers are running
docker-compose ps
```

This starts:
- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (web UI for database management)

**Connection Details:**
- **Host:** localhost
- **Port:** 5432
- **Database:** dotnetstore
- **Username:** dotnetstore
- **Password:** devpassword123

### Step 2: Access pgAdmin (Optional)

1. Open browser: `http://localhost:5050`
2. Login:
   - **Email:** admin@dotnetstore.com
   - **Password:** admin123
3. Add server:
   - **Host:** postgres (container name)
   - **Port:** 5432
   - **Username:** dotnetstore
   - **Password:** devpassword123

### Step 3: Switch to PostgreSQL

Update `API/appsettings.Development.json`:

```json
{
  "UsePostgreSQL": true,
  "ConnectionStrings": {
    "PostgresConnection": "Host=localhost;Port=5432;Database=dotnetstore;Username=dotnetstore;Password=devpassword123"
  }
}
```

### Step 4: Install PostgreSQL Package

```bash
cd API
dotnet restore
```

This installs the `Npgsql.EntityFrameworkCore.PostgreSQL` package.

### Step 5: Create PostgreSQL Migrations

```bash
# Remove old SQLite migrations (optional, or keep for reference)
# rm -rf Data/Migrations

# Create new migration for PostgreSQL
dotnet ef migrations add InitialPostgres --context StoreContext

# Apply migrations to PostgreSQL
dotnet ef database update
```

### Step 6: Run the API

```bash
dotnet watch run
```

You should see: `Using PostgreSQL database`

### Stop PostgreSQL

```bash
# Stop containers
docker-compose stop

# Stop and remove containers (keeps data)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

---

## Production Deployment with Render PostgreSQL

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name:** dotnetstore-db
   - **Database:** dotnetstore
   - **User:** dotnetstore
   - **Region:** Same as your API (e.g., Oregon)
   - **PostgreSQL Version:** 16
   - **Plan:** Free
4. Click **Create Database**

### Step 2: Get Connection String

After creation, Render provides:
- **Internal Database URL** (for services in same region)
- **External Database URL** (for external connections)

Copy the **Internal Database URL** - it looks like:
```
postgres://dotnetstore:password@dpg-xxxxx/dotnetstore
```

### Step 3: Configure API on Render

When deploying your API to Render:

1. Create **Web Service**
2. Add environment variable:
   ```
   UsePostgreSQL=true
   PostgresConnection=<your-internal-database-url>
   ```

Or use connection string format:
```
Host=dpg-xxxxx.oregon-postgres.render.com;Database=dotnetstore;Username=dotnetstore;Password=your_password;SSL Mode=Require
```

### Step 4: Run Migrations on Render

**Option A: Automatic (Add to startup)**

Update `API/Program.cs` before `app.Run()`:
```csharp
// Auto-run migrations in production (use with caution)
if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
    await context.Database.MigrateAsync();
}
```

**Option B: Manual (Recommended)**

After deploying, run migrations from your local machine:

```bash
# Set production connection string
$env:ConnectionStrings__PostgresConnection="Host=dpg-xxxxx.oregon-postgres.render.com;Database=dotnetstore;Username=dotnetstore;Password=your_password;SSL Mode=Require"

# Run migrations
dotnet ef database update --project API
```

---

## Database Management

### View Data with psql

```bash
# Connect to local PostgreSQL
docker exec -it dotnetstore-postgres psql -U dotnetstore -d dotnetstore

# Common commands
\dt              # List all tables
\d+ Products     # Describe Products table
SELECT * FROM "Products";
\q               # Quit
```

### Backup Database

**Local (Docker):**
```bash
docker exec -t dotnetstore-postgres pg_dump -U dotnetstore dotnetstore > backup.sql
```

**Restore:**
```bash
docker exec -i dotnetstore-postgres psql -U dotnetstore dotnetstore < backup.sql
```

**Render:**
Use Render's dashboard backup feature or:
```bash
pg_dump <external-database-url> > backup.sql
```

---

## Switching Between SQLite and PostgreSQL

### Use SQLite (Default)
```json
{
  "UsePostgreSQL": false
}
```

### Use PostgreSQL
```json
{
  "UsePostgreSQL": true
}
```

You can keep both migration sets and switch between them easily!

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs postgres

# Remove old volumes and restart
docker-compose down -v
docker-compose up -d
```

### Connection refused
- Make sure Docker is running
- Check if port 5432 is already in use: `netstat -an | findstr 5432`
- Try restarting Docker Desktop

### Migration errors
```bash
# Drop database and recreate
docker exec -it dotnetstore-postgres psql -U dotnetstore -c "DROP DATABASE dotnetstore;"
docker exec -it dotnetstore-postgres psql -U dotnetstore -c "CREATE DATABASE dotnetstore;"

# Re-run migrations
dotnet ef database update
```

### Can't connect from API
- Verify `UsePostgreSQL: true` in appsettings
- Check connection string is correct
- Ensure PostgreSQL container is running: `docker-compose ps`

---

## Environment Variables Reference

### Local Development
```json
{
  "UsePostgreSQL": true,
  "ConnectionStrings": {
    "PostgresConnection": "Host=localhost;Port=5432;Database=dotnetstore;Username=dotnetstore;Password=devpassword123"
  }
}
```

### Render Production
```bash
UsePostgreSQL=true
ConnectionStrings__PostgresConnection=Host=dpg-xxxxx.oregon-postgres.render.com;Database=dotnetstore;Username=dotnetstore;Password=xxx;SSL Mode=Require
```

### Azure Production
```bash
UsePostgreSQL=true
ConnectionStrings__PostgresConnection=Host=xxx.postgres.database.azure.com;Database=dotnetstore;Username=dotnetstore;Password=xxx;SSL Mode=Require
```

---

## Next Steps

After setting up PostgreSQL:

1. ✅ Run `docker-compose up -d`
2. ✅ Set `UsePostgreSQL: true`
3. ✅ Run `dotnet ef database update`
4. ✅ Start API with `dotnet watch run`
5. ✅ Test with frontend

Ready to deploy to Render!
