import { Box, Divider, Typography } from "@mui/material";
import { useState } from "react";
import DisplayField from "./DisplayField";
import TimeSelector from "@/src/utils/TimeSelector";

const TemplateSetting = () => {
  const [frequency, setFrequency] = useState("Casual");
  const [fromTime, setFromTime] = useState("08:00");
  const [toTime, setToTime] = useState("20:00");

  // const frequencyOptions = [
  //   { label: "Casual", value: "once" },
  //   { label: "Twice", value: "twice" },
  //   { label: "Thrice", value: "thrice" },
  // ];

  return (
    <Box p={4} bgcolor="#fff" borderRadius={2} >
      <Typography variant="h2" fontSize={24} fontWeight={600} mb={3}>
        Templates and Tone Settings{" "}
      </Typography>

      <DisplayField
        label="Set tone for the AI’s communications"
        value={frequency}
        placeholder="Casual"
        disabled
      />

    </Box>
  );
};

export default TemplateSetting;
