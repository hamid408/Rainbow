import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
export const campaignApi = createApi({
  reducerPath: "campaginApi",
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    getCampaign: builder.query<
      any,
      { page: number; page_size: number; name: string }
    >({
      query: ({ page, page_size, name }) =>
        `/campaign/outreach?page=${page}&page_size=${page_size}&name=${name}`,
    }),

    changeCampaignStatus: builder.mutation({
      query: (body) => ({
        url: "/campaign/status/update",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    // getLeadsReachOutLeads: builder.query<
    //   any,
    //   {
    //     page?: number;
    //     page_size?: number;
    //     name?: string;
    //     campaign_name?: string;
    //   }
    // >({
    //   query: ({ page, page_size, name = "", campaign_name }) =>
    //     `/campaign/outreach?page=${page}&page_size=${page_size}&name=${name}&campaign_name=${campaign_name}`,
    // }),
    getLeadsReachOutLeads: builder.query<
      any,
      {
        page?: number;
        page_size?: number;
        name?: string;
        campaign_name?: string;
      }
    >({
      query: ({ page = 1, page_size = 20, name = "", campaign_name = "" }) => ({
        url: `/campaign/outreach`,
        params: {
          page,
          page_size,
          name,
          campaign_name,
        },
      }),
    }),
  }),
});

export const {
  useGetCampaignQuery,
  useChangeCampaignStatusMutation,
  useGetLeadsReachOutLeadsQuery,
} = campaignApi;
