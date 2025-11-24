import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useFetchBasketQuery, useRemoveBasketItemMutation } from "./basketApi";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useAddBasketItemMutation } from "./basketApi";
import { toast } from "react-toastify";

export default function BasketPage() {
  const { data: basket, isLoading } = useFetchBasketQuery();
  const [removeItem] = useRemoveBasketItemMutation();
  const [addItem] = useAddBasketItemMutation();

  if (isLoading) return <Typography>Loading basket...</Typography>;

  if (!basket || basket.items.length === 0) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Your basket is empty
        </Typography>
      </Container>
    );
  }

  const subtotal = basket.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemoveItem = async (productId: number, quantity: number) => {
    try {
      await removeItem({ productId, quantity }).unwrap();
      toast.success(
        quantity === 1 ? "Item quantity decreased" : "Item removed from cart",
        { autoClose: 2000 }
      );
    } catch (error) {
      // Error is already handled by baseApi
      console.error("Failed to remove item from cart:", error);
    }
  };

  const handleAddItem = async (productId: number) => {
    try {
      await addItem({ productId, quantity: 1 }).unwrap();
      toast.success("Item quantity increased", { autoClose: 2000 });
    } catch (error) {
      // Error is already handled by baseApi
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  R{(item.price / 100).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Button
                      onClick={() => handleRemoveItem(item.productId, 1)}
                      color="error"
                      size="small"
                    >
                      <Remove />
                    </Button>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <Button
                      onClick={() => handleAddItem(item.productId)}
                      color="primary"
                      size="small"
                    >
                      <Add />
                    </Button>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  R{((item.price * item.quantity) / 100).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() =>
                      handleRemoveItem(item.productId, item.quantity)
                    }
                    color="error"
                  >
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Paper sx={{ p: 3, width: 300 }}>
          <Typography variant="h5" gutterBottom>
            Order Summary
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ mt: 2, mb: 2 }}
          >
            <Typography variant="h6">Subtotal:</Typography>
            <Typography variant="h6">R{(subtotal / 100).toFixed(2)}</Typography>
          </Box>
          <Button variant="contained" fullWidth size="large">
            Checkout
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
