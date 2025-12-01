# Render.com Deployment Guide

Complete guide to deploying DotnetStore backend to Render.com

## Prerequisites

- GitHub account
- Render.com account (free tier)
- Your code pushed to GitHub

## Step 1: Push Your Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Create PostgreSQL Database on Render

### 2.1 Create Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name:** `dotnetstore-db`
   - **Database:** `dotnetstore`
   - **User:** `dotnetstore` (auto-filled)
   - **Region:** Choose closest to you (e.g., Oregon US West)
   - **PostgreSQL Version:** `16`
   - **Datadog API Key:** Leave blank
   - **Plan:** **Free**

4. Click **Create Database**

### 2.2 Get Connection Details

After creation, you'll see:
- **Status:** Available (wait for this)
- **Internal Database URL**
- **External Database URL**
- **PSQL Command**

**Copy the Internal Database URL** - it looks like:
```
postgres://dotnetstore:some_password_here@dpg-xxxxx-oregon-postgres.render.com/dotnetstore
```

### 2.3 Convert to .NET Connection String

Convert the URL to .NET format:

**From:**
```
postgres://dotnetstore:password@dpg-xxxxx.oregon-postgres.render.com/dotnetstore
```

**To:**
```
Host=dpg-xxxxx.oregon-postgres.render.com;Database=dotnetstore;Username=dotnetstore;Password=password;SSL Mode=Require
```

**Keep this handy!**

---

## Step 3: Deploy Backend API to Render

### 3.1 Create Web Service

1. In Render Dashboard, click **New** → **Web Service**
2. Click **Connect a repository**
3. Grant Render access to your GitHub repositories
4. Select your `DotnetStore` repository

### 3.2 Configure Web Service

**Basic Settings:**
- **Name:** `dotnetstore-api`
- **Region:** Same as database (e.g., Oregon)
- **Branch:** `main`
- **Root Directory:** `API`
- **Runtime:** `Docker` (Render auto-detects .NET)

**Build Settings:**
- **Build Command:**
  ```bash
  dotnet publish -c Release -o out
  ```

- **Start Command:**
  ```bash
  cd out && dotnet API.dll
  ```

**Instance Type:**
- Select **Free**

### 3.3 Environment Variables

Click **Advanced** → **Add Environment Variable**

Add these one by one:

| Key | Value |
|-----|-------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ASPNETCORE_URLS` | `http://0.0.0.0:$PORT` |
| `UsePostgreSQL` | `true` |
| `ConnectionStrings__PostgresConnection` | *Your connection string from Step 2.3* |
| `StripeSettings__SecretKey` | `sk_test_your_stripe_secret_key` |
| `StripeSettings__PublishableKey` | `pk_test_your_stripe_publishable_key` |
| `StripeSettings__WebhookSecret` | *Leave empty for now* |

**Example connection string:**
```
Host=dpg-abc123.oregon-postgres.render.com;Database=dotnetstore;Username=dotnetstore;Password=xyz123;SSL Mode=Require
```

### 3.4 Deploy

1. Click **Create Web Service**
2. Render will:
   - Clone your repository
   - Build your .NET application
   - Deploy it
   - Give you a URL like: `https://dotnetstore-api.onrender.com`

**Wait for deployment** (takes 5-10 minutes first time)

---

## Step 4: Run Database Migrations

### Option A: From Your Local Machine (Recommended)

```bash
cd API

# Set the production connection string temporarily
$env:ConnectionStrings__PostgresConnection="Host=dpg-xxxxx.oregon-postgres.render.com;Database=dotnetstore;Username=dotnetstore;Password=xxx;SSL Mode=Require"

# Run migrations
dotnet ef database update

# Clear the environment variable
Remove-Item Env:\ConnectionStrings__PostgresConnection
```

### Option B: Add Migration Script to Render

Add this to your `API/Program.cs` before `app.Run()`:

```csharp
// Auto-run migrations on startup (production)
if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
    await context.Database.MigrateAsync();
    Console.WriteLine("Database migrations applied successfully");
}
```

Then redeploy on Render.

---

## Step 5: Test Your API

### 5.1 Check Deployment Status

In Render dashboard:
- **Status:** Should show "Live"
- **Logs:** Check for "Using PostgreSQL database"

### 5.2 Test Endpoints

```bash
# Replace with your actual Render URL
export API_URL=https://dotnetstore-api.onrender.com

# Test products endpoint
curl $API_URL/api/products

# Should return JSON with products
```

