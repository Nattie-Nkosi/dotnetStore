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
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
          >
            Our Products
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
          >
            Discover our amazing collection
          </Typography>
        </Box>
        <Chip
          label={`${products.length} ${products.length === 1 ? "Product" : "Products"}`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        />
      </Box>

      {/* Product Grid */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {products.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && (
        <Box sx={{ textAlign: "center", py: { xs: 6, sm: 8 } }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            No products found
          </Typography>
        </Box>
      )}
    </Box>
  );
}
