"use client";
import React, { useEffect, useState } from "react";
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
import CommunicationRow from "./CommunicationRow";

const ITEMS_PER_PAGE = 10;

type AwaitingReplyListProps = {
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
  setIsAnyChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

const AllLeadsList: React.FC<AwaitingReplyListProps> = ({
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
  setIsAnyChecked,
}) => {
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [tagAnchorEl, setTagAnchorEl] = useState<null | HTMLElement>(null);
  const [stageAnchorEl, setStageAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const searchParams = useSearchParams();
  const [page] = useState(Number(searchParams.get("page")) || 1);

  const { data: enumsData } = useGetLeadsEnumsQuery();
  const tags = enumsData?.tags || [];
  const stages = enumsData?.stages || [];

  // const handleCheck = (name: any) => {
  //   setCheckedItems((prev: any) => ({
  //     ...prev,
  //     [name]: !prev[name],
  //   }));
  // };
  const handleCheck = (leadId: string) => {
    setCheckedItems((prev: any) => {
      const updated = { ...prev, [leadId]: !prev[leadId] };
      const anyChecked = Object.values(updated).some(Boolean);
      setIsAnyChecked?.(anyChecked);
      return updated;
    });
  };

  // ---------- TAGS ----------
  const handleTagClick = (event: React.MouseEvent<HTMLDivElement>) =>
    setTagAnchorEl(event.currentTarget);
  const handleTagClose = () => setTagAnchorEl(null);

  const handleTagSelect = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clearAllTags = () => setSelectedTags([]);

  // ---------- STAGES ----------
  const handleStageClick = (event: React.MouseEvent<HTMLDivElement>) =>
    setStageAnchorEl(event.currentTarget);
  const handleStageClose = () => setStageAnchorEl(null);

  const handleStageSelect = (stage: string) =>
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );

  const clearAllStages = () => setSelectedStages([]);

  // ---------- SORT ----------
  const handleSortClick = (event: React.MouseEvent<HTMLDivElement>) =>
    setSortAnchorEl(event.currentTarget);
  const handleSortClose = () => setSortAnchorEl(null);

  const handleSortSelect = (order: any) => {
    setSortOrder(order);
    setSortAnchorEl(null);
  };

  const filteredData = leadsData || [];

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const removeStage = (stage: string) => {
    setSelectedStages((prev) => prev.filter((s) => s !== stage));
  };

  return (
    <Box style={styles.container}>
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

      <Divider />

      <Box
        display="flex"
        gap={1.5}
        alignItems="center"
        marginLeft={2.3}
        marginBottom={2.3}
        marginTop={2.3}
        flexWrap="wrap"
      >
        <div onClick={handleSortClick}>
          <IconChip
            label={`Creation Date ${sortOrder ? `(${sortOrder})` : ""}`}
            icon={<Plus />}
            color="#656565"
          />
        </div>

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortClose}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": {
                fontSize: "14px",
                py: 0.3,
                minHeight: "48px",
              },
              "& .MuiCheckbox-root": {
                p: 0.3,
              },
              "& .MuiListItemText-primary": {
                fontSize: "14px",
              },
            },
          }}
        >
          {["ASC", "DESC"].map((order) => (
            <MenuItem key={order} onClick={() => handleSortSelect(order)}>
              <ListItemText primary={order} />
            </MenuItem>
          ))}
        </Menu>

        {/* Tags */}
        <div onClick={handleTagClick}>
          <IconChip label="Tag" icon={<Plus />} color="#656565" />
        </div>
        <Menu
          anchorEl={tagAnchorEl}
          open={Boolean(tagAnchorEl)}
          onClose={handleTagClose}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": {
                fontSize: "12px",
                py: 0.3,
                minHeight: "28px",
              },
              "& .MuiCheckbox-root": {
                p: 0.3,
              },
              "& .MuiListItemText-primary": {
                fontSize: "12px",
              },
            },
          }}
        >
          {tags.length > 0 ? (
            tags.map((tag: any) => (
              <MenuItem
                key={tag}
                onClick={() => handleTagSelect(tag)}
                sx={{ fontSize: "12px" }}
              >
                <Checkbox checked={selectedTags.includes(tag)} size="small" />
                <ListItemText primary={tag} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No tags found</MenuItem>
          )}
        </Menu>

        {/* Stages */}
        <div onClick={handleStageClick}>
          <IconChip label="Stage" icon={<Plus />} color="#656565" />
        </div>
        <Menu
          anchorEl={stageAnchorEl}
          open={Boolean(stageAnchorEl)}
          onClose={handleStageClose}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": {
                fontSize: "12px",
                py: 0.3,
                minHeight: "28px",
              },
              "& .MuiCheckbox-root": {
                p: 0.3,
              },
              "& .MuiListItemText-primary": {
                fontSize: "12px",
              },
            },
          }}
        >
          {stages.length > 0 ? (
            stages.map((stage: any) => (
              <MenuItem key={stage} onClick={() => handleStageSelect(stage)}>
                <Checkbox
                  checked={selectedStages.includes(stage)}
                  size="small"
                />
                <ListItemText primary={stage} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No stages found</MenuItem>
          )}
        </Menu>
      </Box>

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
              Tags:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedTags.map((tag) => (
                // <IconChip key={tag} label={tag} color="#7A4DF5" />
                <IconChip
                  key={tag}
                  label={tag}
                  color="#7A4DF5"
                  onClick={() => removeTag(tag)}
                />
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

      {selectedStages.length > 0 && (
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
              Stages:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedStages.map((stage) => (
                // <IconChip key={stage} label={stage} color="#7A4DF5" />
                
                <IconChip
                  key={stage}
                  label={stage}
                  color="#7A4DF5"
                  onClick={() => removeStage(stage)}
                />
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
        <div style={{ flex: 1, padding: "0 8px" }}>Name</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Email</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Stage</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Inquiry Type</div>
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
        <Typography variant="body1" color="error" textAlign="center" m={3}>
          Failed to load leads. Please try again.
        </Typography>
      ) : filteredData.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          textAlign="center"
          m={3}
        >
          No leads found.
        </Typography>
      ) : (
        leadsData.map((item: any) => (
          <Link
            key={item.lead_id}
            href={`/dashboard/${item.lead_id}?page=${page}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <CommunicationRow
              name={`${item.lead_name || item.first_name || ""} ${
                item.last_name || ""
              }`}
              email={item.email || "—"}
              status={item.inquiry_status || "—"}
              inquiry_type={item.inquiry_type || item.content || "—"}
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

export default AllLeadsList;
