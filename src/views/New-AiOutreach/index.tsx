"use client";
import React, { useState } from "react";
import AiReachList from "./AiReachList";
import { Box, Typography, CircularProgress } from "@mui/material";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
import CustomTabs from "@/src/components/common/CustomTabs";
import { useGetLeadsReachOutLeadsQuery } from "@/src/redux/services/campagin/campaignApi";

const NewAiOutreach = () => {
  const filterItems = [
    { label: "1 Month" },
    { label: "2 Month" },
    { label: "Year" },
  ];

  const [activeTab, setActiveTab] = useState("Engaged");

  // 🔹 Fetch data once here
  const { data, isLoading, isError } = useGetLeadsReachOutLeadsQuery({
    page: 1,
    page_size: 20,
    name: "",
  });

  const leads = data?.data || [];

  // 🔹 Filter by engagement status
  const engagedLeads = leads.filter((lead: any) => lead.engaging === true);
  const awaitingLeads = leads.filter((lead: any) => lead.engaging === false);

  const currentList = activeTab === "Engaged" ? engagedLeads : awaitingLeads;

  return (
    <Box padding={3}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" fontSize={23} fontWeight={500}>
          AI Inbox
        </Typography>
        <CustomFilterSelect
          items={filterItems}
          onSelect={(item: any) => console.log(item)}
        />
      </Box>

      <CustomTabs
        tabs={[
          { label: "Engaged", count: engagedLeads.length },
          { label: "Awaiting Reply", count: awaitingLeads.length },
        ]}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      <Box mt={3}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress size={30} />
          </Box>
        ) : isError ? (
          <Typography color="error" textAlign="center" py={5}>
            Failed to load AI outreach leads.
          </Typography>
        ) : (
          <AiReachList list={currentList} />
        )}
      </Box>
    </Box>
  );
};

export default NewAiOutreach;
