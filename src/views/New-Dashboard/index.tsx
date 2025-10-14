"use client";
import CustomTabs from "@/src/components/common/CustomTabs";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import InboxDashboard from "./Inbox";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
import AwaitingReplyList from "./AwaitingReplyList";
import { useGetLeadsQuery } from "@/src/redux/services/leads/leadsApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
const ITEMS_PER_PAGE = 10;

const NewDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Action Needed");
  const [search, setSearch] = useState("");
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [isAll, setIsAll] = useState(true);


  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetLeadsQuery(
      {
        tag: isAll ? undefined : activeTab,
        limit: ITEMS_PER_PAGE,
        offset,
        name: search.trim() || undefined,
      },
      { refetchOnMountOrArgChange: true }
    );

  const leads = data?.data || [];

  const filterItems = [
    { label: "1 Month" },
    { label: "2 Month" },
    { label: "Year" },
  ];
  const filteredData =
    selectedTags.length === 0
      ? leads
      : leads.filter((lead: any) =>
          selectedTags.every((tag) => lead.tags?.includes(tag))
        );
  return (
    <>
      <Box padding={3}>
        <Box display="flex" justifyContent="space-between">
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
            { label: "Awaiting Reply From Lead", count: filteredData.length },
            { label: "Action Needed", count: 4 },
          ]}
          onTabChange={(tab) => setSelectedTab(tab)}
        />

        <Box marginTop={3}>
          {selectedTab === "Action Needed" && <InboxDashboard />}
          {selectedTab === "Awaiting Reply From Lead" && (
            <AwaitingReplyList leadsData={leads} isLoading isFetching isError />
          )}
        </Box>
      </Box>
    </>
  );
};

export default NewDashboard;
