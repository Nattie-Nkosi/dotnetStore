import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";

interface InventoryParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
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
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.append("pageNumber", params.pageNumber.toString());
        searchParams.append("pageSize", params.pageSize.toString());

        if (params.searchTerm) {
          searchParams.append("searchTerm", params.searchTerm);
        }

        return `products?${searchParams.toString()}`;
      },
      transformResponse: (response: Product[], meta) => {
        console.log("[Inventory API] Raw response:", response);
        console.log("[Inventory API] Meta object:", meta);

        let paginationHeader: string | null = null;

        // Try to get the Pagination header from various possible locations
        if (meta?.response) {
          const headers = meta.response.headers;
          console.log("[Inventory API] Headers object type:", typeof headers);
          console.log("[Inventory API] Headers:", headers);

          // Check if it's a Headers instance (has .get method)
          if (typeof headers.get === 'function') {
            paginationHeader = headers.get('Pagination') || headers.get('pagination');
            console.log("[Inventory API] Header via .get():", paginationHeader);
          }

          // Check if headers is a plain object
          if (!paginationHeader && typeof headers === 'object') {
            // @ts-ignore - trying different possible key formats
            paginationHeader = headers['Pagination'] || headers['pagination'] || headers['PAGINATION'];
            console.log("[Inventory API] Header via object access:", paginationHeader);
          }

          // Try iterating if it's a Headers instance
          if (!paginationHeader && typeof headers.entries === 'function') {
            console.log("[Inventory API] All headers via iteration:");
            for (const [key, value] of headers.entries()) {
              console.log(`  ${key}: ${value}`);
              if (key.toLowerCase() === 'pagination') {
                paginationHeader = value;
              }
            }
          }
        }

        console.log("[Inventory API] Final pagination header:", paginationHeader);

        let metaData: PaginationMetaData;

        if (paginationHeader) {
          try {
            metaData = JSON.parse(paginationHeader);
            console.log("[Inventory API] ✅ Parsed metadata:", metaData);
          } catch (e) {
            console.error("[Inventory API] ❌ Failed to parse pagination header:", e);
            // Fallback metadata
            metaData = {
              currentPage: 1,
              totalPages: 1,
              pageSize: 10,
              totalCount: response.length,
            };
          }
        } else {
          console.warn("[Inventory API] ⚠️ No pagination header found - using fallback");
          // Fallback metadata
          metaData = {
            currentPage: 1,
            totalPages: 1,
            pageSize: 10,
            totalCount: response.length,
          };
        }

        return { products: response, metaData };
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
