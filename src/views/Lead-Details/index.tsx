"use client";
import { Box, CircularProgress, Drawer } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import LeadHeader from "./LeadHeader";
import LeadChatSection from "./LeadChat";
import CallLogsSection from "./LeadCallLog";
import LeadDetailsSidebar from "./LeadDetailSidebar";
import ChatInputBox from "./ChatInputBox";
import { useGetLeadByIdQuery } from "@/src/redux/services/leads/leadsApi";
import styles from "./style.module.scss";
import { useGetSuggestionsQuery } from "@/src/redux/services/conversation/conversationApi";
import BotEmbed from "./BotEmbed";

const LeadDetails = ({
  leadId,
  hideBackButton = false,
}: {
  leadId: string;
  hideBackButton?: boolean;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
        onEditClick={() => setIsDrawerOpen(true)}
        hideBackButton={hideBackButton}
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
        <Box
          sx={{
            backgroundColor: "red",
            position: "absolute",
            right: 0,
            bottom: 0,
          }}
        >
          <BotEmbed />
        </Box>

        {/*<LeadDetailsSidebar lead={lead} setLead={setLead} />*/}

        {/* Desktop Sidebar */}
        <Box
          sx={{
            // display: { xs: "none", md: "block" },
            "@media(max-width: 1000px)": {
              display: "none",
            },
          }}
        >
          <LeadDetailsSidebar lead={lead} setLead={setLead} />
        </Box>

        {/* Mobile Drawer Sidebar */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          // className={styles.drawerSlider}
          PaperProps={{
            sx: {
              width: "100%",
              maxWidth: 400,
              padding: 2,

              "@media(max-width: 600px)": {
                maxWidth: "300px",
              },

              "@media(max-width: 500px)": {
                maxWidth: "250px",
              },

              "@media(max-width: 400px)": {
                maxWidth: "200px",
              },

              "@media(max-width: 300px)": {
                maxWidth: "150px",
              },
            },
          }}
        >
          <LeadDetailsSidebar lead={lead} setLead={setLead} />
        </Drawer>
      </Box>
    </Box>
  );
};

export default LeadDetails;
