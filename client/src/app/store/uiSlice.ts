import { createSlice } from "@reduxjs/toolkit";
import { catalogApi } from "../../features/catalog/catalogApi";
import { basketApi } from "../../features/basket/basketApi";

interface UiState {
  isLoading: boolean;
  darkMode: boolean;
}

const getInitialDarkMode = (): boolean => {
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) {
    return stored === "true";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const initialState: UiState = {
  isLoading: false,
  darkMode: getInitialDarkMode(),
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", String(state.darkMode));
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(catalogApi.endpoints.fetchProducts.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(catalogApi.endpoints.fetchProducts.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(catalogApi.endpoints.fetchProducts.matchRejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(catalogApi.endpoints.fetchProductDetails.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(catalogApi.endpoints.fetchProductDetails.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(catalogApi.endpoints.fetchProductDetails.matchRejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(basketApi.endpoints.addBasketItem.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(basketApi.endpoints.addBasketItem.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(basketApi.endpoints.addBasketItem.matchRejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(basketApi.endpoints.removeBasketItem.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(basketApi.endpoints.removeBasketItem.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(basketApi.endpoints.removeBasketItem.matchRejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLoading, toggleDarkMode } = uiSlice.actions;
