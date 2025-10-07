"use client";
import React, { useState } from "react";
import CustomSearchField from "@/src/components/common/CustomSearch";
import { Search } from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import AiOutReachRow from "./AiOutReachRow";

const AiReachList = ({ list }: any) => {
  const [search, setSearch] = useState("");
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCheck = (name: string) => {
    setCheckedItems((prev: any) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const selectedCount = Object.values(checkedItems).filter(Boolean).length;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleAction = (action: string) => {
    alert(`Action selected: ${action}`);
    handleClose();
  };

  // 🔹 Filter search locally
  const filteredList = list.filter((item: any) =>
    item.lead_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box style={styles.container}>
      {/* Search + Actions */}
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

        {selectedCount > 0 ? (
          <Box display="flex" alignItems="center" gap={2} mr={2.5}>
            <Typography variant="subtitle2" color="#9b0f0fff">
              {selectedCount} selected
            </Typography>
            <Button variant="outlined" size="small" onClick={handleClick}>
              Actions
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleAction("Archive")}>
                Archive
              </MenuItem>
              <MenuItem onClick={() => handleAction("Add Tags")}>
                Add tags
              </MenuItem>
              <MenuItem onClick={() => handleAction("Delete Contact")}>
                Delete contact
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Typography
            variant="subtitle1"
            fontWeight={400}
            fontSize={14}
            color="#818181"
            marginRight={2.5}
          >
            Showing {filteredList.length} result
            {filteredList.length !== 1 ? "s" : ""}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Header */}
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
        <div style={{ flex: 0.5, padding: "0 8px" }}>Name</div>
        <div style={{ flex: 1, padding: "0 8px" }}>Status</div>
      </Box>

      {/* Data Rows */}
      {filteredList.map((item: any) => (
        <AiOutReachRow
          key={item.lead_id}
          name={item.lead_name}
          status={item.status}
          checked={!!checkedItems[item.lead_id]}
          onCheck={() => handleCheck(item.lead_id)}
        />
      ))}
    </Box>
  );
};

const styles = {
  container: {
    borderRadius: "12px",
    border: "1px solid #ccc",
    cursor: "pointer",
    marginTop: "-8px",
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

export default AiReachList;
