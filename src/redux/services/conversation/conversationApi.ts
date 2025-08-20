import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
export const conversationApi = createApi({
  reducerPath: "conversationsApi",
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
    getConversation: builder.query<any, { lead_ID: string; offset: number }>({
      query: ({ lead_ID, offset }) =>
        `conversations?lead_id=${lead_ID}&offset=${offset}`,
    }),
    getSuggestions: builder.query<any, { lead_id: string }>({
      query: ({ lead_id }) => `conversations/suggestion?lead_id=${lead_id}`,
    }),
    changeSuggestion: builder.mutation({
      query: (body) => ({
        url: "conversations/suggestion",
        method: "PATCH",
        body: body,
      }),
    }),
    sendSms: builder.mutation({
      query: (body) => ({
        url: "sms/outbound",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetSuggestionsQuery,
  useLazyGetSuggestionsQuery,
  useSendSmsMutation,
  useChangeSuggestionMutation,
} = conversationApi;
