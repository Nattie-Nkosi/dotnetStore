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
import { StripePaymentElementOptions, StripeError } from "@stripe/stripe-js";
import { ShippingAddress, useCreateOrderMutation } from "../orders/ordersApi";
import { useNavigate } from "react-router-dom";

interface StripePaymentFormProps {
  shippingAddress: ShippingAddress;
  saveAddress: boolean;
}

export default function StripePaymentForm({
  shippingAddress,
  saveAddress,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [elementError, setElementError] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage(
        "Payment system not initialized. Please refresh the page."
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        setIsProcessing(false);
        return;
      }

      const orderId = await createOrder({
        saveAddress,
        shippingAddress,
      }).unwrap();

      navigate("/order-success", { state: { orderId } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrorMessage("Failed to create order. Please contact support.");
      setIsProcessing(false);
    }
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

      {elementError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Payment session expired. Please go back and try again, or refresh the
          page.
        </Alert>
      )}

      {!elementError && (
        <form onSubmit={handleSubmit}>
          <PaymentElement
            options={paymentElementOptions}
            onReady={() => setIsReady(true)}
            onLoadError={(event: { elementType: "payment"; error: StripeError }) => {
              console.error("Payment element error:", event);
              setElementError(true);
              setErrorMessage(
                event.error.message || "This payment session has expired. Please refresh the page to start a new payment."
              );
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!stripe || !elements || !isReady || isProcessing}
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
            startIcon={
              isProcessing ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isProcessing
              ? "Processing..."
              : !isReady
              ? "Loading..."
              : "Complete Order"}
          </Button>

          <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <LockOutlined
                sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
              />
              Your payment information is secure and encrypted
            </Typography>
          </Box>
        </form>
      )}

      {elementError && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      )}
    </Paper>
  );
}
