"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  Call,
  Cold,
  Inquiry,
  Notes,
  SmallMail,
  SmallPhone,
  Urgent,
} from "@/src/assests/icons";
import {
  useDeleteLeadMutation,
  useGetLeadsEnumsQuery,
  useUpdateLeadMutation,
} from "@/src/redux/services/leads/leadsApi";
import { toast } from "react-toastify";
import CustomSelect from "@/src/components/common/CustomSelect";
import styles from "./style.module.scss";
import CustomTextField from "@/src/components/common/CustomTextfield";
import CustomButton from "@/src/components/common/CustomButton";
import { useRouter } from "next/navigation";

// const LeadDetailsSidebar = ({ data }: any) => {
const LeadDetailsSidebar = ({
  lead,
  setLead,
}: {
  lead: any;
  setLead: (lead: any) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inquiryType, setInquiryType] = useState(lead.inquiry_type || "");
  const [inquiryStatus, setInquiryStatus] = useState(lead.inquiry_status || "");
  const [tag, setTag] = useState(lead.tag || "");
  const [notes, setNotes] = useState(lead.notes || "");
  const [phone, setPhone] = useState(lead.phone || "");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const { data: enumsData, refetch } = useGetLeadsEnumsQuery();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  const router = useRouter();
  const inquiryTypeOptions = useMemo(
    () =>
      enumsData?.inquiry_types?.map((type: string) => ({
        label: type,
        value: type,
      })) || [],
    [enumsData]
  );

  const inquiryStatusOptions = useMemo(
    () =>
      enumsData?.inquiry_status?.map((status: string) => ({
        label: status,
        value: status,
      })) || [],
    [enumsData]
  );

  const tagOptions = useMemo(
    () =>
      enumsData?.tags?.map((tagItem: string) => ({
        label: tagItem,
        value: tagItem,
      })) || [],
    [enumsData]
  );

  const handleSave = async () => {
    try {
      const response = await updateLead({
        lead_id: lead.lead_id,
        inquiry_type: inquiryType,
        inquiry_status: inquiryStatus,
        tag,
        notes,
        phone,
      }).unwrap();

      setLead({
        ...lead,
        inquiry_type: inquiryType,
        inquiry_status: inquiryStatus,
        tag,
        notes,
        phone,
      });
      setIsEditing(false);
      refetch();
      toast.success("Lead updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update lead. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLead({
        lead_id: lead.lead_id,
      }).unwrap();
      toast.success("Lead Successfully Deleted!!");
      setIsConfirmOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to Delete the lead:", error);
      toast.error("Failed to Delete lead. Try again.");
    }
  };
  const tagStatus = (lead.tag || "").toLowerCase().trim();

  return (
    <Box className={styles.leadDetails}>
      <Box className={styles.leadDetailTopIcon}>
        <Typography fontWeight={600} variant="h5" color="#0D0D12">
          Lead Details
        </Typography>
        <IconButton onClick={() => setIsEditing(!isEditing)}>
          <Edit />
        </IconButton>
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="body2" color="#666D80" mb={1}>
            Name
          </Typography>
          <Typography variant="body2" color="#0D0D12" fontWeight={600}>
            {lead.first_name} {lead.last_name}
          </Typography>
        </Box>

        <Box>
          <Box className={styles.leadDetailPhoneEmail}>
            <SmallPhone />
            <Typography variant="body2" color="#666D80">
              Phone Number
            </Typography>
          </Box>

          {isEditing ? (
            <CustomTextField
              value={phone}
              onChange={(e: any) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          ) : (
            <Typography variant="body2" color="#0D0D12" fontWeight={600}>
              {lead.phone || "N/A"}
            </Typography>
          )}
        </Box>

        <Box>
          <Box className={styles.leadDetailPhoneEmail}>
            <SmallMail />
            <Typography variant="body2" color="#666D80">
              Email
            </Typography>
          </Box>
          <Typography variant="body2" color="#0D0D12" fontWeight={600}>
            {lead.email || "N/A"}
          </Typography>
        </Box>

        <Box>
          <Box className={styles.leadDetailPhoneEmail}>
            <Inquiry />
            <Typography variant="body2" color="#666D80">
              Inquiry Type
            </Typography>
          </Box>
          {isEditing ? (
            <CustomSelect
              value={inquiryType}
              onChange={(e: any) => setInquiryType(e.target.value)}
              options={inquiryTypeOptions}
              placeholder="Select inquiry type"
            />
          ) : (
            <Typography variant="body2" color="#0062FF" fontWeight={500}>
              {lead.inquiry_type || "N/A"}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="body2" color="#666D80" mb={1}>
            Status
          </Typography>
          {isEditing ? (
            <CustomSelect
              // label="Select Status"
              value={inquiryStatus}
              onChange={(e: any) => setInquiryStatus(e.target.value)}
              options={inquiryStatusOptions}
              placeholder="Select status"
            />
          ) : (
            <Typography variant="body2" color="#0062FF" fontWeight={500}>
              {lead.inquiry_status || "N/A"}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="body2" color="#666D80" mb={1}>
            Tag
          </Typography>
          {isEditing ? (
            <CustomSelect
              value={tag}
              onChange={(e: any) => setTag(e.target.value)}
              options={tagOptions}
              placeholder="Select tag"
            />
          ) : (
            <Chip
              label={lead.tag || "Unknown"}
              size="medium"
              sx={{
                background: "#FFF0F3",
                color: "#36394A",
                fontSize: "14px",
                fontWeight: 600,
              }}
              icon={tagStatus === "hot" ? <Urgent /> : <Cold />}
            />
          )}
        </Box>

        <Box>
          <Box className={styles.leadDetailPhoneEmail}>
            <Notes />
            <Typography variant="body2" color="#666D80" fontSize={16}>
              Notes
            </Typography>
          </Box>
          <TextField
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            disabled={!isEditing}
            value={notes}
            onChange={(e: any) => setNotes(e.target.value)}
            placeholder="Add a note"
            sx={{
              "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-input": {
                WebkitTextFillColor: "#0D0D12",
                opacity: 1,
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "16px",
                fontWeight: 400,
                color: "#000",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#999",
                fontWeight: 400,
                fontSize: "14px",
              },
            }}
          />
        </Box>

        {isEditing && (
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(false)}
              sx={{ marginRight: 2 }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </Box>
        )}
      </Stack>
      <Box
        sx={{
          marginTop: 4.5,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <CustomButton
          variant="contained"
          background="rgba(212, 10, 10, 1)"
          padding="10px 20px"
          onClick={() => setIsConfirmOpen(true)}
        >
          Delete Lead
        </CustomButton>
      </Box>
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        PaperProps={{ sx: { padding: "14px 10px" } }}
      >
        <DialogTitle sx={{ fontSize: "18px", fontWeight: 500, pb: 0 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Are you sure you want to Delete this lead?
          </Typography>
        </DialogTitle>

        <DialogActions
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            pt: 0,
          }}
        >
          <CustomButton
            onClick={() => setIsConfirmOpen(false)}
            variant="outlined"
          >
            Cancel
          </CustomButton>

          <CustomButton
            onClick={handleConfirmDelete}
            variant="contained"
            background="red"
            disabled={isDeleting}
            sx={{
              minWidth: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadDetailsSidebar;
