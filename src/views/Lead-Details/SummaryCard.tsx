import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Box, Typography, IconButton, Paper, Collapse } from "@mui/material";
const SummaryCard = ({ summary, flaggedText }: any) => {
  const [open, setOpen] = React.useState(false);
  return (
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
  );
};

export default SummaryCard;
