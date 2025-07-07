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
  useGetLeadsEnumsQuery,
  useUpdateLeadMutation,
} from "@/src/redux/services/leads/leadsApi";
import { toast } from "react-toastify";
import CustomSelect from "@/src/components/common/CustomSelect";
import styles from "./style.module.scss";

// const LeadDetailsSidebar = ({ data }: any) => {
const LeadDetailsSidebar = ({
  lead,
  setLead,
}: {
  lead: any;
  setLead: (lead: any) => void;
}) => {
  // const [lead, setLead] = useState(data?.data?.[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [inquiryType, setInquiryType] = useState(lead.inquiry_type || "");
  const [inquiryStatus, setInquiryStatus] = useState(lead.inquiry_status || "");
  const [tag, setTag] = useState(lead.tag || "");
  const [notes, setNotes] = useState(lead.notes || "");

  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const { data: enumsData, refetch } = useGetLeadsEnumsQuery();

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
      }).unwrap();

      // setLead((prev: any) => ({
      //   ...prev,
      //   inquiry_type: inquiryType,
      //   inquiry_status: inquiryStatus,
      //   tag,
      //   notes,
      // }));
      setLead({
        ...lead,
        inquiry_type: inquiryType,
        inquiry_status: inquiryStatus,
        tag,
        notes,
      });
      setIsEditing(false);
      refetch();
      toast.success("Lead updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update lead. Please try again.");
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
          <Box className = {styles.leadDetailPhoneEmail}>
            <SmallPhone />
            <Typography variant="body2" color="#666D80">
              Phone Number
            </Typography>
          </Box>
          <Typography variant="body2" color="#0D0D12" fontWeight={600}>
            {lead.phone || "N/A"}
          </Typography>
        </Box>

        <Box>
          <Box className = {styles.leadDetailPhoneEmail}>
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
          <Box className = {styles.leadDetailPhoneEmail}>
            <Inquiry />
            <Typography variant="body2" color="#666D80">
              Inquiry Type
            </Typography>
          </Box>
          {isEditing ? (
            <CustomSelect
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
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
              onChange={(e) => setInquiryStatus(e.target.value)}
              options={inquiryStatusOptions}
              placeholder="Select status"
            />
          ) : (
            // <Chip
            //   label={lead.inquiry_status || "Unknown"}
            //   size="medium"
            //   sx={{
            //     background: "#FFF0F3",
            //     color: "#36394A",
            //     fontSize: "14px",
            //     fontWeight: 600,
            //   }}
            //   icon={<Urgent />}
            // />
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
              // label="Select Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              options={tagOptions}
              placeholder="Select tag"
            />
          ) : (
            // <Typography variant="body2" color="#0062FF" fontWeight={500}>
            //   {lead.tag || "N/A"}
            // </Typography>
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
          <Box className = {styles.leadDetailPhoneEmail}>
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
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note"
            sx={{
              // "& .MuiOutlinedInput-root": {
              //   borderRadius: "12px",
              //   fontSize: "16px",
              //   fontWeight: 400,
              //   backgroundColor: "#fff",
              //   "&.Mui-disabled": {
              //     WebkitTextFillColor: "#000", // ✅ makes text look black even if disabled
              //     color: "#000",
              //     opacity: 1, // ✅ keeps text full contrast
              //   },
              // },
              "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-input": {
                WebkitTextFillColor: "#0D0D12", // ✅ dark text in disabled mode
                opacity: 1,
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "16px",
                fontWeight: 400,
                color: "#000", // ✅ ensures active and editable color is black
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#999", // ✅ optional: use light grey placeholder like Figma
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
    </Box>
  );
};

export default LeadDetailsSidebar;
