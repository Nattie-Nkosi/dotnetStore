import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterReducer";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../../features/catalog/catalogApi";
import { basketApi } from "../../features/basket/basketApi";
import { buggyApi } from "../api/buggyApi";
import { uiSlice } from "./uiSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    ui: uiSlice.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [basketApi.reducerPath]: basketApi.reducer,
    [buggyApi.reducerPath]: buggyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catalogApi.middleware, basketApi.middleware, buggyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>()