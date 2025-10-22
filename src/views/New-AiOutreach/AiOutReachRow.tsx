

"use client";
import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";

interface AiOutReachRowProps {
  name: string;
  status: string;
  checked: boolean;
  onCheck: () => void;
}

const AiOutReachRow: React.FC<AiOutReachRowProps> = ({
  name,
  status,
  checked,
  onCheck,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #E4E4E4",
        "&:hover": { backgroundColor: "#fafafa" },
      }}
    >
      <Box sx={{ flex: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Checkbox checked={checked} onChange={onCheck} />
        <Typography fontWeight={500}>{name}</Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography color="text.secondary">{status}</Typography>
      </Box>
    </Box>
  );
};

export default AiOutReachRow;
