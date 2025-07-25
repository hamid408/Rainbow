"use client";
import { Box, CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import LeadHeader from "./LeadHeader";
import LeadChatSection from "./LeadChat";
import CallLogsSection from "./LeadCallLog";
import LeadDetailsSidebar from "./LeadDetailSidebar";
import ChatInputBox from "./ChatInputBox";
import { useGetLeadByIdQuery } from "@/src/redux/services/leads/leadsApi";
import styles from "./style.module.scss";
import { useGetSuggestionsQuery } from "@/src/redux/services/conversation/conversationApi";

const LeadDetails = ({ leadId }: { leadId: string }) => {
  const [refreshChat, setRefreshChat] = useState(0);
  const { data, isLoading, error, isFetching, refetch } =
    useGetLeadByIdQuery(leadId);
  const [lead, setLead] = useState<any>(null);
  const { data: suggestionData, refetch: refetchSuggestion } =
    useGetSuggestionsQuery({ lead_id: leadId });
  useEffect(() => {
    if (data?.data?.[0]) {
      setLead(data.data[0]);
    }
  }, [data]);

  // useEffect(() => {
  //   refetch();
  // }, [leadId, refreshChat, refetch]);

  const handleRefreshClick = useCallback(() => {
    setRefreshChat((prev) => prev + 1);
  }, []);

  const isLoadingState =
    isLoading || isFetching || !data || !data.data?.length || !lead;

  if (isLoadingState) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const name = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();
  const status = `${lead.tag || ""}${
    lead.inquiry_type ? ` (${lead.inquiry_type})` : ""
  }`;

  return (
    <Box className={styles.indexMainBox}>
      <LeadHeader
        name={name}
        status={status}
        // onRefreshClick={() => setRefreshChat((prev) => prev + 1)}
        onRefreshClick={handleRefreshClick}
      />
      <Box className={styles.indexSecondaryBox}>
        <Box className={styles.indexLastBox}>
          <LeadChatSection
            refreshTrigger={refreshChat}
            leadId={leadId}
            userName={name}
          />
          <CallLogsSection
            lead_id={leadId}
            refreshTrigger={refreshChat}
            onRefreshClick={() => setRefreshChat((prev) => prev + 1)}
            refetchSuggestion={refetchSuggestion}
          />
          <ChatInputBox
            data={data}
            refreshTrigger={refreshChat}
            onRefreshClick={() => setRefreshChat((prev) => prev + 1)}
            refetchSuggestion={refetchSuggestion}
          />
        </Box>
        <LeadDetailsSidebar lead={lead} setLead={setLead} />
      </Box>
    </Box>
  );
};

export default LeadDetails;
