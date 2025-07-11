// "use client";
// import { Box, Divider, Typography } from "@mui/material";
// import { useState } from "react";
// import DisplayField from "./DisplayField";
// import TimeSelector from "@/src/utils/TimeSelector";

// const AIOutreachSettings = ({ data }: any) => {
//   const [frequency, setFrequency] = useState("once");
//   const [fromTime, setFromTime] = useState("08:00");
//   const [toTime, setToTime] = useState("20:00");

//   const frequencyOptions = [
//     { label: "1", value: "once" },
//     { label: "2", value: "twice" },
//     { label: "3", value: "thrice" },
//   ];
//   if (!data) return null;
//   const aiData = data?.data || {};

//   return (
//     <Box p={4} bgcolor="#fff" borderRadius={2}>
//       <Typography variant="h2" fontSize={24} fontWeight={600} mb={3}>
//         AI Outreach Cadence Settings
//       </Typography>

//       <DisplayField
//         label="Frequently AI should attempt contacts"
//         value={frequency}
//         onChange={setFrequency}
//         options={frequencyOptions}
//         type="select"
//         placeholder="Select frequency"
//       />

//       <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />
//       <Box display="flex" gap={2} width="100%" justifyContent={"space-between"}>
//         <Typography
//           fontSize={16}
//           fontWeight={400}
//           width={"100%"}
//           color="#0D0D12"
//         >
//           Set hours to call to respect funeral home
//         </Typography>

//         <Box display="flex" gap={2} width="100%">
//           <TimeSelector value={aiData} onChange={setFromTime} />
//           <TimeSelector label="To" value={toTime} onChange={setToTime} />
//         </Box>
//       </Box>
//       <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

//       <DisplayField
//         label="Time Zone"
//         value={aiData.time_zone || "America/New_York"}
//         // type="select"
//         placeholder="Select time zone"
//       />
//       <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />
//       <DisplayField
//         label="Transfer Type"
//         value={aiData.transfer_type || "Call"}
//         placeholder="Select transfer type"
//       />
//       <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />
//       <DisplayField
//         label="Transfer Number"
//         value={aiData.transfer_number || "+1234567890"}

//         placeholder="Select number"
//       />
//       {/* <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} /> */}
//     </Box>
//   );
// };

// export default AIOutreachSettings;
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import DisplayField from "./DisplayField";
import TimeSelector from "@/src/utils/TimeSelector";
import CustomButton from "@/src/components/common/CustomButton";
import { useUpdateOrganizationMutation } from "@/src/redux/services/organization/organizationApi";
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
  const [transferType, setTransferType] = useState(aiData.transfer_type || "");
  const [transferNumber, setTransferNumber] = useState(
    aiData.transfer_number || ""
  );

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
        transfer_number: transferNumber,
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

      <DisplayField
        label="Transfer Type"
        value={transferType}
        onChange={editable ? setTransferType : undefined}
        placeholder="Select transfer type"
        disabled={true}
      />

      <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

      <DisplayField
        label="Transfer Number"
        value={transferNumber}
        onChange={editable ? setTransferNumber : undefined}
        placeholder="Select number"
        disabled={!editable}
      />

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
