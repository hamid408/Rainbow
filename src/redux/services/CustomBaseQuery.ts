import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://ajzjuk1jch.execute-api.us-east-2.amazonaws.com/dev/",
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

  // if (result.error && result.error.status === 401) {
  //   Cookies.remove("id_token");
  //   if (typeof window !== "undefined") {
  //     if (window.location.pathname !== "/auth/sign-in") {
  //       window.location.replace("/auth/sign-in");
  //     }
  //   }
  // }
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

  return result;
};

export default customBaseQuery;
