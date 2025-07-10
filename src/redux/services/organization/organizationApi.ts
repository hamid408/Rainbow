import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
export const organizationApi = createApi({
  reducerPath: "organizationApi",

  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    getOrganzation: builder.query<any, { organization_id?: string }>({
      query: ({ organization_id }) =>
        `/organizations/config?organization_id=${organization_id}`,
    }),
    updateOrganization: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: `organizations/config`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useGetOrganzationQuery, useUpdateOrganizationMutation } =
  organizationApi;
