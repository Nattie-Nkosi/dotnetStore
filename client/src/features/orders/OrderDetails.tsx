import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderQuery } from "./ordersApi";
import {
  ArrowBack,
  LocalShippingOutlined,
  CreditCardOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrderQuery(Number(id));

  const getStatusColor = (
    status: string
  ): "default" | "primary" | "success" | "warning" | "error" => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "paymentreceived":
        return "primary";
      case "paymentfailed":
        return "error";
      default:
        return "default";
    }
  };

  const formatStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case "paymentreceived":
        return "Payment Received";
      case "paymentfailed":
        return "Payment Failed";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading order details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load order details. The order may not exist or you don't
          have permission to view it.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate("/orders")}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Order #{order.id}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Placed on{" "}
            {new Date(order.orderDate).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
        <Chip
          label={formatStatus(order.orderStatus)}
          color={getStatusColor(order.orderStatus)}
          size="medium"
          sx={{ fontSize: "0.875rem", px: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <ReceiptLongOutlined color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Order Items
              </Typography>
            </Box>

            {order.orderItems.map((item, index) => (
              <Box key={item.productId}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    py: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={item.pictureUrl}
                    alt={item.name}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: "contain",
                      borderRadius: 1,
                      bgcolor: "action.hover",
                      p: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unit Price: R{(item.price / 100).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    R{((item.price * item.quantity) / 100).toFixed(2)}
                  </Typography>
                </Box>
                {index < order.orderItems.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <LocalShippingOutlined color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Shipping Address
              </Typography>
            </Box>

            <Card sx={{ bgcolor: "action.hover" }}>
              <CardContent>
                <Typography variant="body1" fontWeight={500} gutterBottom>
                  {order.shippingAddress.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.line1}
                </Typography>
                {order.shippingAddress.line2 && (
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingAddress.line2}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postal_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.country}
                </Typography>
              </CardContent>
            </Card>
          </Paper>

          {order.paymentSummary && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <CreditCardOutlined color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Payment Information
                </Typography>
              </Box>

              <Card sx={{ bgcolor: "action.hover" }}>
                <CardContent>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    {order.paymentSummary.brand.toUpperCase()} ending in{" "}
                    {order.paymentSummary.last4}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expires {order.paymentSummary.expMonth}/
                    {order.paymentSummary.expYear}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: { xs: "static", md: "sticky" }, top: 100 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1" fontWeight={500}>
                R{(order.subtotal / 100).toFixed(2)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body1">Delivery Fee</Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                color={order.deliveryFee === 0 ? "success.main" : "text.primary"}
              >
                {order.deliveryFee === 0
                  ? "FREE"
                  : `R${(order.deliveryFee / 100).toFixed(2)}`}
              </Typography>
            </Box>

            {order.deliveryFee === 0 && (
              <Chip
                label="Free Delivery Applied!"
                color="success"
                size="small"
                sx={{ mb: 1.5 }}
              />
            )}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={600} color="primary">
                R{(order.total / 100).toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/catalog")}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
