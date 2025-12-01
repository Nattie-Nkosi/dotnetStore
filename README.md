# DotnetStore - Full-Stack E-Commerce Application

A modern, full-stack e-commerce application built with .NET 9 and React 19, showcasing professional web development practices and cloud-ready architecture.

![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-6.0-007FFF?logo=mui)

## Overview

DotnetStore is a comprehensive e-commerce platform demonstrating modern full-stack development skills. Built as a portfolio project, it features a robust .NET backend API, a responsive React frontend, and integration with real-world payment processing systems.

## Key Features

- **Product Catalog**: Browse products with images, descriptions, and pricing
- **Shopping Cart**: Add, update, and remove items with real-time updates
- **User Authentication**: Secure registration and login with JWT tokens
- **Authorization**: Role-based access control for admin and customer features
- **Payment Processing**: Integrated Stripe payment system with PaymentIntent
- **Stripe Webhooks**: Automated order creation via Stripe payment events
- **Order Management**: Complete order history and tracking
- **Responsive Design**: Mobile-first UI built with Material-UI v6
- **Dark Mode**: Theme switching with persistent user preferences
- **State Management**: Redux Toolkit for predictable state updates

## Technology Stack

### Backend
- **.NET 9**: Latest C# features with minimal APIs
- **Entity Framework Core**: Code-first database approach with migrations
- **SQLite**: Lightweight database for development (easily switchable to SQL Server/PostgreSQL)
- **ASP.NET Core Identity**: User authentication and authorization
- **Stripe API**: Secure payment processing

### Frontend
- **React 19**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience
- **Redux Toolkit**: State management with RTK Query for API calls
- **Material-UI v6**: Comprehensive component library with theming
- **React Router**: Client-side routing with protected routes
- **Vite**: Fast build tool and development server

### Development Tools
- **ESLint**: Code quality and consistency
- **Git**: Version control

## Project Structure

```
DotnetStore/
├── API/                          # Backend .NET API
│   ├── Controllers/              # REST API endpoints
│   ├── Data/                     # Database context and migrations
│   ├── DTOs/                     # Data transfer objects
│   ├── Entities/                 # Database models
│   ├── Extensions/               # Helper extensions
│   └── Program.cs                # Application entry point
│
├── client/                       # Frontend React application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout/          # App shell components
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   ├── routes/          # Route configuration
│   │   │   └── store/           # Redux store setup
│   │   ├── features/            # Feature-based modules
│   │   │   ├── catalog/         # Product browsing
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── checkout/        # Order checkout
│   │   │   ├── account/         # User authentication
│   │   │   └── orders/          # Order history
│   │   └── main.tsx             # Application entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional, for PostgreSQL)

### Quick Start

See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nattie-Nkosi/DotnetStore.git
   cd DotnetStore
   ```

2. **Backend Setup**
   ```bash
   cd API
   dotnet restore
   dotnet watch run
   ```
   The API will start at `https://localhost:5001`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend will start at `https://localhost:3000`

4. **Access the Application**
   - Open your browser and navigate to `https://localhost:3000`
   - The database will be automatically created and seeded with sample products

### Database Options

**SQLite (Default):** No setup required - works out of the box!

**PostgreSQL (Recommended for production):**
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Switch to PostgreSQL in appsettings.Development.json
# "UsePostgreSQL": true

# Run migrations
dotnet ef database update
```

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed PostgreSQL setup.

### Stripe Configuration

The Stripe settings are configured in `API/appsettings.Development.json`:

```json
{
  "StripeSettings": {
    "PublishableKey": "pk_test_...",
    "SecretKey": "sk_test_...",
    "WebhookSecret": ""
  }
}
```

**Important**: For production, move these to environment variables or Azure Key Vault.

### Setting Up Stripe Webhooks

Webhooks allow Stripe to notify your application when payment events occur, ensuring reliable order creation even if the client disconnects.

#### Local Development with Stripe CLI

1. **Install Stripe CLI**
   ```bash
   # Windows (using Scoop)
   scoop install stripe

   # macOS
   brew install stripe/stripe-cli/stripe

   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local API**
   ```bash
   stripe listen --forward-to https://localhost:5001/api/webhook
   ```

   This will output a webhook signing secret like `whsec_xxxxx...`

4. **Update your configuration**

   Copy the webhook secret and add it to `API/appsettings.Development.json`:
   ```json
   {
     "StripeSettings": {
       "WebhookSecret": "whsec_xxxxx..."
     }
   }
   ```

5. **Test the webhook**

   In a new terminal, trigger a test event:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

