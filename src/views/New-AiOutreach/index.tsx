// "use client";
// import React, { useState, useMemo, useEffect } from "react";
// import AiReachList from "./AiReachList";
// import { Box, Typography, CircularProgress } from "@mui/material";
// import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
// import CustomTabs from "@/src/components/common/CustomTabs";
// import { useGetLeadsReachOutLeadsQuery } from "@/src/redux/services/campagin/campaignApi";
// import CustomTextField from "@/src/components/common/CustomTextfield";
// import { useDebounce } from "@/src/hooks/useDebounce";
// import { useGetLeadsEnumsQuery } from "@/src/redux/services/leads/leadsApi";

// const NewAiOutreach = () => {
//   const filterItems = [
//     { label: "1 Month" },
//     { label: "2 Month" },
//     { label: "Year" },
//   ];
//   const [search, setSearch] = useState("");
//   const [selectedCampaign, setSelectedCampaign] = useState<string>("");

//   const [activeTab, setActiveTab] = useState("All");
//   const searchQuery = useDebounce(search, 400);
//   const { data: enumsData, isLoading: isCampaignsLoading } =
//     useGetLeadsEnumsQuery();
//   const { data, isLoading, isError, refetch } = useGetLeadsReachOutLeadsQuery({
//     page: 1,
//     page_size: 20,
//     name: searchQuery,
//     campaign_name: selectedCampaign || "",
//   });
//   const campaigns = enumsData?.campaigns || [];

//   useEffect(() => {
//     refetch();
//   }, [activeTab, selectedCampaign, searchQuery, refetch]);

//   const uniqueLeads = useMemo(() => {
//     const seen = new Set();
//     return (data?.data || []).filter((lead: any) => {
//       if (!lead.lead_id || seen.has(lead.lead_id)) return false;
//       seen.add(lead.lead_id);
//       return true;
//     });
//   }, [data]);

//   const engagedLeads = useMemo(
//     () => uniqueLeads.filter((lead: any) => lead.engaging === true),
//     [uniqueLeads]
//   );

//   const awaitingLeads = useMemo(
//     () => uniqueLeads.filter((lead: any) => lead.engaging === false),
//     [uniqueLeads]
//   );

//   const allLeads = useMemo(() => uniqueLeads, [uniqueLeads]);

//   const currentList =
//     activeTab === "Engaged"
//       ? engagedLeads
//       : activeTab === "Awaiting Reply"
//       ? awaitingLeads
//       : allLeads;

//   console.log({
//     campaigns,
//   });
//   // const campaignOptions =
//   //   Array.isArray(campaigns) && campaigns.length > 0
//   //     ? campaigns.map((c: string) => ({
//   //         label: c,
//   //         value: c,
//   //       }))
//   //     : [];
//   const campaignOptions =
//     Array.isArray(campaigns) && campaigns.length > 0
//       ? [
//           { label: "No Select", value: "" },
//           ...campaigns.map((c: string) => ({ label: c, value: c })),
//         ]
//       : [{ label: "No Select", value: "" }];

//   return (
//     <Box padding={3}>
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="h4" fontSize={23} fontWeight={500}>
//           AI Outreach
//         </Typography>
//         <Box display="flex" gap={2} alignItems="center">
//           <CustomFilterSelect
//             title="Campaigns"
//             options={campaignOptions}
//             loading={isCampaignsLoading}
//             onSelect={(option) =>
//               setSelectedCampaign(String(option?.value || ""))
//             }
//           />
//         </Box>
//       </Box>
//       <Box mt={3}>
//         <CustomTabs
//           tabs={[
//             { label: "All", count: allLeads.length },
//             { label: "Engaged", count: engagedLeads.length },
//             { label: "Awaiting Reply", count: awaitingLeads.length },
//           ]}
//           onTabChange={(tabLabel) => setActiveTab(tabLabel)}
//         />
//       </Box>

//       <Box mt={3}>
//         {isLoading ? (
//           <Box display="flex" justifyContent="center" py={5}>
//             <CircularProgress size={30} />
//           </Box>
//         ) : isError ? (
//           <Typography color="error" textAlign="center" py={5}>
//             Failed to load AI outreach leads.
//           </Typography>
//         ) : (
//           <AiReachList
//             list={currentList}
//             searchQuery={search}
//             setSearchQuery={setSearch}
//           />
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default NewAiOutreach;
"use client";
import React, { useState, useMemo, useEffect } from "react";
import AiReachList from "./AiReachList";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
import CustomTabs from "@/src/components/common/CustomTabs";
import CustomButton from "@/src/components/common/CustomButton";
import { useLazyGetLeadsReachOutLeadsQuery } from "@/src/redux/services/campagin/campaignApi";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useGetLeadsEnumsQuery } from "@/src/redux/services/leads/leadsApi";

const ITEMS_PER_PAGE = 20;

