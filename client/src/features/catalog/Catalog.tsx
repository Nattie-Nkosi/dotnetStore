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
  Pagination as MuiPagination,
  Skeleton,
  Divider,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import {
  FilterList,
  Close,
  Inventory2Outlined,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import { useState } from "react";
import ProductList from "./ProductList";
import Filters from "./Filters";
import Search from "./Search";
import Sorting from "./Sorting";
import { useFetchProductsQuery, useFetchFiltersQuery } from "./catalogApi";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setProductParams, setPageNumber } from "./catalogSlice";

export default function Catalog() {
  const dispatch = useAppDispatch();
  const productParams = useAppSelector((state) => state.catalog.productParams);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useFetchProductsQuery(productParams);
  const { data: filters } = useFetchFiltersQuery();

  const products = data?.products || [];
  const metaData = data?.metaData;

  console.log("[Catalog Component] Products:", products.length);
  console.log("[Catalog Component] MetaData:", metaData);

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

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPageNumber(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const startItem = metaData ? (metaData.currentPage - 1) * metaData.pageSize + 1 : 0;
  const endItem = metaData ? Math.min(metaData.currentPage * metaData.pageSize, metaData.totalCount) : 0;

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

          {/* Products Section */}
          <Box sx={{ position: "relative", minHeight: 400 }}>
            {/* Loading Overlay */}
            {isFetching && !isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(2px)",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={48} />
              </Box>
            )}

            {/* Initial Loading */}
            {isLoading ? (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Skeleton variant="text" width={200} height={40} />
                  <Skeleton variant="rounded" width={100} height={32} />
                </Box>
                <Grid container spacing={3}>
                  {[...Array(8)].map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Skeleton variant="rounded" height={380} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <ProductList products={products} />
            )}
          </Box>

          {/* Pagination Section */}
          {metaData && metaData.totalCount > 0 && (
            <Paper
              elevation={2}
              sx={{
                mt: 4,
                mb: 4,
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Inventory2Outlined color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Showing <strong>{startItem}-{endItem}</strong> of{" "}
                  <strong>{metaData.totalCount}</strong> products
                </Typography>
              </Box>

              {metaData.totalPages > 1 && (
                <>
                  {!isSmall && <Divider orientation="vertical" flexItem />}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    {/* Navigation Buttons */}
                    <ButtonGroup
                      variant="outlined"
                      size={isSmall ? "small" : "medium"}
                      disabled={isFetching}
                    >
                      <Tooltip title="First Page">
                        <Button
                          onClick={() => handlePageChange({} as React.ChangeEvent<unknown>, 1)}
                          disabled={metaData.currentPage === 1 || isFetching}
                          startIcon={<FirstPage />}
                        >
                          {!isSmall && "First"}
                        </Button>
                      </Tooltip>
                      <Tooltip title="Previous Page">
                        <Button
                          onClick={() => handlePageChange({} as React.ChangeEvent<unknown>, metaData.currentPage - 1)}
                          disabled={metaData.currentPage === 1 || isFetching}
                          startIcon={<NavigateBefore />}
                        >
                          {!isSmall && "Prev"}
                        </Button>
                      </Tooltip>
                      <Tooltip title="Next Page">
                        <Button
                          onClick={() => handlePageChange({} as React.ChangeEvent<unknown>, metaData.currentPage + 1)}
                          disabled={metaData.currentPage === metaData.totalPages || isFetching}
                          endIcon={<NavigateNext />}
                        >
                          {!isSmall && "Next"}
                        </Button>
                      </Tooltip>
                      <Tooltip title="Last Page">
                        <Button
                          onClick={() => handlePageChange({} as React.ChangeEvent<unknown>, metaData.totalPages)}
                          disabled={metaData.currentPage === metaData.totalPages || isFetching}
                          endIcon={<LastPage />}
                        >
                          {!isSmall && "Last"}
                        </Button>
                      </Tooltip>
                    </ButtonGroup>

                    {/* Page Numbers */}
                    <MuiPagination
                      count={metaData.totalPages}
                      page={metaData.currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size={isSmall ? "small" : "medium"}
                      disabled={isFetching}
                      showFirstButton={false}
                      showLastButton={false}
                      siblingCount={isSmall ? 0 : 1}
                      boundaryCount={1}
                      sx={{
                        "& .MuiPaginationItem-root": {
                          opacity: isFetching ? 0.5 : 1,
                          transition: "opacity 0.2s",
                        },
                      }}
                    />
                  </Box>
                </>
              )}
            </Paper>
          )}

          {/* No Products Message */}
          {!isLoading && products.length === 0 && (
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                mt: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
