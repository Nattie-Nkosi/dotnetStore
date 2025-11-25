import {
  Box,
  Alert,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import ProductList from "./ProductList";
import Filters from "./Filters";
import Search from "./Search";
import Sorting from "./Sorting";
import Pagination from "./Pagination";
import { useFetchProductsQuery, useFetchFiltersQuery } from "./catalogApi";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setProductParams } from "./catalogSlice";

export default function Catalog() {
  const dispatch = useAppDispatch();
  const productParams = useAppSelector((state) => state.catalog.productParams);

  const {
    data: products = [],
    error,
    isLoading,
  } = useFetchProductsQuery(productParams);
  const { data: filters } = useFetchFiltersQuery();

  const handleBrandChange = (brand: string) => {
    const currentBrands =
      productParams.brands?.split(",").filter(Boolean) || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b: string) => b !== brand)
      : [...currentBrands, brand];

    dispatch(
      setProductParams({
        brands: newBrands.length > 0 ? newBrands.join(",") : undefined,
        pageNumber: 1,
      })
    );
  };

  const handleTypeChange = (type: string) => {
    const currentTypes = productParams.types?.split(",").filter(Boolean) || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t: string) => t !== type)
      : [...currentTypes, type];

    dispatch(
      setProductParams({
        types: newTypes.length > 0 ? newTypes.join(",") : undefined,
        pageNumber: 1,
      })
    );
  };

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

  const selectedBrands = productParams.brands?.split(",").filter(Boolean) || [];
  const selectedTypes = productParams.types?.split(",").filter(Boolean) || [];

  return (
    <Box>
      <Search />

      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Filters
            filters={filters}
            selectedBrands={selectedBrands}
            selectedTypes={selectedTypes}
            onBrandChange={handleBrandChange}
            onTypeChange={handleTypeChange}
          />
        </Grid>

        <Grid item xs={9}>
          <Paper sx={{ mb: 2, p: 2 }}>
            <Sorting />
          </Paper>
          <Box sx={{ position: "relative", minHeight: 400 }}>
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(2px)",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <CircularProgress size={60} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="primary">
                    Loading products...
                  </Typography>
                </Box>
              </Box>
            )}
            <ProductList products={products} />
          </Box>
          <Pagination isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
