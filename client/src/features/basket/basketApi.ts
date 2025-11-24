import { createApi } from "@reduxjs/toolkit/query/react";
import { Basket } from "../../app/models/basket";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Basket"],
  endpoints: (builder) => ({
    fetchBasket: builder.query<Basket | null, void>({
      query: () => "basket",
      providesTags: ["Basket"],
      transformResponse: (response: Basket) => response,
      transformErrorResponse: (response) => {
        if (response.status === 204) {
          return null;
        }
        return response;
      },
    }),
    addBasketItem: builder.mutation<
      Basket,
      { productId: number; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: "POST",
      }),
      invalidatesTags: ["Basket"],
    }),
    removeBasketItem: builder.mutation<
      void,
      { productId: number; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Basket"],
    }),
  }),
});

export const {
  useFetchBasketQuery,
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
} = basketApi;
