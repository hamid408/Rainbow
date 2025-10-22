"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";

export interface TabItem {
  label: string;
  icon?: React.ReactNode;
  count?: number;
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
    <Box sx={{ display: "flex", gap: 3, pb: 1 }}>
      {tabs.map((tab, index) => (
        <Box
          key={index}
          onClick={() => handleTabClick(index)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: { xs: "11px", sm: "14px", md: "16px" },
            color: activeIndex === index ? activeColor : "#0D0D12",
            borderBottom: "3px solid",
            borderColor: activeIndex === index ? activeColor : "transparent",
            paddingBottom: "6px",
            minWidth: "100px",
            backgroundColor: "transparent",
            transition: "color 0.5s ease, border-color 0.2s ease",
            "&:hover": {
              color: activeColor,
              // borderColor: activeColor,
            },
            userSelect: "none",
          }}
        >
          {tab.icon && <Box>{tab.icon}</Box>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <Box
              component="span"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "12px",
                px: "6px",
                py: "2px",
                backgroundColor: activeIndex === index ? "#F2E8FF" : "#F5F5F5",
                color: activeIndex === index ? activeColor : "#555",
              }}
            >
              {tab.count}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CustomTabs;
