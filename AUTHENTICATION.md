# Authentication System Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Backend Implementation](#backend-implementation)
- [Frontend Implementation](#frontend-implementation)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [User Flows](#user-flows)
- [Security Considerations](#security-considerations)

---

## Overview

This application implements a full-stack authentication system using **ASP.NET Core Identity** on the backend and **React with RTK Query** on the frontend. The system supports user registration, login, logout, and session management with cookie-based authentication.

### Technology Stack
- **Backend**: ASP.NET Core 9 with Identity Framework
- **Frontend**: React 19 + TypeScript
- **State Management**: Redux Toolkit (RTK Query)
- **Validation**: Zod + React Hook Form
- **UI Framework**: Material-UI v6

---

## Architecture

### Authentication Flow
```
┌─────────────┐           ┌──────────────┐           ┌──────────────┐
│   Browser   │──────────▶│  API Server  │──────────▶│   Database   │
│  (React)    │◀──────────│  (.NET 9)    │◀──────────│   (SQLite)   │
└─────────────┘           └──────────────┘           └──────────────┘
     │                           │
     │  Cookie-based auth        │  ASP.NET Identity
     │  RTK Query caching        │  User/Role management
     └───────────────────────────┘
```

### Key Components

#### Backend
- **ASP.NET Core Identity**: Handles user management, password hashing, and authentication
- **Cookie Authentication**: Session-based authentication with secure cookies
- **Entity Framework Core**: Data persistence layer
- **Role-based Authorization**: Member and Admin roles

#### Frontend
- **RTK Query**: API state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Schema-based validation
- **React Router**: Route protection and navigation

---

## Backend Implementation

### User Entity
**Location**: `API/Entities/User.cs`

```csharp
public class User : IdentityUser
{
    public int? AddressId { get; set; }
    public Address? Address { get; set; }
}
```

Extends `IdentityUser` with:
- `AddressId`: Foreign key to user's address
- `Address`: Navigation property for user's shipping address

### AccountController
**Location**: `API/Controllers/AccountController.cs`

#### Key Methods

**1. Register**
- Endpoint: `POST /api/account/register`
- Creates new user account
- Automatically assigns "Member" role
- Returns 201 Created on success

**2. Login**
- Endpoint: `POST /api/account/login`
- Authenticates user credentials
- Transfers anonymous basket to user account
- Returns user info with roles

**3. Logout**
- Endpoint: `POST /api/account/logout`
- Signs out user
- Clears authentication cookie
- Returns 204 No Content

**4. GetUserInfo**
- Endpoint: `GET /api/account/user-info`
- Returns current user's information
- Returns 204 No Content if not authenticated

**5. GetSavedAddress**
- Endpoint: `GET /api/account/address`
- Returns user's saved address
- Requires authentication

**6. CreateOrUpdateAddress**
- Endpoint: `POST /api/account/address`
- Creates or updates user's address
- Requires authentication

### Basket Integration

**TransferAnonymousBasket Method**
```csharp
private async Task TransferAnonymousBasket(string userName)
{
    // Retrieves anonymous basket from cookie
    // Merges with existing user basket or transfers ownership
    // Deletes anonymous cookie
    // Saves changes to database
}
```

**Basket BuyerId Resolution**
```csharp
private string GetBuyerId()
{
    return User.Identity?.Name ?? Request.Cookies["buyerId"] ?? "";
}
```
- Authenticated users: Uses username as buyerId
- Anonymous users: Uses cookie-based GUID

### DTOs (Data Transfer Objects)

**Location**: `API/DTOs/`

**LoginDto.cs**
```csharp
public class LoginDto
{
    [Required]
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }
}
```

**RegisterDto.cs**
```csharp
public class RegisterDto
{
    [Required]
    public required string Email { get; set; } = string.Empty;

    public required string Password { get; set; }
}
```

**AddressDto.cs**
```csharp
public class AddressDto
{
    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Line1 { get; set; }

    public string? Line2 { get; set; }

    [Required]
    public required string City { get; set; }

    [Required]
    public required string State { get; set; }

    [Required]
    [JsonPropertyName("postal_code")]
    public required string PostalCode { get; set; }

    [Required]
    public required string Country { get; set; }
}
```

---

## Frontend Implementation

### RTK Query API
**Location**: `client/src/features/account/accountApi.ts`

#### Endpoints

**1. getUserInfo**
- Query for fetching current user
- Auto-refetches on mount
- Cached with "User" tag

**2. register**
- Mutation for user registration
- Invalidates "User" tag on success

**3. login**
- Mutation for user login
- Invalidates "User" and "Basket" tags on success
- Triggers basket refetch

**4. logout**
- Mutation for user logout
- Invalidates "User", "Address", and "Basket" tags
- Clears all user-related cache

**5. getSavedAddress**
- Query for user's saved address
- Requires authentication

**6. createOrUpdateAddress**
- Mutation for saving address
- Invalidates "Address" tag

### Validation Schemas

**Location**: `client/src/lib/schemas/`

**loginSchema.ts**
```typescript
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});
```

**registerSchema.ts**
```typescript
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

### Route Protection

**PrivateRoute Component**
**Location**: `client/src/app/routes/PrivateRoute.tsx`

```typescript
export default function PrivateRoute({ children }: Props) {
  const { data: user, isLoading } = useGetUserInfoQuery();
  const location = useLocation();

  if (isLoading) {
    return <CircularProgress />; // Loading state
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

**Features:**
- Checks authentication status
- Shows loading spinner while checking
- Redirects to login if not authenticated
- Preserves intended destination in location state

**PublicRoute Component**
**Location**: `client/src/app/routes/PublicRoute.tsx`

```typescript
export default function PublicRoute({ children }: Props) {
  const { data: user, isLoading } = useGetUserInfoQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (user) {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
}
```

**Features:**
- Prevents authenticated users from accessing login/register
- Automatically redirects to catalog if already logged in

### UI Components

**LoginPage**
**Location**: `client/src/features/account/LoginPage.tsx`

**Features:**
- Email and password fields
- Password visibility toggle
- Form validation with error messages
- Displays info alert when redirected from protected route
- Redirects to intended destination after login
- Link to registration page

**RegisterPage**
**Location**: `client/src/features/account/RegisterPage.tsx`

**Features:**
- Email, password, and confirm password fields
- Password visibility toggles for both fields
- Real-time password strength indicator with visual checkmarks:
  - ✅ At least 8 characters
  - ✅ One uppercase letter
  - ✅ One lowercase letter
  - ✅ One number
- Password confirmation matching
- Redirects to login after successful registration
- Link to login page

### Navbar User Menu
**Location**: `client/src/app/layout/NavBar.tsx`

**Authenticated User Display:**
- Avatar with user's initial
- Username extracted from email
- Dropdown menu with:
  - Profile option
  - My Address option
  - Logout button

**Anonymous User Display:**
- Login button
- Register button

**Mobile View:**
- User profile card in drawer
- User menu items (Profile, Address, Logout)

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/account/register` | No | Register new user |
| POST | `/api/account/login` | No | Login user |
| POST | `/api/account/logout` | No | Logout user |
| GET | `/api/account/user-info` | No | Get current user info |
| GET | `/api/account/address` | Yes | Get saved address |
| POST | `/api/account/address` | Yes | Create/update address |

### Request/Response Examples

#### Register
**Request:**
```json
POST /api/account/register
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```
201 Created
```

#### Login
**Request:**
```json
POST /api/account/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
200 OK
{
  "email": "user@example.com",
  "userName": "user@example.com",
  "roles": ["Member"]
}
```

#### Get User Info
**Request:**
```
GET /api/account/user-info
```

**Response (Authenticated):**
```json
200 OK
{
  "email": "user@example.com",
  "userName": "user@example.com",
  "roles": ["Member"]
}
```

**Response (Not Authenticated):**
```
204 No Content
```

#### Create/Update Address
**Request:**
```json
POST /api/account/address
{
  "name": "John Doe",
  "line1": "123 Main Street",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA"
}
```

**Response:**
```json
200 OK
{
  "id": 1,
  "name": "John Doe",
  "line1": "123 Main Street",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA"
}
```

---

## Features

### ✅ User Registration
- Email-based registration
- Strong password requirements
- Automatic role assignment
- Validation with user feedback

### ✅ User Login
- Email and password authentication
- Remember user session
- Anonymous basket transfer
- Redirect to intended destination

### ✅ User Logout
- Secure sign out
- Session cleanup
- Cache invalidation

### ✅ Route Protection
- Private routes (checkout)
- Public-only routes (login/register)
- Loading states
- Redirect preservation

### ✅ User Menu
- Avatar with initial
- Username display
- Dropdown menu
- Mobile-responsive

### ✅ Form Validation
- Real-time validation
- Password strength indicator
- Error messages
- Touch-based validation

### ✅ Address Management
- Save shipping address
- Retrieve saved address
- Update address

### ✅ Basket Integration
- Anonymous basket support
- Basket transfer on login
- User-specific baskets
- Cookie cleanup

---

## User Flows

### Registration Flow
```
1. User navigates to /register
2. Fills in email and password
3. Real-time password validation
4. Submits form
5. Backend creates user account
6. Assigns "Member" role
7. Redirects to /login
```

### Login Flow
```
1. User navigates to /login
2. Enters credentials
3. Submits form
4. Backend validates credentials
5. Backend transfers anonymous basket
6. Sets authentication cookie
7. Frontend invalidates basket cache
8. Redirects to intended page or /catalog
9. Navbar updates with user info
```

### Protected Route Access
```
1. Anonymous user clicks checkout
2. PrivateRoute checks authentication
3. User not authenticated
4. Redirects to /login with location state
5. Shows "Please sign in to continue" message
6. User logs in
7. Redirects back to /checkout
```

### Logout Flow
```
1. User clicks logout in menu
2. Frontend calls logout mutation
3. Backend signs out user
4. Frontend invalidates all user caches
5. Redirects to home page
6. Navbar updates to show login/register
```

### Basket Transfer on Login
```
1. Anonymous user adds items to basket
   - Items stored with cookie-based buyerId
2. User logs in
3. Backend retrieves anonymous basket
4. Backend retrieves user's existing basket
5. If user has basket:
   - Merge anonymous items into user basket
   - Delete anonymous basket
6. If user has no basket:
   - Transfer ownership to user
7. Delete anonymous cookie
8. Frontend refetches basket
9. User sees their items
```

---

## Security Considerations

### Password Security
- **Minimum Length**: 8 characters
- **Complexity Requirements**:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Hashing**: ASP.NET Identity uses PBKDF2 with HMAC-SHA256
- **Salt**: Unique salt per password

### Cookie Security
- **HttpOnly**: Prevents JavaScript access
- **Secure**: HTTPS only (in production)
- **SameSite**: CSRF protection
- **Expiration**: 30-day expiration for anonymous baskets

### Authentication
- **Cookie-based**: Stateful authentication
- **Credentials**: `include` mode for CORS
- **Base URL**: HTTPS only

### Authorization
- **Role-based**: Member and Admin roles
- **[Authorize] Attribute**: Protects endpoints
- **Route Guards**: Client-side protection

### Validation
- **Server-side**: Data Annotations + ModelState
- **Client-side**: Zod schemas
- **Double validation**: Security through redundancy

### CORS Configuration
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder
            .WithOrigins("https://localhost:3000")
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod());
});
```

---

## Configuration

### Backend Configuration
**Location**: `API/Program.cs`

```csharp
// Add Identity
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<StoreContext>();

// Configure authentication
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
```

### Frontend Configuration
**Location**: `client/src/app/api/baseApi.ts`

```typescript
const customBaseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5001/api/",
  credentials: "include", // Important for cookies
});
```

---

## Troubleshooting

### Common Issues

**Issue: Cookie not being sent**
- Solution: Ensure `credentials: "include"` in fetch config
- Check CORS configuration allows credentials

**Issue: Basket not updating after login**
- Solution: Verify basket cache invalidation
- Check `TransferAnonymousBasket` method

**Issue: User stays logged in after logout**
- Solution: Clear all RTK Query caches
- Verify cookie is deleted

**Issue: Protected routes accessible without login**
- Solution: Check PrivateRoute implementation
- Verify authentication check in component

---

## Future Enhancements

### Potential Improvements
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Session timeout warnings
- [ ] Account deletion
- [ ] Profile editing
- [ ] Avatar upload
- [ ] Login history
- [ ] Security audit logs

### Performance Optimizations
- [ ] Implement refresh tokens
- [ ] Add request debouncing
- [ ] Optimize cache strategies
- [ ] Add optimistic updates

---

## Testing Recommendations

### Backend Testing
```csharp
// Example unit test
[Fact]
public async Task Login_ValidCredentials_ReturnsUserInfo()
{
    // Arrange
    var loginDto = new LoginDto
    {
        Email = "test@example.com",
        Password = "Test123"
    };

    // Act
    var result = await controller.Login(loginDto);

    // Assert
    Assert.IsType<OkObjectResult>(result);
}
```

### Frontend Testing
```typescript
// Example integration test
describe('LoginPage', () => {
  it('should redirect to catalog after successful login', async () => {
    // Arrange
    render(<LoginPage />);

    // Act
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Test123');
    await userEvent.click(screen.getByText('Sign In'));

    // Assert
    expect(window.location.pathname).toBe('/catalog');
  });
});
```

---

## Conclusion

This authentication system provides a solid foundation for user management with:
- Secure password handling
- Session management
- Route protection
- User-friendly interfaces
- Basket integration
- Comprehensive validation

The modular architecture allows for easy extension and maintenance.

---

**Last Updated**: 2025-11-26
**Version**: 1.0.0
**Authors**: DotnetStore Team
