import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { useGetOrderQuery } from "../orders/ordersApi";
import { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId as number | undefined;

  const { data: order, isLoading } = useGetOrderQuery(orderId!, {
    skip: !orderId,
  });

  useEffect(() => {
    if (!orderId) {
      navigate("/orders");
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            p: { xs: 3, sm: 4 },
            textAlign: "center",
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading order details...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          p: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: { xs: 80, sm: 100, md: 120 },
            color: "success.main",
            mb: 2,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: 700,
            mb: 1,
            color: "success.main",
          }}
        >
          Order Successful!
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, mb: 2 }}
        >
          Thank you for your purchase
        </Typography>

        {order && (
          <Card
            sx={{
              mt: 3,
              mb: 3,
              maxWidth: 600,
              width: "100%",
              bgcolor: "action.hover",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order #{order.id}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Order Date:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {new Date(order.orderDate).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Items:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {order.orderItems.length}{" "}
                  {order.orderItems.length === 1 ? "item" : "items"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total:
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary">
                  R{(order.total / 100).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: 600,
            px: { xs: 2, sm: 0 },
            fontSize: { xs: "0.9375rem", sm: "1rem" },
          }}
        >
          Your order has been successfully processed! You will receive an email
          confirmation shortly with your order details and tracking information.
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(`/orders/${orderId}`)}
            startIcon={<ReceiptLongOutlined />}
            sx={{
              px: 4,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            View Order Details
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/catalog")}
            startIcon={<ShoppingBagOutlined />}
            sx={{
              px: 4,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
