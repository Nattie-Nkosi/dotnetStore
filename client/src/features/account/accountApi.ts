import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { User, Address } from "../../app/models/user";
import { basketApi } from "../basket/basketApi";

interface RegisterDto {
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User", "Address"],
  endpoints: (builder) => ({
    getUserInfo: builder.query<User | null, void>({
      query: () => "account/user-info",
      providesTags: ["User"],
      transformErrorResponse: (response) => {
        if (response.status === 204) {
          return null;
        }
        return response;
      },
    }),
    register: builder.mutation<void, RegisterDto>({
      query: (credentials) => ({
        url: "account/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<User, LoginDto>({
      query: (credentials) => ({
        url: "account/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(basketApi.util.invalidateTags(["Basket"]));
        } catch {
          // Login failed, do nothing
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "account/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Address"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(basketApi.util.invalidateTags(["Basket"]));
        } catch {
          // Logout failed, do nothing
        }
      },
    }),
    getSavedAddress: builder.query<Address | null, void>({
      query: () => "account/address",
      providesTags: ["Address"],
      transformErrorResponse: (response) => {
        if (response.status === 204) {
          return null;
        }
        return response;
      },
    }),
    createOrUpdateAddress: builder.mutation<Address, Omit<Address, "id">>({
      query: (address) => ({
        url: "account/address",
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetSavedAddressQuery,
  useCreateOrUpdateAddressMutation,
} = accountApi;
