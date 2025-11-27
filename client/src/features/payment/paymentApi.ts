import { createApi } from "@reduxjs/toolkit/query/react";
import { Basket } from "../../app/models/basket";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<Basket, void>({
      query: () => ({
        url: "payments",
        method: "POST",
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
