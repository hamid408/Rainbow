"use client";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
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

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState<"All Leads" | "Action Needed">(
    "Action Needed"
  );
  const [openModal, setOpenModal] = useState(false);
  const [isAnyChecked, setIsAnyChecked] = useState(false);
  const [addCampaign, setAddCampaign] = useState(false);
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

  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [sortActionOrder, setSortActionOrder] = useState<"ASC" | "DESC">(
    "DESC"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 800);

  const [allPages, setAllPages] = useState<Record<number, any[]>>({});
  const [allCursors, setAllCursors] = useState<Record<number, string | null>>(
    {}
  );
  const [allPage, setAllPage] = useState(1);

  const [actionPages, setActionPages] = useState<Record<number, any[]>>({});
  const [actionCursors, setActionCursors] = useState<
    Record<number, string | null>
  >({});
  const [actionPage, setActionPage] = useState(1);

  const [currentAllLeads, setCurrentAllLeads] = useState<any[]>([]);
  const [currentActionLeads, setCurrentActionLeads] = useState<any[]>([]);

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

  const selectedCampaign = selectedCampaigns[selectedTab] || "";

  useEffect(() => {
    const token = Cookies.get("id_token");
    if (!token && typeof window !== "undefined") {
      window.location.replace("/auth/sign-in");
    }
  }, []);

  // const fetchAllLeads = async (page: number, cursor: string | null = null) => {
  //   const result = await triggerGetLeads({
  //     tag: selectedTags.length ? selectedTags.join(",") : undefined,
  //     limit: ITEMS_PER_PAGE,
  //     cursor,
  //     name: debouncedSearch?.trim() || undefined,
  //     created_at: sortOrder,
  //     stage: selectedStages.length ? selectedStages.join(",") : undefined,
  //     campaign_name: selectedCampaign || undefined,
  //   }).unwrap();

  //   const leads = result?.data ?? [];
  //   const nextCursor = result?.next_cursor ?? null;

  //   setAllPages((prev) => ({ ...prev, [page]: leads }));
  //   setAllCursors((prev) => ({ ...prev, [page]: nextCursor }));
  //   setAllPage(page);
  //   setCurrentAllLeads(leads);
  // };
  const fetchAllLeads = async (page: number, cursor: string | null = null) => {
    const result = await triggerGetLeads({
      tag: selectedTags.length ? selectedTags.join(",") : undefined,
      limit: ITEMS_PER_PAGE,
      cursor,
      name: debouncedSearch?.trim() || undefined,
      created_at: sortOrder,
      stage: selectedStages.length ? selectedStages.join(",") : undefined,
      campaign_name: selectedCampaign || undefined,
    }).unwrap();

    const leads = result?.data ?? [];
    const nextCursor = result?.next_cursor ?? null;

    setAllPages((prev) => ({ ...prev, [page]: leads }));
    setAllCursors((prev) => ({ ...prev, [page]: nextCursor }));
    setAllPage(page);
    setCurrentAllLeads(leads);

    return result;
  };

  const fetchActionLeads = async (
    page: number,
    cursor: string | null = null
  ) => {
    const result = await triggerGetLeadsAction({
      tag: selectedActionTags.length ? selectedActionTags.join(",") : undefined,
      limit: ITEMS_PER_PAGE,
      cursor,
      name: debouncedSearch?.trim() || undefined,
      created_at: sortActionOrder,
      stage: selectedActionStages.length
        ? selectedActionStages.join(",")
        : undefined,
      campaign_name: selectedCampaign || undefined,
    }).unwrap();

    const leads = result?.data ?? [];
    const nextCursor = result?.next_cursor ?? null;

    setActionPages((prev) => ({ ...prev, [page]: leads }));
    setActionCursors((prev) => ({ ...prev, [page]: nextCursor }));
    setActionPage(page);
    setCurrentActionLeads(leads);

    return result;
  };

  useEffect(() => {
    fetchAllLeads(1, null);
    fetchActionLeads(1, null);
  }, []);

  useEffect(() => {
    if (selectedTab === "All Leads") {
      setAllPages({});
      fetchAllLeads(1, null);
    } else {
      setActionPages({});
      fetchActionLeads(1, null);
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

  const handleAllNext = async () => {
    const nextPage = allPage + 1;
    const nextCursor = allCursors[allPage];

    // ✅ Stop going beyond last page
    if (!nextCursor) return;

    if (allPages[nextPage]) {
      setAllPage(nextPage);
      setCurrentAllLeads(allPages[nextPage]);
    } else {
      const result: any = await fetchAllLeads(nextPage, nextCursor);
      if (!result?.data?.length) {
        // ✅ If API returns empty, stop at current page
        console.warn("Reached last page, no more data.");
      }
    }
  };

  const handleAllPrev = () => {
    const prevPage = allPage - 1;
    if (prevPage < 1) return; // ✅ Prevent negative pages
    if (allPages[prevPage]) {
      setAllPage(prevPage);
      setCurrentAllLeads(allPages[prevPage]);
    }
  };

  // const handleActionNext = async () => {
  //   const nextPage = actionPage + 1;
  //   const nextCursor = actionCursors[actionPage];
  //   if (!nextCursor) return;
  //   if (actionPages[nextPage]) {
  //     setActionPage(nextPage);
  //     setCurrentActionLeads(actionPages[nextPage]);
  //   } else {
  //     await fetchActionLeads(nextPage, nextCursor);
  //   }
  // };

  // const handleActionPrev = () => {
  //   const prevPage = actionPage - 1;
  //   if (prevPage >= 1 && actionPages[prevPage]) {
  //     setActionPage(prevPage);
  //     setCurrentActionLeads(actionPages[prevPage]);
  //   }
  // };

  // ---- Clickable Pagination ----

  const handleActionNext = async () => {
    const nextPage = actionPage + 1;
    const nextCursor = actionCursors[actionPage];

    const currentPageLeads = actionPages[actionPage] || [];

    // ✅ Stop if this page already has fewer than page limit (means end)
    if (!nextCursor || currentPageLeads.length < ITEMS_PER_PAGE) {
      console.log(
        "🚫 No more pages to fetch — already last Action Needed page."
      );
      return;
    }

    if (actionPages[nextPage]) {
      setActionPage(nextPage);
      setCurrentActionLeads(actionPages[nextPage]);
    } else {
      const result: any = await fetchActionLeads(nextPage, nextCursor);
      if (!result?.data?.length) {
        console.warn("Reached last Action Needed page.");
      }
    }
  };

  const handleActionPrev = () => {
    const prevPage = actionPage - 1;
    if (prevPage < 1) return;
    if (actionPages[prevPage]) {
      setActionPage(prevPage);
      setCurrentActionLeads(actionPages[prevPage]);
    }
  };

  const handleAllPageClick = async (page: number) => {
    if (page === allPage) return;
    if (allPages[page]) {
      setAllPage(page);
      setCurrentAllLeads(allPages[page]);
    } else {
      const cursor = allCursors[page - 1] || null;
      await fetchAllLeads(page, cursor);
    }
  };

  const handleActionPageClick = async (page: number) => {
    if (page === actionPage) return;
    if (actionPages[page]) {
      setActionPage(page);
      setCurrentActionLeads(actionPages[page]);
    } else {
      const cursor = actionCursors[page - 1] || null;
      await fetchActionLeads(page, cursor);
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

  const renderPagination = (
    currentPage: number,
    pages: Record<number, any[]>,
    cursors: Record<number, string | null>,
    onPageClick: (page: number) => void
  ) => {
    const pageKeys = Object.keys(pages)
      .map(Number)
      .filter((p) => pages[p]?.length > 0);
    const totalPages = pageKeys.length;

    if (totalPages <= 1) return null;

    const visiblePages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      visiblePages.push(1);
      if (currentPage > 3) visiblePages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) visiblePages.push(i);

      if (currentPage < totalPages - 2) visiblePages.push("...");
      visiblePages.push(totalPages);
    }

    return (
      <Stack direction="row" justifyContent="center" gap={1} mt={1}>
        {visiblePages.map((page, idx) =>
          page === "..." ? (
            <Typography key={idx} variant="body2" alignSelf="center">
              ...
            </Typography>
          ) : (
            <CustomButton
              key={page}
              size="small"
              variant={page === currentPage ? "contained" : "outlined"}
              onClick={() => onPageClick(page as number)}
            >
              {page}
            </CustomButton>
          )
        )}
      </Stack>
    );
  };

  return (
    <Box padding={3}>
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
            { label: "Action Needed", count: currentActionLeads.length },
            { label: "All Leads", count: currentAllLeads.length },
          ]}
          onTabChange={(tab) =>
            setSelectedTab(tab as "All Leads" | "Action Needed")
          }
        />

        <Box
          className={styles.shortText}
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "flex-end",
            width: "100%",

            "@media (max-width: 600px)": {
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              "& button": {
                width: "auto",
                justifyContent: "center",
              },
            },
          }}
        >
          <CustomButton
            variant="contained"
            onClick={() => setAddCampaign(true)}
            sx={{ mr: 2 }}
            disabled={!isAnyChecked}
          >
            Add Campaign
          </CustomButton>

          <CustomButton variant="contained" onClick={() => setOpenModal(true)}>
            Add Lead
          </CustomButton>
        </Box>
      </Box>

      {/* Content */}
      <Box mt={3}>
        {selectedTab === "All Leads" && (
          <>
            <AllLeadsList
              leadsData={currentAllLeads}
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
              setIsAnyChecked={setIsAnyChecked}
            />

            {/* Pagination Controls */}
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <CustomButton
                variant="outlined"
                onClick={handleAllPrev}
                disabled={allPage === 1 || isAllFetching}
              >
                Previous
              </CustomButton>
              <Typography alignSelf="center">Page {allPage}</Typography>
              <CustomButton
                onClick={handleAllNext}
                // disabled={!allCursors[allPage] || isAllFetching}
                variant="contained"
                disabled={
                  isAllFetching ||
                  !allCursors[allPage] || // No next cursor
                  !allPages[allPage]?.length // No data in this page
                }
              >
                {isAllFetching ? <CircularProgress size={20} /> : "Next"}
              </CustomButton>
            </Stack>

            {/* Numbered Pagination */}
            {/* {renderPagination(
              allPage,
              allPages,
              // !!allCursors[Object.keys(allPages).length],
              !!allCursors[allPage],

              handleAllPageClick
            )} */}
            {renderPagination(
              allPage,
              allPages,
              allCursors,
              handleAllPageClick
            )}
          </>
        )}

        {selectedTab === "Action Needed" && (
          <>
            <ActionNeededList
              leadsData={currentActionLeads}
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

            {/* Pagination Controls */}
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <CustomButton
                variant="outlined"
                onClick={handleActionPrev}
                // disabled={actionPage === 1 || isActionFetching}
                disabled={actionPage === 1 || isActionFetching}
              >
                Previous
              </CustomButton>
              <Typography alignSelf="center">Page {actionPage}</Typography>
              <CustomButton
                onClick={handleActionNext}
                // disabled={!actionCursors[actionPage] || isActionFetching}
                disabled={
                  isActionFetching ||
                  !actionCursors[actionPage] || // no next page cursor
                  (actionPages[actionPage]?.length ?? 0) < ITEMS_PER_PAGE // last page reached
                }
                variant="contained"
              >
                {isActionFetching ? <CircularProgress size={20} /> : "Next"}
              </CustomButton>
            </Stack>

            {renderPagination(
              actionPage,
              actionPages,
              actionCursors,
              handleActionPageClick
            )}
          </>
        )}
      </Box>

      {/* Add Lead Modal */}
      <AddLeadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetchLeads={() =>
          selectedTab === "All Leads"
            ? fetchAllLeads(allPage)
            : fetchActionLeads(actionPage)
        }
      />
      {/* Add Campaign Modal */}
      {/* <AddToCampaignModal
        open={addCampaign}
        onClose={() => setAddCampaign(false)}
        selectedLeads={getSelectedLeads()}
      /> */}
    </Box>
  );
};

export default Dashboard;
