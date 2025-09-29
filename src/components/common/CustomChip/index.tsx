"use client";
import React from "react";
import { Chip } from "@mui/material";

export interface IconChipProps {
  label?: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  color?: any;
  variant?: "filled" | "outlined";
  size?: "small" | "medium";
}

const IconChip: React.FC<IconChipProps> = ({
  label,
  icon,
  onClick,
  color = "#656565",
  variant = "outlined",
  size = "small",
}) => {
  return (
    <Chip
      label={label}
      icon={icon}
      clickable={!!onClick}
      onClick={onClick}
      color={color}
      variant={variant}
      size={size}
      sx={{
        borderRadius: "12px",
        fontWeight: 400,
        fontSize: 14,
        padding: "7px",
      }}
    />
  );
};

export default IconChip;
