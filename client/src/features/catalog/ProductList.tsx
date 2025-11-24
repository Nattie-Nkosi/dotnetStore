import { Grid, Box, Typography, Chip } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Our Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discover our amazing collection
          </Typography>
        </Box>
        <Chip
          label={`${products.length} ${products.length === 1 ? "Product" : "Products"}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {products.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}
    </Box>
  );
}