If you see products, **congratulations!** 🎉 Your API is live!

---

## Step 6: Configure CORS for Frontend

Update `API/Program.cs`:

```csharp
app.UseCors(opt =>
{
    opt.AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials()
       .WithOrigins(
           "https://localhost:3000",                    // Local dev
           "https://your-frontend.vercel.app"           // Production (add after deploying frontend)
       );
});
```

Commit and push to trigger redeployment.

---

## Step 7: Setup Stripe Webhook (Production)

### 7.1 Add Webhook Endpoint in Stripe

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. **Endpoint URL:** `https://dotnetstore-api.onrender.com/api/webhook`
4. **Events to send:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**

### 7.2 Copy Webhook Signing Secret

After creating, click on the webhook and copy the **Signing secret** (starts with `whsec_`)

### 7.3 Update Render Environment Variable

1. Go to Render dashboard → Your web service
2. Go to **Environment** tab
3. Update:
   - **Key:** `StripeSettings__WebhookSecret`
   - **Value:** `whsec_your_secret_here`
4. Click **Save Changes**

Render will automatically redeploy.

---

## Step 8: Verify Everything Works

### Check Database
```bash
# Connect to production database (use External URL from Render)
psql postgres://dotnetstore:password@dpg-xxxxx.oregon-postgres.render.com/dotnetstore

# List tables
\dt

# Check products
SELECT * FROM "Products" LIMIT 5;

# Exit
\q
```

### Test API Endpoints
```bash
# Products
curl https://dotnetstore-api.onrender.com/api/products

# Should return product list
```

---

## Troubleshooting

### Build Failed

**Check Render logs:**
- Look for .NET SDK errors
- Verify `API.csproj` is valid
- Check all packages restore correctly

**Solution:**
```bash
# Test locally first
cd API
dotnet clean
dotnet restore
dotnet build
dotnet publish -c Release -o out
```

### Database Connection Failed

**Check:**
- Connection string format is correct
- Database is "Available" in Render dashboard
- Using **Internal Database URL** (not External)
- SSL Mode is set to `Require`

**Test connection string locally:**
```bash
cd API
$env:ConnectionStrings__PostgresConnection="Your-Connection-String"
dotnet run
```

### API Returns 500 Errors

**Check Render logs:**
```bash
# In Render dashboard → Logs tab
# Look for exceptions and stack traces
```

**Common issues:**
- Missing environment variables
- Database migration not run
- CORS configuration

### Cold Starts (Free Tier)

**Render free tier spins down after 15 minutes of inactivity**

- First request takes 30-60 seconds
- Subsequent requests are fast
- Acceptable for portfolio projects

**To keep alive:** Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your API every 5 minutes

---

## Post-Deployment Checklist

- [ ] API is live and returns data
- [ ] Database has sample products
- [ ] CORS is configured for frontend
- [ ] Stripe webhook is configured
- [ ] All environment variables are set
- [ ] Database migrations are applied
- [ ] API URL is noted for frontend deployment

---

## Production Best Practices

### Security
- [ ] Use production Stripe keys (not test keys)
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Never commit connection strings to Git
- [ ] Use Render environment variables for all secrets

### Monitoring
- [ ] Check Render logs regularly
- [ ] Set up Stripe webhook monitoring
- [ ] Monitor database size (free tier: 1GB)

### Performance
- [ ] Database has indexes on frequently queried fields
- [ ] API responses are optimized
- [ ] Consider upgrading to paid tier for production apps

---

## Costs

**Render Free Tier:**
- ✅ PostgreSQL: 1 GB storage, expires after 90 days
- ✅ Web Service: 750 hours/month
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min inactivity

**After 90 days**, upgrade PostgreSQL to:
- **Starter:** $7/month (keeps data forever)

---

## Next Steps

After backend is deployed:

1. **Test API thoroughly** with Postman/curl
2. **Note your API URL** for frontend configuration
3. **Deploy frontend** to Vercel/Netlify
4. **Update CORS** to include frontend URL
5. **Test full application** end-to-end

---

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

---

## Your Deployment URLs

**Fill these in after deployment:**

- **API URL:** `https://dotnetstore-api.onrender.com`
- **Database:** `dpg-xxxxx.oregon-postgres.render.com`
- **Stripe Webhook:** `https://dotnetstore-api.onrender.com/api/webhook`

**Save these!** You'll need them for frontend deployment.

Good luck with your deployment! 🚀
