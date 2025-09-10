"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import CustomButton from "@/src/components/common/CustomButton";
import { useForm } from "react-hook-form";
import { inquiryStatuses, inquiryTypes, tags } from "./data";
import CustomTextField from "@/src/components/common/CustomTextfield";
import { CloseRounded } from "@mui/icons-material";
import CustomSelect from "@/src/components/common/CustomSelect";
import { Controller } from "react-hook-form";
import {
  useCreateLeadMutation,
  useGetLeadsEnumsQuery,
} from "@/src/redux/services/leads/leadsApi";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import CSVUploader from "./CsvFile";
import CustomTabs from "@/src/components/common/CustomTabs";

const AddLeadModal = ({
  open,
  onClose,
  refetchLeads,
}: {
  open: boolean;
  onClose: () => void;
  refetchLeads: () => void;
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();
  const { data: enumsData, refetch } = useGetLeadsEnumsQuery();
  const [bulkMode, setBulkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Single Lead");

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
  const timeZoneOptions = useMemo(
    () =>
      enumsData?.time_zone?.map((time: string) => ({
        label: time,
        value: time,
      })) || [],
    [enumsData]
  );
  // timeZoneOptions
  const [createLead, { isLoading }] = useCreateLeadMutation();

  const onSubmit = async (data: any) => {
    try {
      const payload = [data];
      await createLead(payload).unwrap();
      toast.success("Lead created successfully!");
      onClose();
      reset();
      refetchLeads();
    } catch (error) {
      console.error("Failed to create lead:", error);
      toast.error("Failed to create lead");
    }
  };
  // const handleBulkSubmit = async (dataArray: any[]) => {
  //   try {
  //     await createLead(dataArray).unwrap();
  //     toast.success("Bulk leads uploaded successfully!");
  //     onClose();
  //     refetchLeads();
  //   } catch (error) {
  //     console.error("Bulk lead upload failed:", error);
  //     toast.error("Failed to upload bulk leads.");
  //   }
  // };
  const handleBulkSubmit = async (dataArray: any[]) => {
    const chunkSize = 25;

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const chunks = [];
    for (let i = 0; i < dataArray.length; i += chunkSize) {
      chunks.push(dataArray.slice(i, i + chunkSize));
    }

    try {
      for (let i = 0; i < chunks.length; i++) {
        await createLead(chunks[i]).unwrap();
        toast.success(`Uploaded batch ${i + 1} of ${chunks.length}`);
        await delay(200);
      }
      toast.success("All leads uploaded successfully!");
      onClose();
      refetchLeads();
    } catch (error) {
      console.error("Bulk lead upload failed:", error);
      toast.error("Failed to upload some or all leads.");
    }
  };

  useEffect(() => {
    if (open) {
      setActiveTab("Single Lead");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        pr={4}
      >
        <DialogTitle>
          <CustomTabs
            tabs={[{ label: "Single Lead" }, { label: "Bulk Upload" }]}
            onTabChange={(label) => setActiveTab(label)}
            activeColor="#8647F5"
          />
        </DialogTitle>
        <CloseRounded onClick={onClose} sx={{ cursor: "pointer" }} />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: "22px 28px", minHeight: "450px" }}>
          {activeTab === "Bulk Upload" ? (
            <Box display="flex" flexDirection="column" gap={2} mt={-2}>
              <Typography variant="h3" fontWeight={600} sx={{ mb: 4 }}>
                Add Bulk Lead
              </Typography>
              <CSVUploader onBulkSubmit={handleBulkSubmit} />
            </Box>
          ) : (
            <Box mt={-2}>
              <Typography variant="h3" fontWeight={600} sx={{ mb: 4 }}>
                Add New Lead
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <CustomTextField
                  label="First Name"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  placeholder="Enter first name"
                  error={!!errors.first_name}
                  helperText={
                    errors.first_name ? String(errors.first_name.message) : ""
                  }
                />

                <CustomTextField
                  label="Last Name"
                  {...register("last_name")}
                  placeholder="Enter Last name"
                />
                <CustomTextField
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email ? String(errors.email.message) : ""}
                />
                <CustomTextField
                  label="Phone"
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="Enter phone number"
                  error={!!errors.phone}
                  helperText={errors.phone ? String(errors.phone.message) : ""}
                />
                <Controller
                  name="inquiry_type"
                  control={control}
                  rules={{ required: "Inquiry type is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      label="Inquiry Type"
                      placeholder="Select inquiry type"
                      value={field.value}
                      onChange={field.onChange}
                      options={inquiryTypeOptions}
                      error={!!errors.inquiry_type}
                      helperText={
                        errors.inquiry_type
                          ? String(errors.inquiry_type.message)
                          : ""
                      }
                    />
                  )}
                />
                <Controller
                  name="inquiry_status"
                  control={control}
                  rules={{ required: "Inquiry status is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      label="Inquiry Status"
                      placeholder="Select inquiry status"
                      value={field.value}
                      onChange={field.onChange}
                      options={inquiryStatusOptions}
                      error={!!errors.inquiry_status}
                      helperText={
                        errors.inquiry_status
                          ? String(errors.inquiry_status.message)
                          : ""
                      }
                    />
                  )}
                />

                <Controller
                  name="tag"
                  control={control}
                  rules={{ required: "Tag is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      label="Tag"
                      placeholder="Select tag"
                      value={field.value}
                      onChange={field.onChange}
                      options={tagOptions}
                      error={!!errors.tag}
                      helperText={errors.tag ? String(errors.tag.message) : ""}
                    />
                  )}
                />

                <CustomTextField
                  label="Notes"
                  placeholder="Add any notes or comments"
                  {...register("notes")}
                />

                <Controller
                  name="time_zone"
                  control={control}
                  // rules={{ required: "time zone is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      label="Time Zone"
                      placeholder="Select Time Zone"
                      value={field.value}
                      onChange={field.onChange}
                      options={timeZoneOptions}
                      error={!!errors.time_zone}
                      helperText={
                        errors.time_zone ? String(errors.time_zone.message) : ""
                      }
                    />
                  )}
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        {activeTab === "Single Lead" && (
          <DialogActions sx={{ p: "16px 24px" }}>
            <CustomButton onClick={onClose} variant="outlined">
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="contained"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Add Lead"
              )}
            </CustomButton>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
};

export default AddLeadModal;
