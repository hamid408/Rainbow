"use client";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import LeadCard from "./LeadCard";
import CustomTabs from "@/src/components/common/CustomTabs";
import Header from "@/src/views/Dashboard/Header";
import CustomButton from "@/src/components/common/CustomButton";
import AddLeadModal from "./AddLeadModal";
import { useGetLeadsQuery } from "@/src/redux/services/leads/leadsApi";
import { useDebounce } from "use-debounce";
import CustomPagination from "@/src/components/common/CustomPagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./style.module.scss";
import Cookies from "js-cookie";

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
      // new added options to refetch on mount or arg change
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
  }, []);

  const leads = data?.data || [];
  const totalCount = data?.total_records || 0;

  useEffect(() => {
    if (isAll && leads.length > 0) {
      const tagSet = new Set(leads.map((lead: any) => lead.tag || "Untagged"));
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
  return (
    <Box padding="48px">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        refetch={refetch}
      />
      {/* check drag n drop functionality */}
      {/* <DragDropBoard /> */}
      {/* <Box sx={{ margin: "89px" }}>
        <iframe
          src="/Content.html"
          id="embedded-html"
          width="140%"
          height="600px"
          title="Embedded HTML Content"
        ></iframe>
      </Box> */}

      <Box
        borderRadius="12px"
        padding={1}
        bgcolor="#fff"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        mt={4}
        className={styles.cardback}
      >
        <Box
          mb={2.5}
          display="flex"
          justifyContent="space-between"
          className={styles.spaceBottom}
        >
          <CustomTabs tabs={tabsData} onTabChange={handleTabChange} />
          <Box
            display="flex"
            justifyContent="flex-end"
            height="48px"
            width={"100%"}
            className={styles.leftSpace}
          >
            <Box className={styles.fullText}>
              <CustomButton
                variant="contained"
                onClick={() => setOpenModal(true)}
              >
                Add Lead
              </CustomButton>
            </Box>
          </Box>
        </Box>

        <Stack gap={1}>
          {loading || isLoading || isFetching ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
            >
              <CircularProgress size={50} />
            </Box>
          ) : leads.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
            >
              <Typography variant="body1" color="textSecondary">
                No data found
              </Typography>
            </Box>
          ) : (
            leads.map((lead: any, index: number) => {
              const truncate = (text: string = "", limit: number) =>
                text.length > limit ? text.slice(0, limit) + "..." : text;

              return (
                <LeadCard
                  key={index}
                  lead_id={lead.lead_id}
                  name={`${lead.first_name} ${lead.last_name || ""}`}
                  initials={`${lead.first_name?.[0] || ""}${
                    lead.last_name?.[0] || ""
                  }`}
                  isGoingCold={
                    lead.inquiry_status?.toLowerCase() === "going cold"
                  }
                  serviceType={truncate(lead.inquiry_status || "—", 15)}
                  serviceName={lead.inquiry_type || ""}
                  message={truncate(lead.content || "No message available", 50)}
                  avatarUrl={undefined}
                  tag={lead.tag || "Urgent"}
                  page={page}
                  phone={lead.phone || ""}
                />
              );
            })
          )}
        </Stack>
      </Box>

      {/* <CustomPagination
        page={page}
        count={Math.ceil(totalCount / ITEMS_PER_PAGE)}
        onChange={(val) => setPage(val)}
      /> */}

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
