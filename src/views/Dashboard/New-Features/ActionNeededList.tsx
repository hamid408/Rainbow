"use client";
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
import { useGetLeadsEnumsQuery } from "@/src/redux/services/leads/leadsApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ActionNeededListProps = {
  leadsData: any;
  isLoading: boolean;
  isFetching: boolean;
  isError?: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  sortOrder: "ASC" | "DESC";
  setSortOrder: React.Dispatch<React.SetStateAction<"ASC" | "DESC">>;
  selectedStages: string[];
  setSelectedStages: React.Dispatch<React.SetStateAction<string[]>>;
};

const ActionNeededList: React.FC<ActionNeededListProps> = ({
  leadsData,
  isLoading,
  isFetching,
  isError,
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  sortOrder,
  setSortOrder,
  selectedStages,
  setSelectedStages,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [tagMenu, setTagMenu] = useState<HTMLElement | null>(null);
  const [sortMenu, setSortMenu] = useState<HTMLElement | null>(null);
  const [stageMenu, setStageMenu] = useState<HTMLElement | null>(null);
  console.log("leadsData", leadsData);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data: enumsData, isLoading: enumsLoading } = useGetLeadsEnumsQuery();
  const tags = enumsData?.tags || [];
  const stages = enumsData?.stages || [];

  const handleCheck = (id: string) =>
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleTagSelect = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  const clearAllTags = () => setSelectedTags([]);

  const handleStageSelect = (stage: string) =>
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  const clearAllStages = () => setSelectedStages([]);

  const handleSortSelect = (order: "ASC" | "DESC") => {
    setSortOrder(order);
    setSortMenu(null);
  };

  const filteredData = leadsData || [];

  return (
    <Box sx={styles.container}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <CustomSearchField
          endIcon={<Search />}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          style={styles.search}
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

      <Divider sx={{ my: 1.5 }} />

      <Box
        display="flex"
        gap={1.5}
        alignItems="center"
        flexWrap="wrap"
        ml={2.3}
        mb={2.3}
      >
        <div onClick={(e) => setSortMenu(e.currentTarget)}>
          <IconChip
            label={`Creation Date ${sortOrder ? `(${sortOrder})` : ""}`}
            icon={<Plus />}
            color="#656565"
          />
        </div>
        <Menu
          anchorEl={sortMenu}
          open={Boolean(sortMenu)}
          onClose={() => setSortMenu(null)}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": {
                fontSize: "14px",
                py: 0.3, // reduces vertical padding
                minHeight: "48px", // optional: keeps it compact
              },
              "& .MuiCheckbox-root": {
                p: 0.3, // smaller checkbox padding
              },
              "& .MuiListItemText-primary": {
                fontSize: "14px",
              },
            },
          }}
        >
          {["ASC", "DESC"].map((order) => (
            <MenuItem
              key={order}
              onClick={() => handleSortSelect(order as "ASC" | "DESC")}
            >
              <ListItemText primary={order} />
            </MenuItem>
          ))}
        </Menu>

        <div onClick={(e) => setTagMenu(e.currentTarget)}>
          <IconChip label="Tag" icon={<Plus />} color="#656565" />
        </div>
        <Menu
          anchorEl={tagMenu}
          open={Boolean(tagMenu)}
          onClose={() => setTagMenu(null)}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": {
                fontSize: "12px",
                py: 0.3, // reduces vertical padding
                minHeight: "28px", // optional: keeps it compact
              },
              "& .MuiCheckbox-root": {
                p: 0.3, // smaller checkbox padding
              },
              "& .MuiListItemText-primary": {
                fontSize: "12px",
              },
            },
          }}
        >
          {tags.length > 0 ? (
            tags.map((tag: string) => (
              <MenuItem key={tag} onClick={() => handleTagSelect(tag)}>
                <Checkbox checked={selectedTags.includes(tag)} size="small" />
                <ListItemText primary={tag} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              {enumsLoading ? "Loading..." : "No tags found"}
            </MenuItem>
          )}
        </Menu>

        <div onClick={(e) => setStageMenu(e.currentTarget)}>
          <IconChip label="Stage" icon={<Plus />} color="#656565" />
        </div>
        <Menu
          anchorEl={stageMenu}
          open={Boolean(stageMenu)}
          onClose={() => setStageMenu(null)}
          PaperProps={{
            sx: { maxHeight: 300, overflowY: "auto" },
          }}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": {
                fontSize: "12px",
                py: 0.3, // reduces vertical padding
                minHeight: "28px", // optional: keeps it compact
              },
              "& .MuiCheckbox-root": {
                p: 0.3, // smaller checkbox padding
              },
              "& .MuiListItemText-primary": {
                fontSize: "12px",
              },
            },
          }}
        >
          {stages.length > 0 ? (
            stages.map((stage: string) => (
              <MenuItem key={stage} onClick={() => handleStageSelect(stage)}>
                <Checkbox
                  checked={selectedStages.includes(stage)}
                  size="small"
                />
                <ListItemText primary={stage} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              {enumsLoading ? "Loading..." : "No stages found"}
            </MenuItem>
          )}
        </Menu>
      </Box>

      {selectedStages.length > 0 && (
        <Box display="flex" alignItems="center" gap={1.5} ml={2.3} mb={2}>
          <Box sx={styles.filterBox}>
            <Typography sx={styles.filterTitle}>Stages:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedStages.map((stage) => (
                <IconChip key={stage} label={stage} color="#7A4DF5" />
              ))}
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="#7A4DF5"
            sx={{ cursor: "pointer" }}
            onClick={clearAllStages}
          >
            Clear all
          </Typography>
        </Box>
      )}

      {selectedTags.length > 0 && (
        <Box display="flex" alignItems="center" gap={1.5} ml={2.3} mb={2}>
          <Box sx={styles.filterBox}>
            <Typography sx={styles.filterTitle}>Tags:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedTags.map((tag) => (
                <IconChip key={tag} label={tag} color="#7A4DF5" />
              ))}
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="#7A4DF5"
            sx={{ cursor: "pointer" }}
            onClick={clearAllTags}
          >
            Clear all
          </Typography>
        </Box>
      )}

      {/* Table header */}
      <Box sx={styles.tableHeader}>
        <div style={{ flex: 0.6, padding: "0 8px" }}>Name</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Status</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Action Item</div>
      </Box>

      {/* Table content */}
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
        filteredData.map(
          (item: any) => (
            console.log("item", item),
            (
              <Link
                key={item.lead_id}
                href={`/dashboard/${item.lead_id}?page=${page}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CommunicationRow
                  name={item.lead_name}
                  status={item.action_status || "—"}
                  actionItem={item.action_item}
                  checked={!!checkedItems[item.lead_id]}
                  onCheck={() => handleCheck(item.lead_id)}
                />
              </Link>
            )
          )
        )
      )}
    </Box>
  );
};

// -------------------- Styles --------------------
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
  tableHeader: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    fontWeight: 600,
    borderBottom: "1px solid #E4E4E4",
    backgroundColor: "#fafafa",
  },
  filterBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    background: "rgba(0,0,0,0.05)",
    borderRadius: "20px",
    padding: "6px 10px",
  },
  filterTitle: {
    fontWeight: 500,
    fontSize: 13,
    color: "#555",
  },
};

export default ActionNeededList;
