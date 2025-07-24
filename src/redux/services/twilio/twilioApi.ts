import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
export const twilioApi = createApi({
  reducerPath: "twilioApi",

  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    getTwilioToken: builder.query<any, void>({
      query: () => "calls/outbound/user/twilio/token",
    }),
    createBotCall: builder.mutation({
      query: (lead_id) => ({
        url: `calls/outbound/bot/create_call`,
        method: "POST",
        body: lead_id,
      }),
    }),
    getCallLogs: builder.query<any, { provider_event_id: any }>({
      query: ({ provider_event_id }) =>
        `/calls/logs?provider_event_id=${provider_event_id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetTwilioTokenQuery,
  useCreateBotCallMutation,
  useGetCallLogsQuery,
} = twilioApi;
