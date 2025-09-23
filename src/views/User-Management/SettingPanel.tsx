"use client";
import React from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import DisplayField from "./DisplayField";
import styles from "./styles.module.scss";

const SettingsPanel = ({ data }: any) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  if (!data) return <CircularProgress />;
  const settingData = data?.data || {};
  return (
    <Box className={styles.settingPanelMainBox}>
      <Typography variant="h2" fontSize={24} fontWeight={600} mb={3}>
        Twilio Integration Settings
      </Typography>

      <DisplayField
        label="Twilio Phone Number"
        value={settingData?.twilio_phone_num || "+123 456 0000"}
        showCopyIcon={true}
        onCopy={() => handleCopy(settingData?.twilio_phone_num)}
        disabled
      />
      <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

      <DisplayField
        label="Account SID"
        value={settingData.twilio_account_sid || "ACXXXXXXXXXXXXXXXXXXXXXXXXX"}
        showCopyIcon={true}
        onCopy={() => handleCopy(settingData.twilio_account_sid)}
        disabled
      />
      {/*  */}
    </Box>
  );
};

export default SettingsPanel;
