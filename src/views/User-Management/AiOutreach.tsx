
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import DisplayField from "./DisplayField";
import TimeSelector from "@/utils/TimeSelector";
import CustomButton from "@/components/common/CustomButton";
import { useUpdateOrganizationMutation } from "@/redux/services/organization/organizationApi";
import { toast } from "react-toastify";

const AIOutreachSettings = ({
  data,
  editable = false,
  organizationsId,
}: any) => {
  const aiData = data?.data || {};

  const convert24HourNumberToTimeString = (num: number): string => {
    const hours = Math.floor(num / 100)
      .toString()
      .padStart(2, "0");
    const minutes = (num % 100).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [frequency, setFrequency] = useState("once");
  const [fromTime, setFromTime] = useState("08:00");
  const [toTime, setToTime] = useState("20:00");
  const [timeZone, setTimeZone] = useState(aiData.time_zone || "");
 

  const [updateOrganization, { isLoading: isUpdating }] =
    useUpdateOrganizationMutation();

  useEffect(() => {
    if (aiData?.preferred_calling_window) {
      try {
        const [from, to] = JSON.parse(aiData.preferred_calling_window);
        setFromTime(convert24HourNumberToTimeString(from));
        setToTime(convert24HourNumberToTimeString(to));
      } catch (e) {
        console.warn("Invalid preferred_calling_window format");
      }
    }
  }, [aiData]);

  const frequencyOptions = [
    { label: "1", value: "once" },
    { label: "2", value: "twice" },
    { label: "3", value: "thrice" },
  ];
  const convertTo24HourNumber = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 100 + minutes;
  };

  const fromTimeValue = convertTo24HourNumber(fromTime);
  const toTimeValue = convertTo24HourNumber(toTime);

  const handleSave = async () => {
    try {
      await updateOrganization({
        organization_id: organizationsId,
        organization_time_zone: timeZone,
        organization_preferred_calling_window: [fromTimeValue, toTimeValue],
      }).unwrap();

      toast.success("Organization settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update organization settings");
      console.error("Update error:", error);
    }
  };

  return (
    <Box p={4} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h2" fontSize={24} fontWeight={600} mb={3}>
        AI Outreach Cadence Settings
      </Typography>

      <DisplayField
        label="Frequently AI should attempt contacts"
        value={frequency}
        onChange={editable ? setFrequency : undefined}
        options={frequencyOptions}
        type="select"
        placeholder="Select frequency"
        disabled={!editable}
      />

      <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

      <Box display="flex" gap={2} width="100%" justifyContent="space-between">
        <Typography fontSize={16} fontWeight={400} width="100%" color="#0D0D12">
          Set hours to call to respect funeral home
        </Typography>

        <Box display="flex" gap={2} width="100%">
          {editable ? (
            <TimeSelector
              value={fromTime}
              onChange={setFromTime}
              disabled={false}
            />
          ) : (
            <TimeSelector
              value={fromTime}
              onChange={() => {}}
              disabled={true}
            />
          )}
          {editable ? (
            <TimeSelector
              label="To"
              value={toTime}
              onChange={setToTime}
              disabled={false}
            />
          ) : (
            <TimeSelector
              label="To"
              value={toTime}
              onChange={() => {}}
              disabled={true}
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

      <DisplayField
        label="Time Zone"
        value={timeZone}
        onChange={editable ? setTimeZone : undefined}
        placeholder="Select time zone"
        disabled={!editable}
      />

      <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

    
      {editable && (
        <Box mt={3} display="flex" justifyContent="flex-end">
          <CustomButton
            onClick={handleSave}
            variant="contained"
            disabled={editable ? isUpdating : true}
          >
            {isUpdating ? "Saving..." : "Save Settings"}
          </CustomButton>
        </Box>
      )}
    </Box>
  );
};

export default AIOutreachSettings;
