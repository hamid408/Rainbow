"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomFilterSelect from "../../../components/common/CustomFilterSelect";
import CustomSearchField from "../../../components/common/CustomSearch";
import { Search } from "@mui/icons-material";
import styles from "./style.module.scss";
import CustomButton from "@/src/components/common/CustomButton";
import AddLeadModal from "../AddLeadModal";
const filterItems = [
  { label: "1 Month" },
  { label: "2 Month" },
  { label: "Year" },
];
const Header = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  refetch,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: any;
  refetch: () => void;
}) => {
  const [selectedValue, setSlectedValue] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);

  const handleSelect = (label: string | null) => {
    setSlectedValue(label ?? "dummy");
  };
  // const dashboardLeads = activeTab === "All" ? "Dashboard" : activeTab;
  return (
    <Box className={styles.root}>
      <Box className={styles.secondaryBox}>
        <Box className={styles.row}>
          <Typography variant="h1" ml={3}>
            Leads Dashboard
          </Typography>
          <Typography variant="caption" className={styles.priorityResponses}>
            {/* (Priority Responses) */}
          </Typography>
        </Box>
      </Box>
      <Box display={"flex"} gap={2} className={styles.searchBox}>
        <CustomSearchField
          endIcon={<Search />}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Box className={styles.shortText}>
          <CustomButton variant="contained" onClick={() => setOpenModal(true)}>
            Add Lead
          </CustomButton>
        </Box>
      </Box>
      <AddLeadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetchLeads={refetch}
      />
    </Box>
  );
};

export default Header;
