"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Filters } from "@/src/assests/icons";

export interface Option {
  label: string;
  value: string | number;
}

interface CustomFilterSelectProps {
  title?: string;
  options: Option[];
  onSelect: (option: Option | null) => void;
  loading?: boolean;
}

const CustomFilterSelect: React.FC<CustomFilterSelectProps> = ({
  title = "Filter",
  options,
  onSelect,
  loading = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Option | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option);
    handleClose();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "4px 8px",
          height: "44px",
          cursor: "pointer",
          backgroundColor: "#fff",
        }}
        onClick={handleOpen}
      >
        <IconButton size="small">
          <Filters />
        </IconButton>
        <Typography variant="body2">{selected?.label || title}</Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 200, mt: 1, borderRadius: 2 },
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={22} />
          </Box>
        ) : (
          options.map((opt) => (
            <MenuItem
              key={opt.value}
              onClick={() => handleSelect(opt)}
              selected={selected?.value === opt.value}
            >
              {opt.label}
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default CustomFilterSelect;
