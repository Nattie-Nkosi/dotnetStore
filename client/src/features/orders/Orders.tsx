import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useGetOrdersQuery } from "./ordersApi";
import { useNavigate } from "react-router-dom";
import {
  ReceiptLongOutlined,
  LocalShippingOutlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";

export default function Orders() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const navigate = useNavigate();

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
            Loading your orders...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load orders. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
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
          <ShoppingBagOutlined
            sx={{ fontSize: 100, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't placed any orders. Start shopping to see your orders
            here.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/catalog")}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and track your order history
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ReceiptLongOutlined color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Order #{order.id}
                    </Typography>
                  </Box>
                  <Chip
                    label={formatStatus(order.orderStatus)}
                    color={getStatusColor(order.orderStatus)}
                    size="small"
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {new Date(order.orderDate).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Items
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {order.orderItems.length}{" "}
                      {order.orderItems.length === 1 ? "item" : "items"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="primary">
                      R{(order.total / 100).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Shipping To
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Order Items
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                      {order.orderItems.slice(0, 3).map((item) => (
                        <Paper
                          key={item.productId}
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: "action.hover",
                          }}
                        >
                          <Box
                            component="img"
                            src={item.pictureUrl}
                            alt={item.name}
                            sx={{
                              width: 40,
                              height: 40,
                              objectFit: "contain",
                              borderRadius: 1,
                            }}
                          />
                          <Box>
                            <Typography variant="caption" fontWeight={500}>
                              {item.name.length > 20
                                ? item.name.substring(0, 20) + "..."
                                : item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {" "}
                              x{item.quantity}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                      {order.orderItems.length > 3 && (
                        <Paper
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "action.hover",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            +{order.orderItems.length - 3} more
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LocalShippingOutlined />}
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
