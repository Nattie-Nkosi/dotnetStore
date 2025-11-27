import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import { useClearBasketMutation } from "../basket/basketApi";
import { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [clearBasket] = useClearBasketMutation();

  useEffect(() => {
    clearBasket();
  }, [clearBasket]);

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
          }}
        >
          <Button
            variant="contained"
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
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              px: 4,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
