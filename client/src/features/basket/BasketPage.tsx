import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip,
  Alert,
} from "@mui/material";
import { useFetchBasketQuery, useRemoveBasketItemMutation } from "./basketApi";
import { Add, Delete, Remove, ShoppingCartOutlined, ArrowBack } from "@mui/icons-material";
import { useAddBasketItemMutation } from "./basketApi";
import { toast } from "react-toastify";
import { isFetchBaseQueryError, isErrorWithMessage } from "../../app/utils/typeGuards";
import { Link } from "react-router-dom";

export default function BasketPage() {
  const { data: basket, isLoading } = useFetchBasketQuery();
  const [removeItem] = useRemoveBasketItemMutation();
  const [addItem] = useAddBasketItemMutation();

  if (isLoading) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Loading your basket...
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
          <ShoppingCartOutlined sx={{ fontSize: 100, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your basket is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added anything to your cart yet.
          </Typography>
          <Button
            component={Link}
            to="/catalog"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  const subtotal = basket.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 50000 ? 0 : 5000; // Free delivery over R500
  const vat = (subtotal + deliveryFee) * 0.15; // 15% VAT
  const total = subtotal + deliveryFee + vat;
  const itemCount = basket.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemoveItem = async (productId: number, quantity: number) => {
    try {
      await removeItem({ productId, quantity }).unwrap();
      toast.success(
        quantity === 1 ? "Item quantity decreased" : "Item removed from cart",
        { autoClose: 2000 }
      );
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errorMessage = "data" in error ? String(error.data) : error.status;
        console.error("Failed to remove item from cart:", errorMessage);
      } else if (isErrorWithMessage(error)) {
        console.error("Failed to remove item from cart:", error.message);
      } else {
        console.error("Failed to remove item from cart:", error);
      }
    }
  };

  const handleAddItem = async (productId: number) => {
    try {
      await addItem({ productId, quantity: 1 }).unwrap();
      toast.success("Item quantity increased", { autoClose: 2000 });
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errorMessage = "data" in error ? String(error.data) : error.status;
        console.error("Failed to add item to cart:", errorMessage);
      } else if (isErrorWithMessage(error)) {
        console.error("Failed to add item to cart:", error.message);
      } else {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Shopping Cart
          <Chip
            label={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            color="primary"
            size="small"
            sx={{ ml: 2 }}
          />
        </Typography>
        <Button
          component={Link}
          to="/catalog"
          startIcon={<ArrowBack />}
          variant="outlined"
          fullWidth={{ xs: true, sm: false }}
        >
          Continue Shopping
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {subtotal >= 50000 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              You qualify for free delivery!
            </Alert>
          )}

          {basket.items.map((item) => (
            <Card key={item.productId} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* Product Image & Info */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        component="img"
                        src={item.pictureUrl}
                        alt={item.name}
                        sx={{
                          width: { xs: 60, sm: 80 },
                          height: { xs: 60, sm: 80 },
                          objectFit: "contain",
                          borderRadius: 1,
                          bgcolor: "background.default",
                          p: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight={500}
                          sx={{
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: { xs: "normal", sm: "nowrap" },
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.brand} • {item.type}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{
                            mt: 1,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                            display: { xs: "block", sm: "none" },
                          }}
                        >
                          R{(item.price / 100).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Quantity Controls */}
                  <Grid item xs={7} sm={3}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: { xs: "block", sm: "none" }, mb: 0.5 }}
                      >
                        Quantity
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          onClick={() => handleRemoveItem(item.productId, 1)}
                          size="small"
                          color="error"
                          sx={{
                            border: 1,
                            borderColor: "error.main",
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography
                          variant="h6"
                          sx={{
                            minWidth: 30,
                            textAlign: "center",
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleAddItem(item.productId)}
                          size="small"
                          color="primary"
                          sx={{
                            border: 1,
                            borderColor: "primary.main",
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Item Total & Delete */}
                  <Grid item xs={5} sm={3}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-end", sm: "center" }}
                      justifyContent={{ xs: "flex-start", sm: "space-between" }}
                      gap={{ xs: 1, sm: 0 }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: { xs: "block", sm: "none" } }}
                        >
                          Total
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        >
                          R{((item.price * item.quantity) / 100).toFixed(2)}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveItem(item.productId, item.quantity)}
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Order Summary */}
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
              <Typography variant="body1">Subtotal ({itemCount} items)</Typography>
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
                {deliveryFee === 0 ? "FREE" : `R${(deliveryFee / 100).toFixed(2)}`}
              </Typography>
            </Box>

            {deliveryFee > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                Spend R{((50000 - subtotal) / 100).toFixed(2)} more for free delivery
              </Typography>
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

            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Proceed to Checkout
            </Button>

            <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Secure checkout powered by SSL encryption
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
