# Quick Start Guide

Get DotnetStore running locally in 5 minutes!

## Option 1: SQLite (Easiest - Default)

### Backend
```bash
cd API
dotnet restore
dotnet watch run
```
API runs at: `https://localhost:5001`

### Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs at: `https://localhost:3000`

**Done!** Database is auto-created with sample data.

---

## Option 2: PostgreSQL with Docker

### 1. Start PostgreSQL
```bash
# In project root
docker-compose up -d
```

### 2. Switch to PostgreSQL
Edit `API/appsettings.Development.json`:
```json
{
  "UsePostgreSQL": true
}
```

### 3. Run Migrations
```bash
cd API
dotnet ef database update
```

### 4. Start API
```bash
dotnet watch run
```

### 5. Start Frontend
```bash
cd client
npm run dev
```

**Access:**
- Frontend: `https://localhost:3000`
- API: `https://localhost:5001`
- pgAdmin: `http://localhost:5050`

---

## Test the Application

### 1. Browse Products
Go to `https://localhost:3000` → Click "Browse Products"

### 2. Add to Cart
Click any product → "Add to Cart"

### 3. Register Account
Click "Login" → "Register" → Fill form

### 4. Checkout
Go to cart → "Checkout" → Use test card:
- **Card:** 4242 4242 4242 4242
- **Expiry:** Any future date
- **CVC:** Any 3 digits

### 5. View Order
After payment → See "Order Success" page

---

## Stripe Webhook Testing (Optional)

### 1. Install Stripe CLI
```bash
scoop install stripe  # Windows
# or
brew install stripe/stripe-cli/stripe  # macOS
```

### 2. Listen for Webhooks
```bash
stripe listen --forward-to https://localhost:5001/api/webhook
```

Copy the webhook secret (starts with `whsec_`)

### 3. Update Config
Add to `API/appsettings.Development.json`:
```json
{
  "StripeSettings": {
    "WebhookSecret": "whsec_your_secret_here"
  }
}
```

### 4. Test Webhook
```bash
stripe trigger payment_intent.succeeded
```

Check API logs for webhook processing!

---

## Useful Commands

### Docker
```bash
docker-compose up -d          # Start PostgreSQL
docker-compose down           # Stop PostgreSQL
docker-compose logs postgres  # View logs
```

### Database
```bash
# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigration
```

### Frontend
```bash
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # Check code quality
```

---

## Troubleshooting

### API won't start
- Check if port 5001 is in use
- Run `dotnet restore` in API folder
- Check `appsettings.Development.json` is valid JSON

### Frontend won't start
- Run `npm install` in client folder
- Check if port 3000 is in use
- Clear node_modules: `rm -rf node_modules && npm install`

### Database errors
- **SQLite:** Delete `API/store.db` and restart API
- **PostgreSQL:** Run `docker-compose down -v` and start fresh

### CORS errors
- Make sure API is running
- Check `Program.cs` allows `https://localhost:3000`
- Try clearing browser cache

---

## Next Steps

- [Database Setup Guide](DATABASE_SETUP.md) - Detailed PostgreSQL setup
- [Frontend Deployment](client/DEPLOYMENT.md) - Deploy React app
- [README](README.md) - Full project documentation

Happy coding! 🚀
