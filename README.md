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

### Environment Variables

Create a `.env` file in the API directory with the following:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret_key
```

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
- `POST /api/payment` - Create payment intent
- `GET /api/payment/{basketId}` - Get payment status

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

## Deployment Considerations

This application is ready for deployment to:
- **Backend**: Azure App Service, AWS Elastic Beanstalk, or Docker containers
- **Frontend**: Vercel, Netlify, or Azure Static Web Apps
- **Database**: Easily migrate from SQLite to SQL Server, PostgreSQL, or MySQL

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
