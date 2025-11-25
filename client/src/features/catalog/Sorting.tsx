import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setProductParams } from "./catalogSlice";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to Low" },
  { value: "price", label: "Price - Low to High" },
];

export default function Sorting() {
  const dispatch = useAppDispatch();
  const productParams = useAppSelector((state) => state.catalog.productParams);

  const handleSortChange = (event: SelectChangeEvent) => {
    dispatch(
      setProductParams({
        orderBy: event.target.value,
        pageNumber: 1,
      })
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={productParams.orderBy || "name"}
        label="Sort By"
        onChange={handleSortChange}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
