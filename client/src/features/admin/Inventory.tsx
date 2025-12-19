import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination as MuiPagination,
  Skeleton,
  Divider,
  useMediaQuery,
  useTheme,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Inventory2Outlined,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import { useState } from "react";
import {
  useFetchInventoryProductsQuery,
  useDeleteProductMutation,
} from "./inventoryApi";
import { Product } from "../../app/models/product";
import ProductForm from "./ProductForm";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setInventoryPageNumber } from "./inventorySlice";

export default function Inventory() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { pageNumber, pageSize } = useAppSelector((state) => state.inventory);

  const { data, error, isLoading, isFetching } = useFetchInventoryProductsQuery({
    pageNumber,
    pageSize,
  });

  const products = data?.products || [];
  const metaData = data?.metaData;

  console.log("[Inventory Component] Products:", products.length);
  console.log("[Inventory Component] MetaData:", metaData);

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(undefined);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedProduct(undefined);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id).unwrap();
        toast.success("Product deleted successfully");
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setInventoryPageNumber(page));
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

  const startItem = metaData ? (metaData.currentPage - 1) * metaData.pageSize + 1 : 0;
  const endItem = metaData ? Math.min(metaData.currentPage * metaData.pageSize, metaData.totalCount) : 0;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Inventory Management
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Create Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ position: "relative" }}>
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

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="rounded" width={60} height={60} /></TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
                  <TableCell align="center"><Skeleton variant="rounded" width={40} height={24} /></TableCell>
                  <TableCell align="right"><Skeleton variant="rounded" width={80} height={32} /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary" py={4}>
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                >
                  <TableCell>
                    <Avatar
                      src={product.pictureUrl}
                      alt={product.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      R{(product.price / 100).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.type} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.brand}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.quantityInStock}
                      size="small"
                      color={product.quantityInStock > 0 ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(product)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      {metaData && metaData.totalCount > 0 && (
        <Paper
          elevation={2}
          sx={{
            mt: 3,
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

      <ProductForm
        open={formOpen}
        onClose={handleCloseForm}
        product={selectedProduct}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{productToDelete?.name}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
