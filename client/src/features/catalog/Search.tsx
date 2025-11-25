import { useState, useEffect } from "react";
import { TextField, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setProductParams } from "./catalogSlice";

export default function Search() {
  const dispatch = useAppDispatch();
  const productParams = useAppSelector((state) => state.catalog.productParams);
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        setProductParams({
          searchTerm: searchTerm || undefined,
          pageNumber: 1,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Paper sx={{ mb: 2, p: 2 }}>
      <TextField
        label="Search products"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name, brand, type, or description..."
      />
    </Paper>
  );
}
