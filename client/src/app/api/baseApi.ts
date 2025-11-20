import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

interface ProblemDetails {
  title?: string;
  status?: number;
  detail?: string;
  type?: string;
  errors?: Record<string, string[]>;
}

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
    const errorData = result.error.data as ProblemDetails | undefined;

    if (status === 400) {
      toast.error(`400 Bad Request: ${errorData?.title || "Bad request error"}`, {
        autoClose: 5000,
      });
    } else if (status === 401) {
      toast.error(`401 Unauthorized: ${errorData?.title || "You are not authorized"}`, {
        autoClose: 5000,
      });
    } else if (status === 404) {
      toast.warning(`404 Not Found: ${errorData?.title || "The requested resource was not found"}`, {
        autoClose: 5000,
      });
    } else if (status === 500 || status === "PARSING_ERROR") {
      toast.error("Server Error: Something went wrong on our end. Please try again later.", {
        autoClose: 5000,
      });
    } else if (errorData?.errors) {
      const errorCount = Object.keys(errorData.errors).length;
      toast.error(`Validation failed: ${errorCount} error${errorCount > 1 ? 's' : ''} found`, {
        autoClose: 5000,
      });
    }
  }

  return result;
};
