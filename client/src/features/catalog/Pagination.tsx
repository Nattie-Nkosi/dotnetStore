import { Pagination as MuiPagination, Typography, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setPageNumber } from "./catalogSlice";

interface PaginationProps {
  isLoading?: boolean;
}

export default function Pagination({ isLoading = false }: PaginationProps) {
  const dispatch = useAppDispatch();
  const { metaData, productParams } = useAppSelector((state) => state.catalog);

  if (!metaData || metaData.totalPages <= 1) {
    return null;
  }

  const { currentPage, totalPages, totalCount, pageSize } = metaData;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPageNumber(page));
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing <strong>{startItem}-{endItem}</strong> of <strong>{totalCount}</strong> items
      </Typography>
      <MuiPagination
        count={totalPages}
        page={productParams.pageNumber || 1}
        onChange={handlePageChange}
        color="primary"
        size="large"
        disabled={isLoading}
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 0.3s",
          },
        }}
      />
    </Paper>
  );
}