const NewAiOutreach = () => {
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [activeTab, setActiveTab] = useState("All");
  const searchQuery = useDebounce(search, 400);

  const { data: enumsData, isLoading: isCampaignsLoading } =
    useGetLeadsEnumsQuery();
  const campaigns = enumsData?.campaigns || [];

  const [triggerFetch, { isLoading, isFetching }] =
    useLazyGetLeadsReachOutLeadsQuery();

  // Pagination states
  const [pages, setPages] = useState<Record<number, any[]>>({});
  const [cursors, setCursors] = useState<Record<number, string | null>>({});
  const [page, setPage] = useState(1);
  const [currentLeads, setCurrentLeads] = useState<any[]>([]);
  const [hasNext, setHasNext] = useState(false);

  // ✅ Fetch leads function with “stop when no new data”
  const fetchLeads = async (pageNum: number, cursor: string | null = null) => {
    try {
      const res = await triggerFetch({
        page_size: ITEMS_PER_PAGE,
        next_cursor: cursor || undefined,
        name: searchQuery,
        campaign_name: selectedCampaign || "",
      }).unwrap();

      const leads = res?.data ?? [];
      const nextCursor =
        leads.length === ITEMS_PER_PAGE ? res?.next_cursor : null;

      // Stop re-fetching same data if nothing new
      if (!leads.length && !pages[pageNum]) return;

      setPages((prev) => ({ ...prev, [pageNum]: leads }));
      setCursors((prev) => ({ ...prev, [pageNum]: nextCursor }));
      setHasNext(!!nextCursor);
      setCurrentLeads(leads);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching AI Outreach leads:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeads(1, null);
  }, []);

  // When filters or search changes
  useEffect(() => {
    setPages({});
    setCursors({});
    setPage(1);
    fetchLeads(1, null);
  }, [selectedCampaign, searchQuery, activeTab]);

  // Pagination actions
  const handleNext = async () => {
    const nextPage = page + 1;
    const nextCursor = cursors[page];
    if (!nextCursor) return;

    if (pages[nextPage]) {
      setPage(nextPage);
      setCurrentLeads(pages[nextPage]);
    } else {
      await fetchLeads(nextPage, nextCursor);
    }
  };

  const handlePrev = () => {
    const prevPage = page - 1;
    if (prevPage >= 1 && pages[prevPage]) {
      setPage(prevPage);
      setCurrentLeads(pages[prevPage]);
    }
  };

  const handlePageClick = async (pageNum: number) => {
    if (pageNum === page) return;
    if (pages[pageNum]) {
      setPage(pageNum);
      setCurrentLeads(pages[pageNum]);
    } else {
      const cursor = cursors[pageNum - 1] || null;
      await fetchLeads(pageNum, cursor);
    }
  };

  // Filter by tab
  const uniqueLeads = useMemo(() => {
    const seen = new Set();
    return (currentLeads || []).filter((lead: any) => {
      if (!lead.lead_id || seen.has(lead.lead_id)) return false;
      seen.add(lead.lead_id);
      return true;
    });
  }, [currentLeads]);

  const engagedLeads = useMemo(
    () => uniqueLeads.filter((lead: any) => lead.engaging === true),
    [uniqueLeads]
  );

  const awaitingLeads = useMemo(
    () => uniqueLeads.filter((lead: any) => lead.engaging === false),
    [uniqueLeads]
  );

  const currentList =
    activeTab === "Engaged"
      ? engagedLeads
      : activeTab === "Awaiting Reply"
      ? awaitingLeads
      : uniqueLeads;

  // Pagination UI
  const renderPagination = (
    currentPage: number,
    pages: Record<number, any[]>,
    hasNext: boolean
  ) => {
    const totalPages = Object.keys(pages).length + (hasNext ? 1 : 0);
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
        {visiblePages.map((p, idx) =>
          p === "..." ? (
            <Typography key={idx} variant="body2">
              ...
            </Typography>
          ) : (
            <CustomButton
              key={p}
              size="small"
              variant={p === currentPage ? "contained" : "outlined"}
              onClick={() => handlePageClick(p as number)}
            >
              {p}
            </CustomButton>
          )
        )}
      </Stack>
    );
  };

  const campaignOptions =
    Array.isArray(campaigns) && campaigns.length > 0
      ? [
          { label: "No Select", value: "" },
          ...campaigns.map((c: string) => ({ label: c, value: c })),
        ]
      : [{ label: "No Select", value: "" }];

  return (
    <Box padding={3}>
      {/* Header */}
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

      {/* Tabs */}
      <Box mt={3}>
        <CustomTabs
          tabs={[
            { label: "All", count: uniqueLeads.length },
            { label: "Engaged", count: engagedLeads.length },
            { label: "Awaiting Reply", count: awaitingLeads.length },
          ]}
          onTabChange={(tabLabel) => setActiveTab(tabLabel)}
        />
      </Box>

      {/* Leads List */}
      <Box mt={3}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <AiReachList
            list={currentList}
            searchQuery={search}
            setSearchQuery={setSearch}
          />
        )}
      </Box>

      {/* Pagination Controls */}
      <Stack direction="row" justifyContent="space-between" mt={2}>
        <CustomButton
          variant="outlined"
          onClick={handlePrev}
          disabled={page === 1 || isFetching}
        >
          Previous
        </CustomButton>

        <Typography alignSelf="center">Page {page}</Typography>

        <CustomButton
          onClick={handleNext}
          disabled={!hasNext || isFetching}
          variant="contained"
        >
          {isFetching ? <CircularProgress size={20} /> : "Load More"}
        </CustomButton>
      </Stack>

      {/* Numbered Pagination */}
      {renderPagination(page, pages, hasNext)}
    </Box>
  );
};

export default NewAiOutreach;
