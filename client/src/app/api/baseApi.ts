import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const customBaseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5001/api/",
});

export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await customBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    if (status === 401) {
      console.error("Unauthorized - please log in");
    } else if (status === 404) {
      console.error("Resource not found");
    } else if (status === 500) {
      console.error("Server error");
    }
  }

  return result;
};
