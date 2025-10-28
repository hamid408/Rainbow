"use client";
import React, { useState, useMemo, useEffect } from "react";
import AiReachList from "./AiReachList";
import { Box, Typography, CircularProgress } from "@mui/material";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
import CustomTabs from "@/src/components/common/CustomTabs";
import { useGetLeadsReachOutLeadsQuery } from "@/src/redux/services/campagin/campaignApi";
import CustomTextField from "@/src/components/common/CustomTextfield";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useGetLeadsEnumsQuery } from "@/src/redux/services/leads/leadsApi";

const NewAiOutreach = () => {
  const filterItems = [
    { label: "1 Month" },
    { label: "2 Month" },
    { label: "Year" },
  ];
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");

  const [activeTab, setActiveTab] = useState("All");
  const searchQuery = useDebounce(search, 400);
  const { data: enumsData, isLoading: isCampaignsLoading } =
    useGetLeadsEnumsQuery();
  const { data, isLoading, isError, refetch } = useGetLeadsReachOutLeadsQuery({
    page: 1,
    page_size: 20,
    name: searchQuery,
    campaign_name: selectedCampaign || "",
  });
  const campaigns = enumsData?.campaigns || [];

  useEffect(() => {
    refetch();
  }, [activeTab, selectedCampaign, searchQuery, refetch]);

  const uniqueLeads = useMemo(() => {
    const seen = new Set();
    return (data?.data || []).filter((lead: any) => {
      if (!lead.lead_id || seen.has(lead.lead_id)) return false;
      seen.add(lead.lead_id);
      return true;
    });
  }, [data]);

  const engagedLeads = useMemo(
    () => uniqueLeads.filter((lead: any) => lead.engaging === true),
    [uniqueLeads]
  );

  const awaitingLeads = useMemo(
    () => uniqueLeads.filter((lead: any) => lead.engaging === false),
    [uniqueLeads]
  );

  const allLeads = useMemo(() => uniqueLeads, [uniqueLeads]);

  const currentList =
    activeTab === "Engaged"
      ? engagedLeads
      : activeTab === "Awaiting Reply"
      ? awaitingLeads
      : allLeads;

  console.log({
    campaigns,
  });
  const campaignOptions =
    Array.isArray(campaigns) && campaigns.length > 0
      ? campaigns.map((c: string) => ({
          label: c,
          value: c,
        }))
      : [];

  return (
    <Box padding={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontSize={23} fontWeight={500}>
          AI Outreach
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <CustomFilterSelect
            title="Campaigns"
            options={campaignOptions}
            loading={isCampaignsLoading}
            onSelect={(option) =>
              setSelectedCampaign(String(option?.value || ""))
            }
          />
        </Box>
      </Box>
      <Box mt={3}>
        <CustomTabs
          tabs={[
            { label: "All", count: allLeads.length },
            { label: "Engaged", count: engagedLeads.length },
            { label: "Awaiting Reply", count: awaitingLeads.length },
          ]}
          onTabChange={(tabLabel) => setActiveTab(tabLabel)}
        />
      </Box>

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
          <AiReachList
            list={currentList}
            searchQuery={search}
            setSearchQuery={setSearch}
          />
        )}
      </Box>
    </Box>
  );
};

export default NewAiOutreach;
