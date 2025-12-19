import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";

interface InventoryParams {
  pageNumber: number;
  pageSize: number;
}

interface PaginationMetaData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

interface PaginatedResponse {
  products: Product[];
  metaData: PaginationMetaData;
}

const baseUrl = import.meta.env.VITE_API_URL || "https://localhost:5001/api";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["InventoryProducts"],
  endpoints: (builder) => ({
    fetchInventoryProducts: builder.query<PaginatedResponse, InventoryParams>({
      queryFn: async (params, _queryApi, _extraOptions, fetchWithBQ) => {
        const searchParams = new URLSearchParams();
        searchParams.append("pageNumber", params.pageNumber.toString());
        searchParams.append("pageSize", params.pageSize.toString());

        const result = await fetchWithBQ(`products?${searchParams.toString()}`);

        if (result.error) {
          return { error: result.error };
        }

        const products = result.data as Product[];
        const paginationHeader = result.meta?.response?.headers.get("Pagination");

        let metaData: PaginationMetaData = {
          currentPage: params.pageNumber,
          totalPages: 1,
          pageSize: params.pageSize,
          totalCount: products.length,
        };

        if (paginationHeader) {
          try {
            metaData = JSON.parse(paginationHeader);
          } catch (e) {
            console.error("Failed to parse pagination header:", e);
          }
        }

        return {
          data: { products, metaData },
        };
      },
      providesTags: ["InventoryProducts"],
    }),
    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["InventoryProducts"],
    }),
    updateProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "products",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["InventoryProducts"],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InventoryProducts"],
    }),
  }),
});

export const {
  useFetchInventoryProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = inventoryApi;
