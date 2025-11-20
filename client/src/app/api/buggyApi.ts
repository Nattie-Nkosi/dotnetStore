import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";

export const buggyApi = createApi({
  reducerPath: "buggyApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    getNotFound: builder.query<void, void>({
      query: () => "buggy/not-found",
    }),
    getBadRequest: builder.query<void, void>({
      query: () => "buggy/bad-request",
    }),
    getUnauthorized: builder.query<void, void>({
      query: () => "buggy/unauthorized",
    }),
    getValidationError: builder.query<void, void>({
      query: () => "buggy/validation-error",
    }),
    getServerError: builder.query<void, void>({
      query: () => "buggy/server-error",
    }),
    getNullReference: builder.query<void, void>({
      query: () => "buggy/null-reference",
    }),
    getDivideByZero: builder.query<void, void>({
      query: () => "buggy/divide-by-zero",
    }),
    getArgumentNull: builder.query<void, void>({
      query: () => "buggy/argument-null",
    }),
    getArgumentException: builder.query<void, void>({
      query: () => "buggy/argument-exception",
    }),
    getInvalidOperation: builder.query<void, void>({
      query: () => "buggy/invalid-operation",
    }),
  }),
});

export const {
  useLazyGetNotFoundQuery,
  useLazyGetBadRequestQuery,
  useLazyGetUnauthorizedQuery,
  useLazyGetValidationErrorQuery,
  useLazyGetServerErrorQuery,
  useLazyGetNullReferenceQuery,
  useLazyGetDivideByZeroQuery,
  useLazyGetArgumentNullQuery,
  useLazyGetArgumentExceptionQuery,
  useLazyGetInvalidOperationQuery,
} = buggyApi;
