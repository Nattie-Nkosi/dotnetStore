import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductParams } from "../../app/models/product";

interface CatalogState {
  productParams: ProductParams;
}

const initialState: CatalogState = {
  productParams: {
    pageNumber: 1,
    pageSize: 8,
    orderBy: "name",
  },
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setProductParams: (state, action: PayloadAction<Partial<ProductParams>>) => {
      state.productParams = { ...state.productParams, ...action.payload };
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.productParams.pageNumber = action.payload;
    },
    resetProductParams: (state) => {
      state.productParams = initialState.productParams;
    },
  },
});

export const { setProductParams, setPageNumber, resetProductParams } =
  catalogSlice.actions;
