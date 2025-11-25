/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { Product, ProductParams, Filters } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { setMetaData } from "./catalogSlice";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    fetchProducts: builder.query<Product[], ProductParams | void>({
      query: (params) => {
        if (!params) {
          return "products";
        }
        return {
          url: "products",
          params,
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { meta } = await queryFulfilled;
          const paginationHeader = (meta as any)?.response?.headers.get("Pagination");
          if (paginationHeader) {
            const metaData = JSON.parse(paginationHeader);
            dispatch(setMetaData(metaData));
          }
        } catch (error) {
          console.error("Failed to extract pagination metadata:", error);
        }
      },
    }),
    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => `products/${productId}`,
    }),
    fetchFilters: builder.query<Filters, void>({
      query: () => "products/filters",
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchFiltersQuery
} = catalogApi;