#### Production Webhook Setup

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed` (optional)
5. Copy the webhook signing secret
6. Add it to your production configuration (environment variables or Azure Key Vault)

#### How Webhooks Work in This Application

1. **Payment Intent Created**: Customer initiates checkout
2. **Payment Succeeds**: Stripe processes the payment
3. **Webhook Triggered**: Stripe sends `payment_intent.succeeded` event to your API
4. **Order Created**: Your webhook handler automatically creates the order
5. **Confirmation**: Customer sees order confirmation page

**Benefits:**
- Order creation happens server-side (more secure)
- Works even if customer closes browser after payment
- Stripe is the authoritative source of payment status
- Prevents payment manipulation from client-side

## Usage

### Customer Features
- Browse the product catalog
- Add items to your shopping cart
- Register for an account or login
- Manage your delivery address
- Complete checkout with Stripe payment
- View your order history

### Admin Features (Future Enhancement)
- Manage product inventory
- View all orders
- Update order status

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart/{productId}` - Remove item from cart

### Account
- `POST /api/account/register` - Register new user
- `POST /api/account/login` - User login
- `GET /api/account/currentUser` - Get current user details

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order

### Payment
- `POST /api/payments` - Create or update payment intent

### Webhooks
- `POST /api/webhook` - Stripe webhook endpoint (handles payment events)

## Development Highlights

### Architecture Patterns
- **Repository Pattern**: Clean separation of data access
- **DTO Pattern**: Decoupling API contracts from database models
- **Feature-based Organization**: Modular frontend structure
- **Dependency Injection**: Loose coupling and testability

### Security
- JWT token authentication
- Password hashing with ASP.NET Core Identity
- HTTPS enforcement
- CORS configuration for specific origins
- SQL injection protection via EF Core parameterization
- Stripe webhook signature verification
- Server-side payment validation

### Performance
- Lazy loading of routes
- Image optimization
- Efficient Redux state updates
- Database indexing on frequently queried fields

## Testing

Currently, the project focuses on functional demonstration. Future enhancements include:
- Backend unit tests with xUnit
- Frontend component tests with Vitest and React Testing Library
- Integration tests for API endpoints
- E2E tests with Playwright

## Deployment

### Frontend Deployment

The React frontend is production-ready with optimized builds and environment configuration.

**Quick Deploy:**
```bash
cd client
npm run build:prod
npm run preview:prod  # Test locally first
```

**Recommended Platforms:**
- **Vercel** (Easiest) - Automatic deployments from GitHub
- **Netlify** - Great DX with continuous deployment
- **Azure Static Web Apps** - Integrated with Azure backend

**Environment Variables:**
Set these in your hosting platform:
```bash
VITE_API_URL=https://your-api-url.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
```

**Detailed Guide:** See [client/DEPLOYMENT.md](client/DEPLOYMENT.md)

### Backend Deployment

**Recommended Platforms:**
- **Azure App Service** (F1 Free Tier) - Native .NET support
- **Render** - Easy deployment with free PostgreSQL
- **Fly.io** - Docker-based deployment
- **Oracle Cloud** - Most generous free tier

**Database Migration:**
Easily migrate from SQLite to:
- Azure SQL Database (free tier available)
- PostgreSQL (Render, Railway free tiers)
- MySQL

**Production Environment Variables:**
```bash
StripeSettings__SecretKey=sk_live_...
StripeSettings__WebhookSecret=whsec_...
ConnectionStrings__DefaultConnection=...
```

### CORS Configuration

Update `API/Program.cs` to include your production frontend URL:
```csharp
app.UseCors(opt =>
{
    opt.AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials()
       .WithOrigins(
           "https://localhost:3000",              // Development
           "https://your-frontend-domain.com"     // Production
       );
});
```

### Stripe Webhook Setup (Production)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-api-domain.com/api/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook signing secret
5. Add to production environment variables

## Roadmap

- [ ] Admin dashboard for product management
- [ ] Product search and filtering
- [ ] Product reviews and ratings
- [ ] Email notifications for orders
- [ ] Inventory management
- [ ] Unit and integration tests
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Docker containerization

## Learning Outcomes

This project demonstrates proficiency in:
- Building RESTful APIs with .NET
- Modern React development with TypeScript
- State management with Redux Toolkit
- Authentication and authorization implementation
- Payment gateway integration
- Responsive UI design
- Database design and migrations
- Git version control and best practices

## Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Nkosinathi Nkosi**
- GitHub: [@Nattie-Nkosi](https://github.com/Nattie-Nkosi)
- LinkedIn: [nkosinathi-nkosi](https://www.linkedin.com/in/nkosinathi-nkosi/)

---

Built with ❤️ as a portfolio project for software development interviews.
