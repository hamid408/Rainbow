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
import {
  useGetLeadsEnumsQuery,
  useGetLeadsQuery,
} from "@/src/redux/services/leads/leadsApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CommunicationRow from "./CommunicationRow";

const ITEMS_PER_PAGE = 10;

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

type AwaitingReplyListProps = {
  leadsData: any;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const AwaitingReplyList: React.FC<AwaitingReplyListProps> = ({
  leadsData,
  isLoading,
  isFetching,
  isError,
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
}) => {
  const [search, setSearch] = useState("");
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [isAll, setIsAll] = useState(true);




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

  const filteredData = leadsData || [];
  useEffect(() => {
    console.log("Updated leads from API:", leadsData);
    console.log("Selected tags:", selectedTags);
  }, [leadsData, selectedTags]);

  return (
    <>
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
          display={"flex"}
          gap={1.5}
          alignItems={"center"}
          marginLeft={2.3}
          marginBottom={2.3}
          marginTop={2.3}
          flexWrap={"wrap"}
        >
     

          <div onClick={handleTagClick}>
            <IconChip label="Tag" icon={<Plus />} color="#656565" />
           
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleTagClose}
          >
            {tags.map((tag: any) => (
              <MenuItem key={tag} onClick={() => handleTagSelect(tag)}>
                <Checkbox checked={selectedTags.includes(tag)} />
                <ListItemText primary={tag} />
              </MenuItem>
            ))}
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

        {/* 🧾 Table Header */}
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
          <div style={{ flex: 1, padding: "0 8px" }}>Status</div>
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
    </>
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

export default AwaitingReplyList;
