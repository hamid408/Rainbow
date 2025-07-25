"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Popper,
  Paper,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { Copy } from "@/assests/icons";
import { DigitalClock } from "@mui/x-date-pickers";
import CustomSelect from "@/components/common/CustomSelect"; // your custom select
import dayjs from "dayjs";
import CustomTextField from "@/components/common/CustomTextfield";

const DisplayField = ({
  label,
  value,
  type = "text",
  options = [],
  onChange,
  showCopyIcon = false,
  onCopy,
  placeholder,
  disabled,
}: any) => {
  const [copied, setCopied] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCopy = () => {
    if (onCopy) onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTimeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      my={1}
      justifyContent={"space-between"}
    >
      <Box flex={1} width={"100%"}>
        <Typography
          fontSize={16}
          fontWeight={400}
          width={"100%"}
          color="#0D0D12"
        >
          {label}
        </Typography>
      </Box>

      <Box flex={1} display="flex" alignItems="center">
        {type === "select" ? (
          <CustomSelect
            value={value}
            onChange={(e: any) => onChange(e.target.value)}
            options={options}
            placeholder={placeholder}
          />
        ) : (
          <CustomTextField
            value={value ?? ""}
            fullWidth
            onChange={(e) => onChange && onChange(e.target.value)}
            size="small"
            disabled={disabled}
            variant="outlined"
            // use empty string if undefined/null
            placeholder={!disabled && placeholder ? placeholder : "N/A"}
            width={"100%"}
          />
        )}

        {showCopyIcon && type === "text" && (
          <IconButton onClick={handleCopy} sx={{ ml: 1 }}>
            {copied ? <Check fontSize="small" /> : <Copy fontSize="small" />}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default DisplayField;
