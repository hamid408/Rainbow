import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
export const twilioApi = createApi({
  reducerPath: "twilioApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: "https://ajzjuk1jch.execute-api.us-east-2.amazonaws.com/dev/",
  //   prepareHeaders: (headers) => {
  //     // const token = sessionStorage.getItem("id_token");
  //     const token = Cookies.get("id_token");

  //     if (token) {
  //       headers.set("Authorization", `Bearer ${token}`);
  //     }
  //     headers.set("Content-Type", "application/json");
  //     return headers;
  //   },
  // }),
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    getTwilioToken: builder.query<any, void>({
      query: () => "calls/outbound/user/twilio/token",
    }),
    // createBotCall: builder.query<any, string>({
    //   query: (leadId) => `/calls/outbound/create_call?lead_id${leadId}`,
    // }),
    createBotCall: builder.mutation({
      query: (lead_id) => ({
        url: `calls/outbound/bot/create_call`,
        method: "POST",
        body: lead_id,
      }),
    }),
  }),
});

export const { useGetTwilioTokenQuery, useCreateBotCallMutation } = twilioApi;
