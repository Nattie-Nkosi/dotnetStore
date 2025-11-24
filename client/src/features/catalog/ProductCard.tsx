import {
  Button,
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Product } from "../../app/models/product";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Link } from "react-router-dom";
import { useAddBasketItemMutation } from "../basket/basketApi";
import { toast } from "react-toastify";

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
      // Error is already handled by baseApi
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        width: 280,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "16px",
        backgroundColor: isDarkMode ? "background.paper" : "white",
        boxShadow: isDarkMode
          ? "0 2px 12px rgba(0,0,0,0.3)"
          : "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <CardMedia
        sx={{
          height: 240,
          width: "100%",
          backgroundSize: "contain",
          backgroundColor: isDarkMode ? "background.default" : "#f5f5f5",
          p: 2,
        }}
        image={product.pictureUrl}
        title={product.name}
      />
      <Box sx={{ p: 2, pt: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "text.primary",
            mb: 1,
          }}
        >
          {product.name}
        </Typography>
        <Typography
          sx={{
            color: "primary.main",
            fontWeight: 600,
            fontSize: "1.1rem",
            mb: 2,
          }}
        >
          R{(product.price / 100).toFixed(2)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <ShoppingCartIcon />
              )
            }
            onClick={handleAddToCart}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </Button>
          <IconButton
            component={Link}
            to={`/catalog/${product.id}`}
            size="small"
            sx={{
              border: 1,
              borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "divider",
              borderRadius: "8px",
              width: "40px",
              height: "40px",
              color: "text.primary",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
              },
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
