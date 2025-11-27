import {
  Box,
  Alert,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Drawer,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Badge,
} from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import { useState } from "react";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [filtersOpen, setFiltersOpen] = useState(false);

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
  const activeFiltersCount = selectedBrands.length + selectedTypes.length;

  const filtersContent = (
    <Filters
      filters={filters}
      selectedBrands={selectedBrands}
      selectedTypes={selectedTypes}
      onBrandChange={handleBrandChange}
      onTypeChange={handleTypeChange}
    />
  );

  return (
    <Box>
      <Search />

      {/* Mobile Filters Button */}
      {isMobile && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFiltersOpen(true)}
            fullWidth
            sx={{ justifyContent: "flex-start", py: 1.5 }}
          >
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                badgeContent={activeFiltersCount}
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Button>
        </Box>
      )}

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={filtersOpen && isMobile}
        onClose={() => setFiltersOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "85%",
            maxWidth: 360,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  badgeContent={activeFiltersCount}
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            <IconButton onClick={() => setFiltersOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          {filtersContent}
          <Button
            variant="contained"
            fullWidth
            onClick={() => setFiltersOpen(false)}
            sx={{ mt: 2 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      <Grid container spacing={4}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            {filtersContent}
          </Grid>
        )}

        <Grid item xs={12} md={isMobile ? 12 : 9}>
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
