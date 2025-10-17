import React, { useState } from "react";
import CommunicationRow from "./CommunicationRow";
import CustomSearchField from "@/src/components/common/CustomSearch";
import { Search } from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import IconChip from "@/src/components/common/CustomChip";
import { Plus } from "@/src/assests/icons";
import { useGetLeadsReachOutLeadsQuery } from "@/src/redux/services/campagin/campaignApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetLeadsEnumsQuery } from "@/src/redux/services/leads/leadsApi";

const initialData = [
  {
    name: "James Carter",
    status: "AI attempted live transfer, but your office did not answer.",
    actionItem: "Please return call or reschedule transfer.",
    tags: ["High Priority", "Price Inquiry"],
  },
  {
    name: "Maria Lopez",
    status: "AI successfully connected live call. Conversation held on 09/27.",
    actionItem: "Review notes and follow up with family as needed.",
    tags: ["Pre-Need"],
  },
  {
    name: "Danielle Patel",
    status:
      "Family asked if Catholic and Buddhist traditions can be combined. AI paused outreach pending your input.",
    actionItem: "Review AI draft reply or respond directly to family.",
    tags: ["Aftercare"],
  },
  {
    name: "Homie Lopez",
    status: "AI successfully connected live call. Conversation held on 09/27.",
    actionItem: "Review notes and follow up with family as needed.",
    tags: ["Referral"],
  },
];

const allTags = [
  "High Priority",
  "Price Inquiry",
  "Pre-Need",
  "Aftercare",
  "Bilingual Support",
  "Veteran",
  "Referral",
  "Insurance Check",
  "Meeting Scheduled",
  "Community Event Lead",
];

const CommunicationList = ({
  leadsData,
  isFetching,
  isLoading,
  isError,
}: any) => {
  const [search, setSearch] = useState("");
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const searchParams = useSearchParams();
  const { data: enumsData, refetch } = useGetLeadsEnumsQuery();
  const tags = enumsData?.tags || [];

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const handleCheck = (name: any) => {
    setCheckedItems((prev: any) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleTagClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTagClose = () => {
    setAnchorEl(null);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const filteredData = (leadsData || []).filter(
    (item: any) =>
      item.lead_name?.toLowerCase().includes(search.toLowerCase()) &&
      (selectedTags.length === 0 ||
        selectedTags.every((tag) => item.tags?.includes(tag)))
  );

  return (
    <Box style={styles.container}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <CustomSearchField
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
          startIcon={<Search />}
        />
        <Typography
          variant="subtitle1"
          fontWeight={400}
          fontSize={14}
          color="#818181"
          marginRight={2.5}
        >
          Showing {filteredData.length} result
          {filteredData.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Divider />

      <Box
        display={"flex"}
        gap={1.5}
        alignItems={"center"}
        marginLeft={2.3}
        marginBottom={2.3}
        marginTop={2.3}
        flexWrap={"wrap"}
      >
        {/* <IconChip label="Creation Date" icon={<Plus />} color="#656565" />
        <IconChip label="Last Response Date" icon={<Plus />} color="#656565" /> */}

        {/* Tag Dropdown */}
        <div onClick={handleTagClick}>
          <IconChip label="Tag" icon={<Plus />} color="#656565" />
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleTagClose}
        >
          {tags.map((tag: string) => (
            <MenuItem key={tag} onClick={() => handleTagSelect(tag)}>
              <Checkbox checked={selectedTags.includes(tag)} />
              <ListItemText primary={tag} />
            </MenuItem>
          ))}
        </Menu>

      </Box>

     
      {/* Selected Tags Row */}
      {selectedTags.length > 0 && (
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          marginLeft={2.3}
          marginBottom={2}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              background: "rgba(0,0,0,0.05)",
              borderRadius: "20px",
              padding: "6px 10px",
              color: "#7A4DF5",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 13, color: "#555" }}
            >
              Tag:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedTags.map((tag) => (
                <IconChip key={tag} label={tag} color={"#7A4DF5"} />
              ))}
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="#7A4DF5"
            style={{ cursor: "pointer" }}
            onClick={clearAllTags}
          >
            Clear all
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          fontWeight: 600,
          borderBottom: "1px solid #E4E4E4",
          backgroundColor: "#fafafa",
        }}
      >
        {/* <input type="checkbox" style={{ marginRight: "12px" }} disabled /> */}
        <div style={{ flex: 0.6, padding: "0 8px" }}>Name</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Status</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Action Item</div>
      </Box>
      {isLoading || isFetching ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress size={40} />
        </Box>
      ) : isError ? (
        <Typography variant="body1" color="error" textAlign="center" mt={3}>
          Failed to load leads. Please try again.
        </Typography>
      ) : filteredData.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          textAlign="center"
          mt={3}
        >
          No leads found.
        </Typography>
      ) : (
        filteredData.map((item: any) => (
          <Link
            key={item.lead_id}
            href={`/dashboard/${item.lead_id}?page=${page}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <CommunicationRow
              key={item.lead_id}
              name={item.lead_name}
              status={item.action_status || "oi"}
              actionItem={item.action_item}
              checked={!!checkedItems[item.lead_id]}
              onCheck={() => handleCheck(item.lead_id)}
            />
          </Link>
        ))
      )}
    </Box>
  );
};

const styles = {
  container: {
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    borderRadius: "12px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  search: {
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
    marginTop: "12px",
    marginLeft: "12px",
  },
};

export default CommunicationList;
