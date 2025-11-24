import {
  Button,
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  useTheme,
  CircularProgress,
  Chip,
  CardContent,
  CardActions,
  Rating,
  Tooltip,
} from "@mui/material";
import { Product } from "../../app/models/product";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import { Link } from "react-router-dom";
import { useAddBasketItemMutation } from "../basket/basketApi";
import { toast } from "react-toastify";
import { isFetchBaseQueryError, isErrorWithMessage } from "../../app/utils/typeGuards";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [addItem, { isLoading }] = useAddBasketItemMutation();

  const handleAddToCart = async () => {
    try {
      await addItem({ productId: product.id, quantity: 1 }).unwrap();
      toast.success(`${product.name} added to cart!`, {
        autoClose: 3000,
      });
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
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isDarkMode
            ? "0 8px 24px rgba(0,0,0,0.4)"
            : "0 8px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Stock Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1,
        }}
      >
        {product.quantityInStock > 0 ? (
          <Chip
            label="In Stock"
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        ) : (
          <Chip
            label="Out of Stock"
            size="small"
            color="error"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      {/* Quick Action Buttons */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip title="Quick View" placement="left">
          <IconButton
            component={Link}
            to={`/catalog/${product.id}`}
            size="small"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
          >
            <RemoveRedEyeOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add to Wishlist" placement="left">
          <IconButton
            size="small"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "error.main",
                color: "white",
              },
            }}
          >
            <FavoriteBorderOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Product Image */}
      <CardMedia
        component="img"
        image={product.pictureUrl}
        alt={product.name}
        sx={{
          height: 240,
          objectFit: "contain",
          backgroundColor: isDarkMode ? "background.default" : "#f5f5f5",
          p: 3,
          cursor: "pointer",
        }}
        onClick={() => window.location.href = `/catalog/${product.id}`}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Brand and Type */}
        <Box sx={{ mb: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          <Chip label={product.brand} size="small" variant="outlined" />
          <Chip label={product.type} size="small" variant="outlined" />
        </Box>

        {/* Product Name */}
        <Typography
          variant="h6"
          component={Link}
          to={`/catalog/${product.id}`}
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "text.primary",
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textDecoration: "none",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating value={4.5} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            (24)
          </Typography>
        </Box>

        {/* Price */}
        <Typography
          variant="h5"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            mb: 1,
          }}
        >
          R{(product.price / 100).toFixed(2)}
        </Typography>

        {/* Free Delivery Badge */}
        {product.price >= 50000 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <LocalShippingOutlined fontSize="small" color="success" />
            <Typography variant="caption" color="success.main" fontWeight={600}>
              Free Delivery
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={isLoading || product.quantityInStock === 0}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <ShoppingCartIcon />
            )
          }
          onClick={handleAddToCart}
          sx={{
            py: 1,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1.5,
          }}
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
}
