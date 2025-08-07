"use client";

import React, { useState } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import Campagins from "./Campaigns";
import OutreachAndSuggestionCard from "./OutreachAndSuggestionCard";
import { contactData } from "./data";
import ContactProgressCard from "./ContactProgressCard";
import styles from "./style.module.scss";
import { useGetCampaignQuery } from "@/src/redux/services/campagin/campaignApi";
import CustomPagination from "@/src/components/common/CustomPagination";

const AiReach = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading } = useGetCampaignQuery({
    page,
    page_size: pageSize,
  });

  const totalPages = Math.ceil(data?.pagination?.total / pageSize) || 1;
  if (isLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }
  console.log("Campaign Data:", data);
  return (
    <Box className={styles.indexRoot}>
      <Typography variant="h1" mb="16px" className={styles.mainHeading}>
        AI Outreach Queue
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        data?.data.map((contact: any, index: any) => (
          <Box key={index} className={styles.indexSecondary}>
            <ContactProgressCard
              contact={contact}
              completedSteps={contact.campaign.current_drips}
              totalSteps={contact.campaign.total_drips}
            />

            <Divider className={styles.divider} />

            <OutreachAndSuggestionCard
              status1={contact.outreach_status.last_action}
              status2={contact.outreach_status.next_action}
              suggestedMessage={`Hi ${contact.name}, just checking in.`}
            />
          </Box>
        ))
      )}
      <Box className={styles.paginationBox}>
        <CustomPagination
          page={page}
          count={totalPages}
          onChange={(val) => setPage(val)}
        />
      </Box>
    </Box>
  );
};

export default AiReach;
// No use of plastic
// No stress
// No steroids
// No motapa
// Refined oil
// use honey
// klonji powder half spoon
// ashwagnda powder
// silajit
