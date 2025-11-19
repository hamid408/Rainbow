"use client";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
} from "@mui/material";
import CustomButton from "@/src/components/common/CustomButton";
import React, { useState } from "react";

interface AddCampaignModalProps {
  open: boolean;
  onClose: () => void;
  selectedLeads: any[];
}

const AddCampaignModal = ({
  open,
  onClose,
  selectedLeads,
}: AddCampaignModalProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState("");

  // Dummy campaign list
  const dummyCampaigns = [
    "Campaign A",
    "Campaign B",
    "Campaign C",
    "Campaign D",
  ];

  const handleAssign = () => {
    console.log("Selected Leads:", selectedLeads);
    console.log("Selected Campaign:", selectedCampaign);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Select Campaign</DialogTitle>

      <DialogContent>
        <Box mt={2}>
          <select
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            <option value="" disabled>
              Select a campaign
            </option>

            {dummyCampaigns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Box>

        <Box mt={3} display="flex" justifyContent="end" gap={2}>
          <CustomButton variant="outlined" onClick={onClose}>
            Cancel
          </CustomButton>

          <CustomButton
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedCampaign}
          >
            Assign
          </CustomButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddCampaignModal;
