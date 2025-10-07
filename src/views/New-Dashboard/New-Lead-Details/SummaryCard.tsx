"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CustomSelect from "@/src/components/common/CustomSelect";

type SummaryCardProps = {
  name: string;
  status: string;
  summary: string;
  flaggedText?: string;
};
const actionsData = [
  { label: "1", value: "once" },
  { label: "2", value: "twice" },
  { label: "3", value: "thrice" },
];
const SummaryCard: React.FC<SummaryCardProps> = ({
  name,
  status,
  summary,
  flaggedText,
}) => {
  const [open, setOpen] = React.useState(true);
  const [actions, setActions] = React.useState(actionsData[0].value);
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={3.8}>
          <Typography
            variant="h6"
            fontWeight={600}
            fontSize={23}
            color="#0D0D12"
          >
            {name}
          </Typography>
          <Box display={"flex"} alignItems="center" gap={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#D3C4FC",
              }}
            />
            <Typography
              variant="body2"
              color="#090909"
              fontSize={13}
              fontWeight={400}
            >
              {status}
            </Typography>
          </Box>
        </Box>
        <Box minWidth={150}>
          <CustomSelect
            value={actions}
            onChange={(e: any) => setActions(e.target.value)}
            options={actionsData}
          />
        </Box>
      </Box>

      {/* Summary Box */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#FFEAA5",
          borderRadius: 1.2,
          p: 2,
          borderColor: "#E9D288",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            fontSize={16}
            color="#0D0D12"
          >
            Summary
          </Typography>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={open}>
          <Typography
            variant="body2"
            color="text.primary"
            fontSize={14}
            fontWeight={400}
          >
            {summary}
          </Typography>
          {flaggedText && (
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ mt: 0.5 }}
              color="text.primary"
              fontSize={14}
            >
              {flaggedText}
            </Typography>
          )}
        </Collapse>
      </Paper>
    </Box>
  );
};

export default SummaryCard;
