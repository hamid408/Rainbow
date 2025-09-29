// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import type { BaseQueryFn } from "@reduxjs/toolkit/query";
// import Cookies from "js-cookie";

// const rawBaseQuery = fetchBaseQuery({
//   // baseUrl: "https://3qsk0avfk4.execute-api.us-west-2.amazonaws.com/dev",
//   baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
//   prepareHeaders: (headers) => {
//     const token = Cookies.get("id_token");
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     headers.set("Content-Type", "application/json");
//     return headers;
//   },
// });

// const customBaseQuery: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   const result = await rawBaseQuery(args, api, extraOptions);

//   // const errorType = result?.meta?.response?.headers.get("x-amzn-errortype");
//   // const message = (result.error?.data as any)?.message;

//   // //new code generated
//   // //
//   // const isUnauthorized =
//   //   result.error?.status === 401 ||
//   //   (errorType === "UnauthorizedException" || // AWS Gateway error header
//   //     message === "The incoming token has expired" || // Cognito expired token
//   //     (typeof message === "string" && !message.startsWith("Password"))); // General 401 with message not related to password

//   // // ✅ Handle unauthorized: remove token + redirect
//   // if (isUnauthorized) {
//   //   Cookies.remove("id_token");
//   //   if (typeof window !== "undefined") {
//   //     if (window.location.pathname !== "/auth/sign-in") {
//   //       window.location.replace("/auth/sign-in");
//   //     }
//   //   }
//   // }

//   // //
//   // const isTokenExpired =
//   //   result.error?.status === 401 &&
//   //   (errorType === "UnauthorizedException" ||
//   //     message === "The incoming token has expired");
//   // if (
//   //   result.error &&
//   //   result.error.status === 401 &&
//   //   typeof (result.error.data as any)?.message === "string" &&
//   //   !(result.error.data as any).message.startsWith("Password")
//   // ) {
//   //   Cookies.remove("id_token");
//   //   if (typeof window !== "undefined") {
//   //     if (window.location.pathname !== "/auth/sign-in") {
//   //       window.location.replace("/auth/sign-in");
//   //     }
//   //   }
//   // }

//   // if (
//   //   result.error?.status === 401 &&
//   //   (errorType === "UnauthorizedException" ||
//   //     message === "The incoming token has expired")
//   // ) {
//   //   Cookies.remove("id_token");
//   //   if (
//   //     typeof window !== "undefined" &&
//   //     window.location.pathname !== "/auth/sign-in"
//   //   ) {
//   //     window.location.replace("/auth/sign-in");
//   //   }
//   // }
//   // console.log("result error", result.error);
//   console.log("result error", result.error?.status);

//   if (result.error?.status === 401) {
//     console.log("result error final", result.error?.status);

//     Cookies.remove("id_token");
//     if (
//       typeof window !== "undefined" &&
//       window.location.pathname !== "/auth/sign-in"
//     ) {
//       // window.location.replace("/auth/sign-in");
//     }
//     const errorType = result?.meta?.response?.headers.get("x-amzn-errortype");
//     const message = (result.error?.data as any)?.message;

//     const isUnauthorized =
//       errorType === "UnauthorizedException" ||
//       message === "The incoming token has expired" ||
//       (typeof message === "string" && !message.startsWith("Password"));

//     if (isUnauthorized) {
//       Cookies.remove("id_token");
//       if (
//         typeof window !== "undefined" &&
//         window.location.pathname !== "/auth/sign-in"
//       ) {
//         // window.location.replace("/auth/sign-in");
//       }
//     }
//     //
//   }
//   return result;
// };

// export default customBaseQuery;

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  exp: number;
};

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get("id_token");
    if (token) {
      if (isTokenExpired(token)) {
        Cookies.remove("id_token");
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/auth/sign-in"
        ) {
          window.location.replace("/auth/sign-in");
        }
      } else {
        headers.set("Authorization", `Bearer ${token}`);
      }
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

  if (result.error?.status === 401) {
    const message = (result.error?.data as any)?.message;
    if (typeof message === "string" && message.startsWith("Password")) {
      return result;
    }
    const errorType = result?.meta?.response?.headers.get("x-amzn-errortype");
    const messageType = (result.error?.data as any)?.message;

    const isUnauthorized =
      errorType === "UnauthorizedException" ||
      messageType === "The incoming token has expired" ||
      (typeof message === "string" && !message.startsWith("Password"));

    if (isUnauthorized) {
      Cookies.remove("id_token");
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/auth/sign-in"
      ) {
        window.location.replace("/auth/sign-in");
      }
    }
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
