"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  useGetOrganizationListQuery,
  useSetOrganizationMutation,
} from "@/src/redux/services/organization/organizationApi";
import { useSignInMutation } from "@/src/redux/services/auth/authApi";
import Cookies from "js-cookie";

const OrganizationList = () => {
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState("");
  const { data: organizationListData, isLoading: isListLoading } =
    useGetOrganizationListQuery();
  const [setOrganization, { isLoading: isSetting }] =
    useSetOrganizationMutation();
  const [signIn, { isLoading: isRefreshing }] = useSignInMutation();

  const organizations = organizationListData?.data?.organizations || [];

  const handleContinue = async () => {
    if (!selectedOrg) {
      alert("Please select an organization first.");
      return;
    }

    try {
      console.log("🔹 Selected Organization:", selectedOrg);

      // Step 1: Set selected organization
      await setOrganization({ organzation_id: selectedOrg }).unwrap();
      console.log("✅ Organization set successfully");

      // Step 2: Fetch refresh token
      const refresh_token = Cookies.get("refresh_token");
      if (!refresh_token) {
        throw new Error("Missing refresh token — cannot refresh ID token.");
      }
      console.log("🔹 Refresh Token Found:", refresh_token);

      // Step 3: Call signIn mutation with refresh_token
      const loginResponse = await signIn({ refresh_token }).unwrap();
      console.log("🔹 Sign-in API Response:", loginResponse);

      const newToken = loginResponse?.id_token;
      if (!newToken) {
        throw new Error("❌ No ID token received from API.");
      }

      // Step 4: Remove old ID token first
      const oldToken = Cookies.get("id_token");
      if (oldToken) {
        Cookies.remove("id_token");
        console.log("🗑️ Old ID token removed");
      }

      // Step 5: Store new ID token securely
      Cookies.set("id_token", newToken, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      console.log("✅ New ID token saved:", newToken);

      // Verify storage
      const storedToken = Cookies.get("id_token");
      console.log("🔍 Stored Token after save:", storedToken);

      // Step 6: Move to dashboard only after storing token
      if (storedToken === newToken) {
        console.log("🚀 Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        console.warn("⚠️ Token not stored properly, aborting redirect.");
        alert("Token not updated. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error during organization selection:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={600}
            mb={2}
            color="primary"
          >
            Select Your Organization
          </Typography>

          {isListLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : organizations.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" py={3}>
              No organizations found.
            </Typography>
          ) : (
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                label="Select Organization"
              >
                {organizations.map((org: any) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
              disabled={
                isSetting || isListLoading || !selectedOrg || isRefreshing
              }
              sx={{
                width: "100%",
                textTransform: "none",
                borderRadius: 2,
                py: 1.2,
                fontWeight: 500,
              }}
            >
              {isSetting || isRefreshing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Continue"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrganizationList;
