"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddNewUserModal from "./AddUserModal";
import { tabItems } from "./data";
import CustomButton from "@/src/components/common/CustomButton";
import CustomTabs from "@/src/components/common/CustomTabs";
import { Add, DeleteOutline } from "@mui/icons-material";
import SettingsPanel from "./SettingPanel";
import {
  useDeactivateUserMutation,
  useGetCurrentUserQuery,
  useGetUsersQuery,
} from "@/src/redux/services/users/usersApi";
import { toast } from "react-toastify";
import AIOutreachSettings from "./AiOutreach";
import { useGetOrganzationQuery } from "@/src/redux/services/organization/organizationApi";
import TemplateSetting from "./TemplateSetting";
import AdminDashboard from "./AdminDashboard";
import styles from "./styles.module.scss";
import CSVUploader from "../Dashboard/CsvFile";
import AgentConfiguration from "./Configurations";
import DisplayField from "./DisplayField";

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeTab, setActiveTab] = useState("Admin Dashboard");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetCurrentUserQuery();
  const organizationsId = userData?.data?.[0].organizations_id;

  const { data: organizationData, isLoading: isOrgLoading } =
    useGetOrganzationQuery(
      { organization_id: organizationsId },
      { skip: !organizationsId }
    );

  const {
    data: users,
    isLoading: isUsersLoading,
    isError,
    refetch,
  } = useGetUsersQuery();

  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();

  const handleDeactivate = async (email: string) => {
    try {
      await deactivateUser({ email }).unwrap();
      refetch();
      toast.success("User deactivated successfully");
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };
  if (isOrgLoading || userLoading) {
    return (
      <Box sx={{ padding: "48px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box className={styles.indexRoot}>
        <Box className={styles.indexHeadingBox}>
          <Typography variant="h1" className={styles.indexHeading}>
            Admin Oversight
          </Typography>
        </Box>
        <Box marginBlock={4}>{/* <AdminDashboard/> */}</Box>

        <Box className={styles.indexCustomTabBox}>
          <CustomTabs
            tabs={tabItems}
            onTabChange={(label: any) => setActiveTab(label)}
          />
        </Box>
        <Box>
          {activeTab === "Agent Configuration" && (
            <Box mt={3}>
              <AgentConfiguration data={organizationData} editable />
            </Box>
          )}
        </Box>
        {activeTab === "Settings & Configuration" && (
          <>
            <Box mb={4} mt={3}>
              <SettingsPanel data={organizationData} />
              <Divider />
            </Box>
            <Box mb={4}>
              <AIOutreachSettings
                data={organizationData}
                editable
                organizationsId={organizationsId}
              />
              <Divider />
            </Box>
            <Divider
              sx={{ border: "1px solid #eceff3", marginBlock: "16px" }}
            />

            <Box
              p={4}
              bgcolor="#fff"
              borderRadius={2}
              boxShadow={1}
              mt={2}
              className={styles.UserDetails}
            >
              <Typography
                variant="h6"
                gutterBottom
                fontSize={24}
                fontWeight={600}
              >
                User Management
              </Typography>
              <Box sx={{ height: "350px", overflowY: "auto" }}>
                <Box mt={2}>
                  {isUsersLoading && <CircularProgress size={24} />}
                  {isError && (
                    <Typography color="error">Failed to load users.</Typography>
                  )}
                  {users?.data?.length > 0 &&
                    users.data.map((user: any, index: number) => (
                      <Box key={index}>
                        <Box className={styles.userManagementRowBox}>
                          <Box className={styles.nameAndEmailBox}>
                            <Box flex={1} className={styles.nameBox}>
                              <Typography fontWeight={400} fontSize={16}>
                                {user.name || user.first_name}
                              </Typography>
                            </Box>
                            <Box className={styles.userManagementEmailBox}>
                              <MailOutlineIcon
                                fontSize="small"
                                sx={{ color: "#888" }}
                              />
                              <Typography className={styles.emailTypo}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider className={styles.myDivider}></Divider>
                          <Box className={styles.roleAndRemoveBox}>
                            <Box className={styles.roleBox}>
                              <Typography className={styles.userTypo}>
                                {user.role || "—"}
                              </Typography>
                            </Box>
                            <Box
                              className={styles.removeBox}
                              onClick={() => {
                                setSelectedUserEmail(user.email);
                                setConfirmOpen(true);
                              }}
                            >
                              <DeleteOutline />
                            </Box>
                          </Box>
                        </Box>
                        {index !== users.length - 1 && <Divider />}
                      </Box>
                    ))}
                </Box>
                <AddNewUserModal
                  open={open}
                  onClose={handleClose}
                  refetchUsers={refetch}
                />
              </Box>

              <Box mt={2}>
                <CustomButton
                  variant="outlined"
                  color="primary"
                  onClick={handleOpen}
                  startIcon={<Add />}
                  className={styles.addBtn}
                >
                  Add New Solo User
                </CustomButton>
              </Box>
            </Box>
          </>
        )}
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          PaperProps={{
            sx: {
              padding: "14px 10px",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              paddingBottom: 0,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Are you sure you want to deactivate this user?
            </Typography>
          </DialogTitle>

          <DialogActions
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              paddingTop: 0,
            }}
          >
            <CustomButton
              onClick={() => {
                setConfirmOpen(false);
                setSelectedUserEmail(null);
              }}
              variant="outlined"
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={async () => {
                if (selectedUserEmail) {
                  await handleDeactivate(selectedUserEmail);
                  setConfirmOpen(false);
                  setSelectedUserEmail(null);
                }
              }}
              variant="contained"
              background="red"
              disabled={isDeactivating}
              sx={{
                minWidth: 120,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isDeactivating ? "Deactivating....." : "Deactivate"}
            </CustomButton>
          </DialogActions>
        </Dialog>
        {activeTab === "Admin Dashboard" && (
          <Box mt={3}>
            <AdminDashboard />
          </Box>
        )}
      </Box>
    </>
  );
};

export default UserManagement;
