import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
export const campaignApi = createApi({
  reducerPath: "campaginApi",
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    getCampaign: builder.query<any, { page: number; page_size: number }>({
      query: ({ page, page_size }) =>
        `/campaign/outreach?page=${page}&page_size=${page_size}`,
    }),
  }),
});

export const { useGetCampaignQuery } = campaignApi;
