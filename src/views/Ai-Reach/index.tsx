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
import CustomSearchField from "@/src/components/common/CustomSearch";
import { Search } from "@mui/icons-material";
import { useDebounce } from "@/src/hooks/useDebounce";

const AiReach = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 1000);

  const { data, isLoading, refetch } = useGetCampaignQuery({
    page,
    page_size: pageSize,
    name: debouncedSearch,
  });

  const totalPages = Math.ceil(data?.pagination?.total / pageSize) || 1;
  if (isLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }
  console.log("Campaign Data:", data?.data);
  return (
    <Box className={styles.indexRoot}>
      {/* <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h1" mb="16px" className={styles.mainHeading}>
          AI Outreach Queue
        </Typography>
        <Box className={styles.searchBox} mt={2}>
          <CustomSearchField
            endIcon={<Search />}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Box>
      </Box> */}

      {isLoading ? (
        <CircularProgress />
      ) : data?.data?.length === 0 ? (
        <Box className={styles.noDataBox}>
          <Typography variant="body1" color="textSecondary">
            No data found
          </Typography>
        </Box>
      ) : (
        data?.data.map(
          (contact: any, index: any) =>
            // contact.campaign.status !== "STOP" && (
              <Box key={index} className={styles.indexSecondary}>
                <ContactProgressCard
                  contact={contact}
                  completedSteps={contact.campaign.current_drips}
                  totalSteps={contact.campaign.total_drips}
                  campaginStatus={contact.campaign.status}
                  leadId={contact.lead_id}
                  campaignId={contact.campaign?.id}
                  refetchCampaigns={refetch}
                />

                <Divider className={styles.divider} />

                <OutreachAndSuggestionCard
                  status1={contact.outreach_status.last_action}
                  status2={contact.outreach_status.next_action}
                  suggestedMessage={`${contact?.outreach_status?.next_action?.content}`}
                />
              </Box>
            )
        // )
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
