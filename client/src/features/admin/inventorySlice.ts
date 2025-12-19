import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InventoryState {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
}

const initialState: InventoryState = {
  pageNumber: 1,
  pageSize: 10,
  searchTerm: "",
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventoryPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setInventoryPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setInventorySearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.pageNumber = 1;
    },
    resetInventoryParams: (state) => {
      state.pageNumber = initialState.pageNumber;
      state.pageSize = initialState.pageSize;
      state.searchTerm = initialState.searchTerm;
    },
  },
});

export const { setInventoryPageNumber, setInventoryPageSize, setInventorySearchTerm, resetInventoryParams } =
  inventorySlice.actions;
