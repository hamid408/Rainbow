

"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTabs from "@/src/components/common/CustomTabs";
import AddLeadModal from "./AddLeadModal";
import {
  useLazyGetLeadsQuery,
  useLazyGetLeadsActionQuery,
  useGetLeadsEnumsQuery,
} from "@/src/redux/services/leads/leadsApi";
import { useDebounce } from "use-debounce";
import { usePathname } from "next/navigation";
import styles from "./style.module.scss";
import Cookies from "js-cookie";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
import CustomButton from "@/src/components/common/CustomButton";
import AllLeadsList from "./New-Features/AllLeadsList";
import ActionNeededList from "./New-Features/ActionNeededList";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState<"All Leads" | "Action Needed">(
    "Action Needed"
  );
  const [openModal, setOpenModal] = useState(false);

  // Filters per tab
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedActionTags, setSelectedActionTags] = useState<string[]>([]);
  const [selectedActionStages, setSelectedActionStages] = useState<string[]>(
    []
  );
  const [selectedCampaigns, setSelectedCampaigns] = useState<{
    [key: string]: string;
  }>({
    "All Leads": "",
    "Action Needed": "",
  });

  // Sort & search
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [sortActionOrder, setSortActionOrder] = useState<"ASC" | "DESC">(
    "DESC"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 800);

  // Data states
  const [allLeadsList, setAllLeadsList] = useState<any[]>([]);
  const [actionLeadsList, setActionLeadsList] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [actionCursor, setActionCursor] = useState<string | null>(null);
  const [hasMoreAll, setHasMoreAll] = useState<boolean>(false);
  const [hasMoreAction, setHasMoreAction] = useState<boolean>(false);

  const pathname = usePathname();
  const ITEMS_PER_PAGE = 10;
  const selectedCampaign = selectedCampaigns[selectedTab] || "";

  // ---- API Hooks (Lazy Queries) ----
  const [
    triggerGetLeads,
    { isLoading: isAllLoading, isFetching: isAllFetching },
  ] = useLazyGetLeadsQuery();
  const [
    triggerGetLeadsAction,
    { isLoading: isActionLoading, isFetching: isActionFetching },
  ] = useLazyGetLeadsActionQuery();

  const { data: enumsData, isLoading: isCampaignsLoading } =
    useGetLeadsEnumsQuery();
  const campaigns = enumsData?.campaigns || [];

  // ---- Unauthorized Handling ----
  useEffect(() => {
    const token = Cookies.get("id_token");
    if (!token && typeof window !== "undefined") {
      window.location.replace("/auth/sign-in");
    }
  }, []);

  // ---- Fetch All Leads ----
  const fetchAllLeads = async (isLoadMore = false) => {
    const result = await triggerGetLeads({
      tag: selectedTags.length ? selectedTags.join(",") : undefined,
      limit: ITEMS_PER_PAGE,
      cursor: isLoadMore ? cursor : null,
      name: debouncedSearch?.trim() || undefined,
      created_at: sortOrder,
      stage: selectedStages.length ? selectedStages.join(",") : undefined,
      campaign_name: selectedCampaign || undefined,
    }).unwrap();

    if (result?.data) {
      setAllLeadsList((prev) =>
        isLoadMore ? [...prev, ...result.data] : result.data
      );
      setCursor(result.next_cursor || null);
      setHasMoreAll(!!result.next_cursor);
    }
  };

  // ---- Fetch Action Needed Leads ----
  const fetchActionLeads = async (isLoadMore = false) => {
    const result = await triggerGetLeadsAction({
      tag: selectedActionTags.length ? selectedActionTags.join(",") : undefined,
      limit: ITEMS_PER_PAGE,
      cursor: isLoadMore ? actionCursor : null,
      name: debouncedSearch?.trim() || undefined,
      created_at: sortActionOrder,
      stage: selectedActionStages.length
        ? selectedActionStages.join(",")
        : undefined,
      campaign_name: selectedCampaign || undefined,
    }).unwrap();

    if (result?.data) {
      setActionLeadsList((prev) =>
        isLoadMore ? [...prev, ...result.data] : result.data
      );
      setActionCursor(result.next_cursor || null);
      setHasMoreAction(!!result.next_cursor);
    }
  };

  // ---- Fetch on initial mount or filter change ----
  useEffect(() => {
    if (selectedTab === "All Leads") {
      setCursor(null);
      fetchAllLeads(false);
    } else {
      setActionCursor(null);
      fetchActionLeads(false);
    }
  }, [
    selectedTab,
    selectedTags.join(","),
    selectedStages.join(","),
    selectedActionTags.join(","),
    selectedActionStages.join(","),
    selectedCampaign,
    debouncedSearch,
    sortOrder,
    sortActionOrder,
  ]);

  // Fetch both lists initially once on mount
  useEffect(() => {
    fetchAllLeads(false);
    fetchActionLeads(false);
  }, []);

  // ---- Handle Tab Change ----
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab as "All Leads" | "Action Needed");

    // Reset filters & search on tab switch
    if (tab === "All Leads") {
      setSelectedTags([]);
      setSelectedStages([]);
      setSearchQuery("");
    } else {
      setSelectedActionTags([]);
      setSelectedActionStages([]);
      setSearchQuery("");
    }
  };

  const campaignOptions =
    Array.isArray(campaigns) && campaigns.length > 0
      ? [
          { label: "No Select", value: "" },
          ...campaigns.map((c: string) => ({ label: c, value: c })),
        ]
      : [{ label: "No Select", value: "" }];

  if (pathname.match(/^\/dashboard\/[^\/]+$/)) return null;

  return (
    <Box>
      <Box padding={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontSize={23} fontWeight={500}>
            My Inbox
          </Typography>

          <CustomFilterSelect
            title="Campaigns"
            options={campaignOptions}
            loading={isCampaignsLoading}
            onSelect={(option) =>
              setSelectedCampaigns((prev) => ({
                ...prev,
                [selectedTab]: String(option?.value || ""),
              }))
            }
          />
        </Box>

        {/* Tabs */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <CustomTabs
            tabs={[
              { label: "Action Needed", count: actionLeadsList.length },
              { label: "All Leads", count: allLeadsList.length },
            ]}
            onTabChange={handleTabChange}
          />

          <Box className={styles.shortText}>
            <CustomButton
              variant="contained"
              onClick={() => setOpenModal(true)}
            >
              Add Lead
            </CustomButton>
          </Box>
        </Box>

        {/* Content */}
        <Box mt={3}>
          {/* All Leads Tab */}
          {selectedTab === "All Leads" && (
            <>
              <AllLeadsList
                leadsData={allLeadsList}
                isLoading={isAllLoading}
                isFetching={isAllFetching}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                selectedStages={selectedStages}
                setSelectedStages={setSelectedStages}
              />

              <Box textAlign="end" mt={2}>
                <CustomButton
                  onClick={() => fetchAllLeads(true)}
                  disabled={!hasMoreAll || isAllFetching}
                  variant="contained"
                >
                  {isAllFetching ? <CircularProgress size={20} /> : "Load More"}
                </CustomButton>
              </Box>
            </>
          )}

          {/* Action Needed Tab */}
          {selectedTab === "Action Needed" && (
            <>
              <ActionNeededList
                leadsData={actionLeadsList}
                isLoading={isActionLoading}
                isFetching={isActionFetching}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTags={selectedActionTags}
                setSelectedTags={setSelectedActionTags}
                sortOrder={sortActionOrder}
                setSortOrder={setSortActionOrder}
                selectedStages={selectedActionStages}
                setSelectedStages={setSelectedActionStages}
              />

              <Box textAlign="end" mt={2}>
                <CustomButton
                  onClick={() => fetchActionLeads(true)}
                  disabled={!hasMoreAction || isActionFetching}
                  variant="contained"
                >
                  {isActionFetching ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Load More"
                  )}
                </CustomButton>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Add Lead Modal */}
      <AddLeadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetchLeads={() =>
          selectedTab === "All Leads" ? fetchAllLeads() : fetchActionLeads()
        }
      />
    </Box>
  );
};

export default Dashboard;
