import { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }

    setIsProcessing(false);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <LockOutlined color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Payment Details
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <PaymentElement options={paymentElementOptions} />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!stripe || !elements || isProcessing}
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
          startIcon={
            isProcessing ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isProcessing ? "Processing..." : "Complete Order"}
        </Button>

        <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <LockOutlined sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
            Your payment information is secure and encrypted
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
