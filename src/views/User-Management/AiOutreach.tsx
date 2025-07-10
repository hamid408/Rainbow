import { Box, Divider, Typography } from "@mui/material";
import { useState } from "react";
import DisplayField from "./DisplayField";
import TimeSelector from "@/src/utils/TimeSelector";

const AIOutreachSettings = () => {
  const [frequency, setFrequency] = useState("once");
  const [fromTime, setFromTime] = useState("08:00");
  const [toTime, setToTime] = useState("20:00");

  const frequencyOptions = [
    { label: "Once", value: "once" },
    { label: "Twice", value: "twice" },
    { label: "Thrice", value: "thrice" },
  ];

  return (
    <Box p={4} bgcolor="#fff" borderRadius={2} boxShadow={1}>
      <Typography variant="h2" fontSize={24} fontWeight={600} mb={3}>
        AI Outreach Cadence Settings
      </Typography>

      <DisplayField
        label="Frequently AI should attempt contacts"
        value={frequency}
        onChange={setFrequency}
        options={frequencyOptions}
        type="select"
        placeholder="Select frequency"
      />

      <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />
      <Box display="flex" gap={2} width="100%" justifyContent={"space-between"}>
        <Typography
          fontSize={16}
          fontWeight={400}
          width={"100%"}
          color="#0D0D12"
        >
          Set hours to call to respect funeral home
        </Typography>

        <Box display="flex" gap={2} width="100%">
          <TimeSelector value={fromTime} onChange={setFromTime} />
          <TimeSelector label="To" value={toTime} onChange={setToTime} />
        </Box>
      </Box>
    </Box>
  );
};

export default AIOutreachSettings;
