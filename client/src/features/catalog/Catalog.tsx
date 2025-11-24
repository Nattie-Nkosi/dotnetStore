import { Box, Alert } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchProductsQuery } from "./catalogApi";

export default function Catalog() {
  const { data: products = [], error } = useFetchProductsQuery();

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load products. Please ensure the server is running and try
          again.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <ProductList products={products} />
    </>
  );
}
