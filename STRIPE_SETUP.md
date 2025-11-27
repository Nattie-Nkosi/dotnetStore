# Stripe Payment Integration Setup Guide

## ✅ What's Been Completed

I've set up the backend infrastructure for Stripe payment processing:

1. **Stripe Configuration** - Added to `appsettings.Development.json`
2. **Database Schema** - Updated `Basket` entity with `PaymentIntentId` and `ClientSecret`
3. **Payment Service** - Created `PaymentService.cs` for Stripe API integration
4. **Payments Controller** - Created `PaymentsController.cs` with payment intent endpoint
5. **DTOs & Extensions** - Updated `BasketDto` and mapping extensions

## 🔧 Next Steps to Complete Setup

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Navigate to **Developers > API keys**
4. Copy your **Publishable key** and **Secret key** (use test keys for development)

### 2. Update Configuration

Update `API/appsettings.Development.json` with your Stripe keys:

```json
{
  "StripeSettings": {
    "PublishableKey": "pk_test_your_actual_key_here",
    "SecretKey": "sk_test_your_actual_key_here",
    "WhSecret": ""
  }
}
```

**⚠️ IMPORTANT**: Never commit your secret keys to Git! Consider using User Secrets for production:
```bash
cd API
dotnet user-secrets init
dotnet user-secrets set "StripeSettings:SecretKey" "sk_test_your_key_here"
```

### 3. Run Database Migration

```bash
cd API
dotnet ef migrations add AddPaymentIntentToBasket
dotnet ef database update
```

This will add the `PaymentIntentId` and `ClientSecret` columns to your Baskets table.

### 4. Install Stripe on Frontend

```bash
cd client
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 5. Frontend Integration (Example)

Create a payment API service in your client:

**`client/src/app/api/paymentsApi.ts`**:
```typescript
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<any, void>({
      query: () => ({
        url: 'payments',
        method: 'POST',
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentsApi;
```

### 6. Update Checkout Page with Stripe Elements

Here's a basic structure for your checkout page with Stripe:

```typescript
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCreatePaymentIntentMutation } from '../api/paymentsApi';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key_here');

export default function CheckoutPage() {
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when checkout loads
    createPaymentIntent()
      .unwrap()
      .then((basket) => {
        if (basket.clientSecret) {
          setClientSecret(basket.clientSecret);
        }
      });
  }, []);

  return (
    <Container>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </Container>
  );
}
```

### 7. Create Stripe Payment Form Component

```typescript
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Pay Now</button>
    </form>
  );
}
```

## 🧪 Testing

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

Use any future expiry date, any 3-digit CVC, and any postal code.

## 📚 API Endpoints

### Create or Update Payment Intent
```
POST /api/payments
Authorization: Bearer {token}
```

**Response**:
```json
{
  "id": 1,
  "buyerId": "user@example.com",
  "paymentIntentId": "pi_xxx",
  "clientSecret": "pi_xxx_secret_xxx",
  "items": [...]
}
```

## 💡 Key Features

- **Automatic Amount Calculation**: Includes subtotal + delivery fee (R50 for orders under R500)
- **Currency**: South African Rand (ZAR)
- **Update Support**: If basket changes, payment intent amount is updated automatically
- **Authentication Required**: Only authenticated users can create payment intents

## 🔒 Security Best Practices

1. Never expose your Secret Key in frontend code
2. Always use HTTPS in production
3. Validate payment webhooks using the webhook secret
4. Implement proper error handling
5. Log payment events for debugging

## 📖 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe Test Cards](https://stripe.com/docs/testing)

## 🎯 What's Left to Build

Frontend work needed:
1. Install Stripe npm packages
2. Create payment API slice
3. Update CheckoutPage to use Stripe Elements
4. Create payment form component
5. Handle payment success/failure
6. Optionally: Create Order entity and save completed orders

Backend (optional enhancements):
1. Webhook handler for payment events
2. Order creation after successful payment
3. Email notifications
4. Refund handling

---

Your Stripe backend integration is complete and ready to use! 🎉
