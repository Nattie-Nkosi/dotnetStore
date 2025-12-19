import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, ProductParams, Filters } from "../../app/models/product";

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

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchProducts: builder.query<PaginatedResponse, ProductParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.pageNumber) searchParams.append("pageNumber", params.pageNumber.toString());
        if (params.pageSize) searchParams.append("pageSize", params.pageSize.toString());
        if (params.orderBy) searchParams.append("orderBy", params.orderBy);
        if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
        if (params.brands) searchParams.append("brands", params.brands);
        if (params.types) searchParams.append("types", params.types);

        return `products?${searchParams.toString()}`;
      },
      transformResponse: (response: Product[], meta) => {
        console.log("[Catalog API] Raw response:", response);
        console.log("[Catalog API] Meta object:", meta);

        let paginationHeader: string | null = null;

        // Try to get the Pagination header from various possible locations
        if (meta?.response) {
          const headers = meta.response.headers;
          console.log("[Catalog API] Headers object type:", typeof headers);
          console.log("[Catalog API] Headers:", headers);

          // Check if it's a Headers instance (has .get method)
          if (typeof headers.get === 'function') {
            paginationHeader = headers.get('Pagination') || headers.get('pagination');
            console.log("[Catalog API] Header via .get():", paginationHeader);
          }

          // Check if headers is a plain object
          if (!paginationHeader && typeof headers === 'object') {
            // @ts-ignore - trying different possible key formats
            paginationHeader = headers['Pagination'] || headers['pagination'] || headers['PAGINATION'];
            console.log("[Catalog API] Header via object access:", paginationHeader);
          }

          // Try iterating if it's a Headers instance
          if (!paginationHeader && typeof headers.entries === 'function') {
            console.log("[Catalog API] All headers via iteration:");
            for (const [key, value] of headers.entries()) {
              console.log(`  ${key}: ${value}`);
              if (key.toLowerCase() === 'pagination') {
                paginationHeader = value;
              }
            }
          }
        }

        console.log("[Catalog API] Final pagination header:", paginationHeader);

        let metaData: PaginationMetaData;

        if (paginationHeader) {
          try {
            metaData = JSON.parse(paginationHeader);
            console.log("[Catalog API] ✅ Parsed metadata:", metaData);
          } catch (e) {
            console.error("[Catalog API] ❌ Failed to parse pagination header:", e);
            // Fallback metadata
            metaData = {
              currentPage: 1,
              totalPages: 1,
              pageSize: 8,
              totalCount: response.length,
            };
          }
        } else {
          console.warn("[Catalog API] ⚠️ No pagination header found - using fallback");
          // Fallback metadata
          metaData = {
            currentPage: 1,
            totalPages: 1,
            pageSize: 8,
            totalCount: response.length,
          };
        }

        return { products: response, metaData };
      },
      providesTags: ["Products"],
    }),
    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => `products/${productId}`,
      providesTags: (_result, _error, arg) => [{ type: "Products", id: arg }],
    }),
    fetchFilters: builder.query<Filters, void>({
      query: () => "products/filters",
    }),
    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "products",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchFiltersQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = catalogApi;
