import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InventoryState {
  pageNumber: number;
  pageSize: number;
}

const initialState: InventoryState = {
  pageNumber: 1,
  pageSize: 10,
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
    resetInventoryParams: (state) => {
      state.pageNumber = initialState.pageNumber;
      state.pageSize = initialState.pageSize;
    },
  },
});

export const { setInventoryPageNumber, setInventoryPageSize, resetInventoryParams } =
  inventorySlice.actions;
