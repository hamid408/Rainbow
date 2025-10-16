"use client";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CustomTabs from "@/src/components/common/CustomTabs";
import AddLeadModal from "./AddLeadModal";
import {
  useGetLeadsActionQuery,
  useGetLeadsQuery,
} from "@/src/redux/services/leads/leadsApi";
import { useDebounce } from "use-debounce";
import CustomPagination from "@/src/components/common/CustomPagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./style.module.scss";
import Cookies from "js-cookie";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
import AwaitingReplyList from "./New-Features/AwaitingReplyList";
import CommunicationList from "./New-Features/CommunicationList";
import CustomButton from "@/src/components/common/CustomButton";

const Dashboard = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const router = useRouter();
  const ITEMS_PER_PAGE = 5;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const isAll = activeTab === "All";
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("Action Needed");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 1000);

  const { data, isLoading, isFetching, refetch, isError, error } =
    useGetLeadsQuery(
      {
        tag: isAll ? undefined : activeTab,
        limit: ITEMS_PER_PAGE,
        offset,
        name: debouncedSearch?.trim() || undefined,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );
  const {
    data: actionData,
    isLoading: isActionLoading,
    isFetching: isActionFetching,
    refetch: ActionRefetch,
    isError: isActionError,
    error: actionError,
  } = useGetLeadsActionQuery(
    {
      tag: isAll ? undefined : activeTab,
      limit: ITEMS_PER_PAGE,
      offset,
      name: debouncedSearch?.trim() || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const pathname = usePathname();

  useEffect(() => {
    if (
      isError &&
      error &&
      "status" in error &&
      error.status === 401 &&
      typeof window !== "undefined"
    ) {
      Cookies.remove("id_token");
      if (window.location.pathname !== "/auth/sign-in") {
        window.location.replace("/auth/sign-in");
      }
    }
  }, [isError, error]);

  useEffect(() => {
    refetch();
    ActionRefetch();
  }, []);

  const leads = data?.data || [];
  const actionLeads = Array.isArray(actionData)
    ? actionData
    : actionData?.data || [];
  const totalCount = data?.total_records || 0;

  useEffect(() => {
    if (isAll && leads.length > 0) {
      const tagSet = new Set(leads.map((lead: any) => lead.tag || "unTagged"));
      setAllTags(["All", ...Array.from(tagSet)]);
    }
  }, [leads, isAll]);

  const tags = useMemo(() => {
    const tagSet = new Set(leads.map((lead: any) => lead.tag || null));
    return ["All", ...Array.from(tagSet)];
  }, [leads]);

  const tabsData = allTags.map((tag) => ({ label: String(tag) }));

  const handleTabChange = (label: string) => {
    setActiveTab(label);
    setPage(1);
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  };
  if (pathname.match(/^\/dashboard\/[^\/]+$/)) {
    return null;
  }
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
    <Box>
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
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mt={2}
          >
            <CustomTabs
              tabs={[
                { label: "Action Needed", count: actionLeads.length },
                { label: "All Leads", count: filteredData.length },
              ]}
              onTabChange={(tab) => setSelectedTab(tab)}
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

          <Box marginTop={3}>
            {selectedTab === "Action Needed" && (
              <CommunicationList
                leadsData={actionLeads}
                isLoading={isActionLoading}
                isFetching={isActionFetching}
                isError={isActionError}
              />
            )}
            {selectedTab === "All Leads" && (
              <AwaitingReplyList
                leadsData={leads}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </Box>
        </Box>
      </>
      <Box className={styles.paginationBox}>
        <CustomPagination
          page={page}
          count={Math.ceil(totalCount / ITEMS_PER_PAGE)}
          onChange={(val) => {
            setPage(val);
            const searchParams = new URLSearchParams(window.location.search);

            if (val === 1) {
              searchParams.delete("page");
            } else {
              searchParams.set("page", String(val));
            }
            router.push(`?${searchParams.toString()}`);
          }}
        />
      </Box>

      <AddLeadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetchLeads={refetch}
      />
    </Box>
  );
};

export default Dashboard;
