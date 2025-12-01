import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Divider,
  Card,
  CardContent,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useFetchBasketQuery } from "../basket/basketApi";
import { useCreatePaymentIntentMutation } from "../payment/paymentApi";
import { Link } from "react-router-dom";
import {
  ShoppingCartOutlined,
  LocalShippingOutlined,
  CheckCircleOutline,
  ArrowBack,
  LockOutlined,
} from "@mui/icons-material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../payment/StripePaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const steps = ["Shipping Address", "Payment", "Review Order"];

export default function CheckoutPage() {
  const { data: basket, isLoading } = useFetchBasketQuery();
  const [createPaymentIntent, { isLoading: isCreatingIntent }] =
    useCreatePaymentIntentMutation();
  //const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [clientSecret, setClientSecret] = useState<string>();

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    phoneNumber: "",
  });
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    if (activeStep === 1 && basket) {
      if (!basket.clientSecret) {
        createPaymentIntent()
          .unwrap()
          .then((response) => {
            if (response.clientSecret) {
              setClientSecret(response.clientSecret);
            }
          })
          .catch((error) => {
            console.error("Failed to create payment intent:", error);
            setClientSecret(undefined);
          });
      } else {
        setClientSecret(basket.clientSecret);
      }
    } else if (activeStep !== 1) {
      setClientSecret(undefined);
    }
  }, [basket, activeStep, createPaymentIntent]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (isLoading) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Loading checkout...
        </Typography>
      </Container>
    );
  }

  if (!basket || basket.items.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            textAlign: "center",
          }}
        >
          <ShoppingCartOutlined
            sx={{ fontSize: 100, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Your basket is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add items to your cart before checking out.
          </Typography>
          <Button
            component={Link}
            to="/catalog"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  const subtotal = basket.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 50000 ? 0 : 5000;
  const vat = (subtotal + deliveryFee) * 0.15;
  const total = subtotal + deliveryFee + vat;
  const itemCount = basket.items.reduce((sum, item) => sum + item.quantity, 0);

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return (
          shippingAddress.fullName &&
          shippingAddress.addressLine1 &&
          shippingAddress.city &&
          shippingAddress.province &&
          shippingAddress.postalCode &&
          shippingAddress.phoneNumber
        );
      case 1:
        return !!clientSecret;
      default:
        return true;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Button
          component={Link}
          to="/basket"
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Back to Cart
        </Button>
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
        >
          Checkout
        </Typography>
      </Box>

      <Stepper
        activeStep={activeStep}
        sx={{
          mb: 4,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          "& .MuiStepLabel-label": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Checkout Form */}
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <LocalShippingOutlined color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Shipping Address
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        fullName: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        addressLine1: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        addressLine2: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    required
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Province"
                    required
                    value={shippingAddress.province}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        province: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    required
                    value={shippingAddress.phoneNumber}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                      />
                    }
                    label="Save this address for future orders"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid(0)}
                  size="large"
                >
                  Continue to Payment
                </Button>
              </Box>
            </Paper>
          )}

          {activeStep === 1 && (
            <Box>
              {isCreatingIntent && (
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Setting up secure payment...
                  </Typography>
                </Paper>
              )}

              {!isCreatingIntent && clientSecret && (
                <Elements
                  key={clientSecret}
                  stripe={stripePromise}
                  options={{
                    clientSecret: clientSecret,
                    appearance: {
                      theme: "stripe",
                    },
                  }}
                >
                  <StripePaymentForm
                    shippingAddress={{
                      name: shippingAddress.fullName,
                      line1: shippingAddress.addressLine1,
                      line2: shippingAddress.addressLine2,
                      city: shippingAddress.city,
                      state: shippingAddress.province,
                      postal_code: shippingAddress.postalCode,
                      country: "ZA",
                    }}
                    saveAddress={saveAddress}
                  />
                </Elements>
              )}

              {!isCreatingIntent && !clientSecret && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to initialize payment. Please try again.
                </Alert>
              )}

              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}
              >
                <Button onClick={handleBack} size="large" variant="outlined">
                  Back to Shipping
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <CheckCircleOutline color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Review Your Order
                </Typography>
              </Box>

              {/* Shipping Address Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Shipping Address
                </Typography>
                <Card sx={{ bgcolor: "action.hover" }}>
                  <CardContent>
                    <Typography variant="body1" fontWeight={500}>
                      {shippingAddress.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {shippingAddress.addressLine1}
                    </Typography>
                    {shippingAddress.addressLine2 && (
                      <Typography variant="body2" color="text.secondary">
                        {shippingAddress.addressLine2}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {shippingAddress.city}, {shippingAddress.province}{" "}
                      {shippingAddress.postalCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: {shippingAddress.phoneNumber}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Payment Method Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Payment Method
                </Typography>
                <Card sx={{ bgcolor: "action.hover" }}>
                  <CardContent>
                    <Typography variant="body1">
                      Secure payment via Stripe
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Order Items ({itemCount})
                </Typography>
                {basket.items.map((item) => (
                  <Card
                    key={item.productId}
                    sx={{ mb: 2, bgcolor: "action.hover" }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          component="img"
                          src={item.pictureUrl}
                          alt={item.name}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "contain",
                            borderRadius: 1,
                            bgcolor: "background.paper",
                            p: 1,
                          }}
                        />
                        <Box flex={1}>
                          <Typography variant="body1" fontWeight={500}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          R{((item.price * item.quantity) / 100).toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Alert severity="info" icon={<LockOutlined />} sx={{ mb: 3 }}>
                Ready to complete your order? Click "Back to Payment" to proceed
                with secure checkout.
              </Alert>

              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  onClick={handleBack}
                  size="large"
                  variant="contained"
                  sx={{ px: 4 }}
                >
                  Back to Payment
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: { xs: "static", md: "sticky" },
              top: 100,
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body1">
                Subtotal ({itemCount} items)
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                R{(subtotal / 100).toFixed(2)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body1">Delivery Fee</Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                color={deliveryFee === 0 ? "success.main" : "text.primary"}
              >
                {deliveryFee === 0
                  ? "FREE"
                  : `R${(deliveryFee / 100).toFixed(2)}`}
              </Typography>
            </Box>

            {deliveryFee === 0 && (
              <Chip
                label="Free Delivery Applied!"
                color="success"
                size="small"
                sx={{ mb: 1.5 }}
              />
            )}

            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body1">VAT (15%)</Typography>
              <Typography variant="body1" fontWeight={500}>
                R{(vat / 100).toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={600} color="primary">
                R{(total / 100).toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <LockOutlined
                  sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                />
                Secure checkout with SSL encryption
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
