import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
export const usersApi = createApi({
  reducerPath: "usersApi",
  
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    getUsers: builder.query<any, void>({
      query: () => "users/list",
    }),

    createUser: builder.mutation<
      any,
      { first_name: string; email: string; role?: string; last_name?: string }
    >({
      query: (body) => ({
        url: "users/new",
        method: "POST",
        body: {
          ...body,
          role: body.role || "owner",
        },
      }),
    }),
    deactivateUser: builder.mutation<any, { email: string }>({
      query: ({ email }) => ({
        url: "users/deactivate",
        method: "PATCH",
        body: { email },
      }),
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => `users/me`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeactivateUserMutation,
  useGetCurrentUserQuery,
} = usersApi;
