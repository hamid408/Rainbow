"use client";
import CustomTabs from "@/src/components/common/CustomTabs";
import { Box, Typography } from "@mui/material";
import React from "react";
import InboxDashboard from "./Inbox";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";

const NewDashboard = () => {
  const filterItems = [
    { label: "1 Month" },
    { label: "2 Month" },
    { label: "Year" },
  ];
  return (
    <>
      <Box padding={5}>
        <Box marginBottom={4.5} display="flex" justifyContent="space-between">
          <Typography variant="h4" fontSize={23} fontWeight={500}>
            My Inbox
          </Typography>
          <CustomFilterSelect
            items={filterItems}
            onSelect={(item: any) => console.log(item)}
          />
        </Box>
        <CustomTabs
          tabs={[
            { label: "Action Needed", count: 3 },
            { label: "Awaiting Reply From Lead", count: 0 },
            { label: "Completed" }, 
          ]}
          onTabChange={(tab) => console.log("Selected:", tab)}
        />
        <Box marginTop={3}>
          <InboxDashboard />
        </Box>
      </Box>
    </>
  );
};

export default NewDashboard;
