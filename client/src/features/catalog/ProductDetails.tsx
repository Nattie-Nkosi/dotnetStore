import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  alpha,
  Alert,
  Rating,
  Chip,
  Stack,
  Breadcrumbs,
} from "@mui/material";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchProductDetailsQuery } from "./catalogApi";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useFetchProductDetailsQuery(Number(id));
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    alert(`Added ${quantity} x ${product?.name} to cart`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
            elevation={1}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: isDarkMode
                ? alpha(theme.palette.background.paper, 0.6)
                : "#f5f5f5",
              p: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 400,
            }}
          >
            <Box
              component="img"
              src={product.pictureUrl}
              alt={product.name}
              sx={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {product.name}
              </Typography>
              <Button
                component={Link}
                to="/catalog"
                startIcon={<ArrowBackIcon />}
                size="small"
                sx={{ mt: 1 }}
              >
                Back
              </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Rating value={4.5} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                4.5 (24 reviews)
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Chip
                label={product.brand}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip label={product.type} size="small" variant="outlined" />
              {product.quantityInStock > 0 ? (
                <Chip label="In Stock" size="small" color="success" />
              ) : (
                <Chip label="Out of Stock" size="small" color="error" />
              )}
            </Stack>

            <Typography
              variant="h5"
              color="primary"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 3 }}
            >
              R{(product.price / 100).toFixed(2)}
            </Typography>

            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {product.description ||
                "No description available for this product."}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                gap: 2,
              }}
            >
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{
                  inputProps: { min: 1, max: product.quantityInStock },
                }}
                size="small"
                sx={{ width: 100 }}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.quantityInStock === 0}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Add to Cart
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<FavoriteBorderIcon />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Wishlist
              </Button>
            </Box>

            <Box
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Free shipping on orders over R500
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                SKU: {product.id.toString().padStart(6, "0")}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Available: {product.quantityInStock} in stock
              </Typography>
              <Typography variant="subtitle2">
                Category: {product.type}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product tabs section */}
      <Paper sx={{ mt: 6, borderRadius: 3, overflow: "hidden" }} elevation={1}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="product information tabs"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab label="Description" id="tab-0" />
          <Tab label="Specifications" id="tab-1" />
          <Tab label="Reviews" id="tab-2" />
        </Tabs>

        {/* Tab content */}
        <Box p={3} role="tabpanel" hidden={activeTab !== 0}>
          {activeTab === 0 && (
            <Typography variant="body1">
              {product.description ||
                "No detailed description available for this product."}
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Nulla facilisi. Mauris vel mauris vel tortor finibus
              elementum. Quisque sit amet metus vel risus efficitur faucibus.
              Donec convallis, purus in imperdiet pharetra, arcu sem pharetra
              sapien, non interdum nulla purus et velit.
            </Typography>
          )}
        </Box>

        <Box p={3} role="tabpanel" hidden={activeTab !== 1}>
          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Brand</Typography>
                <Typography variant="body1" paragraph>
                  {product.brand}
                </Typography>

                <Typography variant="subtitle2">Type</Typography>
                <Typography variant="body1" paragraph>
                  {product.type}
                </Typography>

                <Typography variant="subtitle2">Material</Typography>
                <Typography variant="body1" paragraph>
                  Premium quality
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Dimensions</Typography>
                <Typography variant="body1" paragraph>
                  Standard
                </Typography>

                <Typography variant="subtitle2">Weight</Typography>
                <Typography variant="body1" paragraph>
                  0.5 kg
                </Typography>

                <Typography variant="subtitle2">Warranty</Typography>
                <Typography variant="body1" paragraph>
                  1 year manufacturer warranty
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>

        <Box p={3} role="tabpanel" hidden={activeTab !== 2}>
          {activeTab === 2 && (
            <Typography variant="body1">
              No reviews yet. Be the first to review this product!
            </Typography>
          )}
        </Box>
      </Paper>
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
