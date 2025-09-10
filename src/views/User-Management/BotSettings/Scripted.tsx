"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";

const Scripted = ({ cloudfrontUrl }: any) => {
  const [type, setType] = useState("iframe");

  const snippets: Record<string, string> = {
    iframe: `<iframe src="${
      cloudfrontUrl || "https://placeholder.com"
    }" width="400" height="500" frameborder="0"></iframe>`,
    script: `<script src="${
      cloudfrontUrl || "https://placeholder.com"
    }/chatbot.js"></script>`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[type]);
    toast.success("Embed code copied to clipboard!"); // 👈 toaster message
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        width: "100%",
        marginTop: 4,
        marginBottom: 8,
        boxShadow: 3,
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Get Your Embed Code
      </Typography>

      {/* Dropdown */}
      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
        sx={{ maxWidth: 200 }}
      >
        <MenuItem value="iframe">Iframe</MenuItem>
        <MenuItem value="script">Script</MenuItem>
      </Select>

      {/* Code Box */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          bgcolor: "#f5f5f5",
          fontFamily: "monospace",
          position: "relative",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {snippets[type]}
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default Scripted;
