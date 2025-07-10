import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import DisplayField from "./DisplayField";

const SettingsPanel = () => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // alert("Copied to clipboard!");
  };

  return (
    <Box p={4} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h2" fontSize={24} fontWeight={600} mb={3}>
        Twilio Integration Settings
      </Typography>

      <DisplayField
        label="Twilio Phone Number"
        value="+123 456 0000"
        showCopyIcon={true}
        onCopy={() => handleCopy("+123 456 0000")}
      />
      <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

      <DisplayField
        label="Account SID"
        value="Aadsadihdujasfh19283cq1m2189"
        showCopyIcon={true}
        onCopy={() => handleCopy("Aadsadihdujasfh19283cq1m2189")}
      />
      {/*  */}
    </Box>
  );
};

export default SettingsPanel;
