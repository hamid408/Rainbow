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
const is_human_intervention_required = {
  intervention_required: false,
  action_status: "Resolved via CRM",
  action_item: "Marked as resolved in CRM",
};
export const leadsapi = createApi({
  reducerPath: "leadsApi",
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    getLeads: builder.query({
      query: ({ tag, limit = 5, offset = 0, name, created_at, stage }) => {
        let url = `leads?limit=${limit}&offset=${offset}`;
        if (name) url += `&name=${name}`;
        if (created_at) url += `&created_at=${created_at}`;
        if (stage) {
          const stageValue = Array.isArray(stage) ? stage.join(",") : tag;
          url += `&stage=${stage}`;
        }
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
      { lead_id: string; is_human_intervention_required: any }
    >({
      query: ({ lead_id, is_human_intervention_required }) => ({
        url: `leads`,
        method: "PATCH",
        body: { lead_id, is_human_intervention_required },
      }),
    }),
    deleteLead: builder.mutation<any, { lead_id: string }>({
      query: ({ lead_id }) => ({
        url: `leads`,
        method: "DELETE",
        body: { lead_id },
      }),
    }),

    getLeadsAction: builder.query({
      query: ({ tag, limit = 5, offset = 0, name, created_at, stage }) => {
        let url = `leads/action_needed?limit=${limit}&offset=${offset}`;
        if (name) url += `&name=${name}`;
        if (created_at) url += `&created_at=${created_at}`;
        if (stage) {
          const stageValue = Array.isArray(stage) ? stage.join(",") : tag;
          url += `&stage=${stage}`;
        }
        if (tag && tag !== "All") {
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
