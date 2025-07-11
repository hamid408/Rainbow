import { Box, Divider, Typography } from "@mui/material";
import { useState } from "react";
import DisplayField from "./DisplayField";
import TimeSelector from "@/src/utils/TimeSelector";

const TemplateSetting = () => {
  const [frequency, setFrequency] = useState("once");
  const [fromTime, setFromTime] = useState("08:00");
  const [toTime, setToTime] = useState("20:00");

  const frequencyOptions = [
    { label: "Once", value: "once" },
    { label: "Twice", value: "twice" },
    { label: "Thrice", value: "thrice" },
  ];

  return (
    <Box p={4} bgcolor="#fff" borderRadius={2} >
      <Typography variant="h2" fontSize={24} fontWeight={600} mb={3}>
        Templates and Tone Settings{" "}
      </Typography>

      <DisplayField
        label="Set tone for the AI’s communications"
        value={frequency}
        onChange={setFrequency}
        options={frequencyOptions}
        type="select"
        placeholder="Select frequency"
      />

    </Box>
  );
};

export default TemplateSetting;
