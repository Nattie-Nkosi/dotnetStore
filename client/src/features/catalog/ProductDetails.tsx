import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  TextField,
  Typography,
  useTheme,
  alpha,
  Alert,
  Rating,
  Chip,
  Stack,
  Breadcrumbs,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchProductDetailsQuery } from "./catalogApi";
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from "../basket/basketApi";
import { toast } from "react-toastify";
import { isFetchBaseQueryError, isErrorWithMessage } from "../../app/utils/typeGuards";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useFetchProductDetailsQuery(Number(id));
  const { data: basket } = useFetchBasketQuery();
  const [addItem, { isLoading: isAddingToCart }] = useAddBasketItemMutation();
  const [removeItem] = useRemoveBasketItemMutation();
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Check if product is in basket and get its quantity
  const itemInBasket = basket?.items.find(item => item.productId === Number(id));
  const isInCart = !!itemInBasket;

  // Set quantity from basket when product is loaded or basket changes
  useEffect(() => {
    if (itemInBasket) {
      setQuantity(itemInBasket.quantity);
    }
  }, [itemInBasket]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      try {
        if (isInCart && itemInBasket) {
          // Product is in cart - update quantity
          const quantityDifference = quantity - itemInBasket.quantity;

          if (quantityDifference === 0) {
            toast.info("Quantity unchanged", { autoClose: 2000 });
            return;
          }

          if (quantityDifference > 0) {
            // Need to add more
            await addItem({ productId: product.id, quantity: quantityDifference }).unwrap();
            toast.success(`Cart updated! Quantity increased to ${quantity}`, {
              autoClose: 3000,
            });
          } else {
            // Need to remove some
            await removeItem({ productId: product.id, quantity: Math.abs(quantityDifference) }).unwrap();
            toast.success(`Cart updated! Quantity decreased to ${quantity}`, {
              autoClose: 3000,
            });
          }
        } else {
          // Product not in cart - add new
          await addItem({ productId: product.id, quantity }).unwrap();
          toast.success(`${quantity} x ${product.name} added to cart!`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          const errorMessage = "data" in error ? String(error.data) : error.status;
          console.error("Failed to update cart:", errorMessage);
        } else if (isErrorWithMessage(error)) {
          console.error("Failed to update cart:", error.message);
        } else {
          console.error("Failed to update cart:", error);
        }
      }
    }
  };

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          Product not found
        </Alert>
        <Button
          component={Link}
          to="/catalog"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Catalog
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.text.secondary,
            textDecoration: "none",
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        <Link
          to="/catalog"
          style={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.text.secondary,
            textDecoration: "none",
          }}
        >
          <InventoryIcon sx={{ mr: 0.5 }} fontSize="small" />
          Catalog
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: isDarkMode
                ? alpha(theme.palette.background.paper, 0.6)
                : "#f5f5f5",
              p: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 500,
              position: "relative",
            }}
          >
            {/* Stock Badge */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 1,
              }}
            >
              {product.quantityInStock > 0 ? (
                <Chip
                  label="In Stock"
                  size="medium"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
              ) : (
                <Chip
                  label="Out of Stock"
                  size="medium"
                  color="error"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>

            <Box
              component="img"
              src={product.pictureUrl}
              alt={product.name}
              sx={{
                maxWidth: "100%",
                maxHeight: "450px",
                objectFit: "contain",
              }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={product.brand}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip label={product.type} size="small" variant="outlined" />
            </Stack>

            <Typography variant="h3" fontWeight={700} gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                4.5 (24 reviews)
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary" fontWeight={700}>
                R{(product.price / 100).toFixed(2)}
              </Typography>
              {product.price >= 50000 && (
                <Chip
                  icon={<LocalShippingIcon />}
                  label="Free Delivery"
                  color="success"
                  size="small"
                  sx={{ mt: 1, fontWeight: 600 }}
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description ||
                "Premium quality product designed to meet your needs. Crafted with attention to detail and built to last."}
            </Typography>

            <Card sx={{ mb: 3, bgcolor: "action.hover" }}>
              <CardContent>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary={`${product.quantityInStock} units available`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalShippingIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Free shipping on orders over R500" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserOutlined color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="1 year manufacturer warranty" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalOfferOutlined color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Best price guarantee" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Quantity
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  InputProps={{
                    inputProps: { min: 1, max: product.quantityInStock },
                  }}
                  size="medium"
                  sx={{ width: 120 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {product.quantityInStock} available
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                disabled={product.quantityInStock === 0 || isAddingToCart}
                startIcon={
                  isAddingToCart ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ShoppingCartIcon />
                  )
                }
                onClick={handleAddToCart}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {isAddingToCart
                  ? (isInCart ? "Updating..." : "Adding...")
                  : (isInCart ? "Update Quantity" : "Add to Cart")
                }
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<FavoriteBorderIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Wishlist
              </Button>
            </Stack>

            <Button
              component={Link}
              to="/catalog"
              startIcon={<ArrowBackIcon />}
              fullWidth
              variant="text"
              sx={{ textTransform: "none" }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Product Information */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={1}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Product Description
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description ||
                "No detailed description available for this product."}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This premium product is designed with quality and durability in mind.
              Perfect for everyday use and built to withstand the test of time.
              Each item is carefully crafted to ensure you receive the best value for your investment.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={1}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Product Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                SKU:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {product.id.toString().padStart(6, "0")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Brand:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {product.brand}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Category:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {product.type}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Availability:
              </Typography>
              <Chip
                label={product.quantityInStock > 0 ? "In Stock" : "Out of Stock"}
                size="small"
                color={product.quantityInStock > 0 ? "success" : "error"}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

// Skeleton loading state for product details
function ProductDetailsSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={300} height={30} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 3 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
          <Skeleton variant="text" height={120} sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width={100} height={56} />
            <Skeleton variant="rectangular" width={180} height={56} />
            <Skeleton variant="rectangular" width={130} height={56} />
          </Box>
          <Skeleton variant="text" width="80%" height={30} sx={{ mb: 3 }} />
          <Skeleton variant="text" width="50%" height={30} />
          <Skeleton variant="text" width="40%" height={30} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
      </Box>
    </Container>
  );
}
