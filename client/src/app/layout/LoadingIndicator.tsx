import { Box, LinearProgress } from "@mui/material";
import { useAppSelector } from "../store/store";

export default function LoadingIndicator() {
  const isLoading = useAppSelector((state) => state.ui.isLoading);

  if (!isLoading) return null;

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <LinearProgress color="primary" />
    </Box>
  );
}
