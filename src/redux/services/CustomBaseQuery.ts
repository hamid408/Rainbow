import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://3qsk0avfk4.execute-api.us-west-2.amazonaws.com/dev",
  prepareHeaders: (headers) => {
    const token = Cookies.get("id_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const errorType = result?.meta?.response?.headers.get("x-amzn-errortype");
  const message = (result.error?.data as any)?.message;

  const isTokenExpired =
    result.error?.status === 401 &&
    (errorType === "UnauthorizedException" ||
      message === "The incoming token has expired");
  if (
    result.error &&
    result.error.status === 401 &&
    typeof (result.error.data as any)?.message === "string" &&
    !(result.error.data as any).message.startsWith("Password")
  ) {
    Cookies.remove("id_token");
    if (typeof window !== "undefined") {
      if (window.location.pathname !== "/auth/sign-in") {
        window.location.replace("/auth/sign-in");
      }
    }
  }

  //new logic for expired token

  if (
    result.error?.status === 401 &&
    (errorType === "UnauthorizedException" ||
      message === "The incoming token has expired")
  ) {
    Cookies.remove("id_token");
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/auth/sign-in"
    ) {
      window.location.replace("/auth/sign-in");
    }
  }
  return result;
};

export default customBaseQuery;
