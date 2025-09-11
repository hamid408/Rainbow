"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import styles from "./index.module.scss";

export interface TabItem {
  label: string;
  icon?: React.ReactNode;
}

export interface CustomTabsProps {
  tabs: TabItem[];
  activeColor?: string;
  onTabChange?: (label: string) => void;
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  activeColor = "#8647F5",
  onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(tabs[index].label);
  };

  return (
    <Box className={styles.customTabWrapper} sx={{ xs: { ml: "-40px" } }}>
      <Box display="flex" gap={2} pb={1}>
        {tabs.map((tab, index) => (
          <Button
            key={index}
            onClick={() => handleTabClick(index)}
            startIcon={tab.icon}
            // disableRipple
            sx={{
              textTransform: "none",
              fontWeight: activeIndex === index ? 600 : 400,
              fontSize: 16,
              color: activeIndex === index ? activeColor : "#0D0D12",
              borderBottom: "3px solid",
              borderColor: activeIndex === index ? activeColor : "transparent",
              borderRadius: 0,
              paddingBottom: "6px",
              minWidth: "100px",
              backgroundColor: "transparent",
              "&:hover": {
                color: activeColor,
                // borderColor: activeColor,
                // backgroundColor: "transparent",
                fontWeight: "600",
              },
              "&:focus": {
                color: activeColor,
              },
              "&:active": {
                color: activeColor,
              },
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default CustomTabs;
