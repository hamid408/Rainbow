import { Box, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import DisplayField from "../DisplayField";
import { useUpdateOrganizationMutation } from "@/src/redux/services/organization/organizationApi";
import CustomButton from "@/src/components/common/CustomButton";
import { toast } from "react-toastify";

const OrganizationConfig = ({ organizationData, editable }: any) => {
  const [transferType, setTransferType] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [agentName, setAgentName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const [updateOrganization, { isLoading: isUpdating }] =
    useUpdateOrganizationMutation();
  useEffect(() => {
    if (organizationData?.data) {
      setTransferType(organizationData.data.transfer_type || "");
      setTransferNumber(organizationData.data.transfer_number?.trim() || "");
      setAgentName(organizationData.data.agent_name || "");
      setOrgName(organizationData.data.organization_name || "");
    }
  }, [organizationData]);

  const handleSave = async () => {
    try {
      await updateOrganization({
        organization_id: organizationData?.data?.organizations_id,
        organization_name: orgName,
        agent_name: agentName,
        transfer_number: transferNumber,
      }).unwrap();

      toast.success("Organization settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update organization settings");
      console.error("Update error:", error);
    }
  };

  return (
    <>
      <Box marginLeft={4} marginRight={4}>
        <DisplayField
          label="Agent Name"
          value={agentName}
          disabled={!editable}
          onChange={(val: string) => {
            setAgentName(val);
            setIsDirty(true);
          }}
        />

        <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />
        <DisplayField
          label="Organization Name"
          value={orgName}
          disabled={!editable}
          onChange={(val: string) => {
            setOrgName(val);
            setIsDirty(true);
          }}
        />

        <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />
        <DisplayField
          label="Transfer Type"
          value={transferType}
          placeholder="Select transfer type"
          disabled={true}
        />

        <Divider sx={{ border: "1px solid #eceff3", marginBlock: "16px" }} />

        <DisplayField
          label="Transfer Number"
          value={transferNumber}
          placeholder="Select number"
          disabled={!editable}
          onChange={(val: string) => {
            setTransferNumber(val);
            setIsDirty(true);
          }}
        />

        {editable && (
          <Box mt={3} display="flex" justifyContent="flex-end">
            <CustomButton
              onClick={handleSave}
              variant="contained"
              disabled={!isDirty || isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Settings"}
            </CustomButton>
          </Box>
        )}
      </Box>
    </>
  );
};

export default OrganizationConfig;
