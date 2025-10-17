import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import customBaseQuery from "../CustomBaseQuery";
type LeadType = {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  inquiry_type?: string;
  inquiry_status?: string;
  tag?: string;
  notes?: string;
  time_zone?: string;
  is_mobile?: boolean;
  preferred_calling_window?: number[];
};
export const leadsapi = createApi({
  reducerPath: "leadsApi",
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    // getLeads: builder.query<
    //   {
    //     data: any[];
    //     limit: number;
    //     next_page: number | null;
    //     prev_page: number | null;
    //     returned_records: number;
    //     total_records: number;
    //   },
    //   { tag?: string; limit?: number; offset?: number; name?: string }
    // >({
    //   query: ({ tag, limit = 5, offset = 0, name }) => {
    //     const params = new URLSearchParams();
    //     if (tag && tag !== "All") params.append("tag", tag);
    //     if (name) params.append("name", name);
    //     params.append("limit", limit.toString());
    //     params.append("offset", offset.toString());
    //     return `leads?${params.toString()}`;
    //   },
    // }),

    getLeads: builder.query({
      query: ({ tag, limit = 5, offset = 0, name, created_at }) => {
        let url = `leads?limit=${limit}&offset=${offset}`;
        if (name) url += `&name=${name}`;
        if (created_at) url += `&created_at=${created_at}`;

        if (tag && tag !== "All") {
          const tagValue = Array.isArray(tag) ? tag.join(",") : tag;
          url += `&tag=${tagValue}`;
        }
        return { url, method: "GET" };
      },
    }),

    createLead: builder.mutation<any, LeadType[]>({
      query: (body) => ({
        url: "leads/new",
        method: "POST",
        body,
      }),
    }),
    getLeadById: builder.query<any, string>({
      query: (leadId) => `leads?lead_id=${leadId}`,
    }),
    updateLead: builder.mutation({
      query: (data) => ({
        url: `/leads`,
        method: "PATCH",
        body: data,
      }),
    }),
    getLeadsEnums: builder.query<any, void>({
      query: () => `leads/enums`,
    }),
    resolvedLead: builder.mutation<
      any,
      { lead_id: string; is_active: boolean }
    >({
      query: ({ lead_id, is_active }) => ({
        url: `leads`,
        method: "PATCH",
        body: { lead_id, is_active },
      }),
    }),
    deleteLead: builder.mutation<any, { lead_id: string }>({
      query: ({ lead_id }) => ({
        url: `leads`,
        method: "DELETE",
        body: { lead_id },
      }),
    }),
    // getLeadsAction: builder.query<
    //   {
    //     data: any[];
    //     limit: number;
    //     next_page: number | null;
    //     prev_page: number | null;
    //     returned_records: number;
    //     total_records: number;
    //   },
    //   { tag?: string; limit?: number; offset?: number; name?: string }
    // >({
    //   query: ({ tag, limit = 5, offset = 0, name }) => {
    //     const params = new URLSearchParams();
    //     if (tag && tag !== "All") params.append("tag", tag);
    //     if (name) params.append("name", name);
    //     params.append("limit", limit.toString());
    //     params.append("offset", offset.toString());
    //     return `leads/action_needed?${params.toString()}`;
    //   },
    // }),
    getLeadsAction: builder.query({
      query: ({ tag, limit = 5, offset = 0, name,created_at }) => {
        let url = `leads/action_needed?limit=${limit}&offset=${offset}`;
        if (name) url += `&name=${name}`;
        if (created_at) url += `&created_at=${created_at}`;

        if (tag && tag !== "All") {
          // ✅ FIX HERE: convert to comma-separated values, not JSON
          const tagValue = Array.isArray(tag) ? tag.join(",") : tag;
          url += `&tag=${tagValue}`;
        }
        return { url, method: "GET" };
      },
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useCreateLeadMutation,
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
  useGetLeadsEnumsQuery,
  useResolvedLeadMutation,
  useDeleteLeadMutation,
  useGetLeadsActionQuery,
} = leadsapi;
