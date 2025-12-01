import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { Order, CreateOrderRequest } from "./order";
import { basketApi } from "../basket/basketApi";

export type {
  ShippingAddress,
  CreateOrderRequest,
  OrderItem,
  PaymentSummary,
  Order,
} from "./order";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "orders",
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<Order, number>({
      query: (id) => `orders/${id}`,
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation<number, CreateOrderRequest>({
      query: (order) => ({
        url: "orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Orders"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(basketApi.util.invalidateTags(["Basket"]));
        } catch {
          // Error is handled by the component
        }
      },
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, useCreateOrderMutation } =
  ordersApi;
