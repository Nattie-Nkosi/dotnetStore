import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductParams } from "../../app/models/product";

interface CatalogState {
  productParams: ProductParams;
  metaData: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  } | null;
}

const initialState: CatalogState = {
  productParams: {
    pageNumber: 1,
    pageSize: 8,
  },
  metaData: null,
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setProductParams: (state, action: PayloadAction<ProductParams>) => {
      state.productParams = { ...state.productParams, ...action.payload };
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.productParams.pageNumber = action.payload;
    },
    setMetaData: (
      state,
      action: PayloadAction<{
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
      }>
    ) => {
      state.metaData = action.payload;
    },
    resetProductParams: (state) => {
      state.productParams = initialState.productParams;
    },
  },
});

export const { setProductParams, setPageNumber, setMetaData, resetProductParams } =
  catalogSlice.actions;
