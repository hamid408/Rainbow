"use client";
import { Back, Call, Cold, Urgent } from "@/src/assests/icons";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Refresh } from "@mui/icons-material";
import { getInitials } from "@/src/utils/GetInitials";
import CustomButton from "@/src/components/common/CustomButton";
import styles from "./style.module.scss";
interface LeadHeaderProps {
  name: string;
  status: string;
  onRefreshClick: () => void;
}
const LeadHeader = ({ name, status, onRefreshClick }: LeadHeaderProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const handleRouteBack = () => {
    const page = searchParams.get("page") || "1";
    router.push(`/dashboard?page=${page}`);
  };
  const keyword = status?.split(" ")[0]?.toLowerCase();
  console.log("stats", keyword);
  const initials = getInitials(name);
  const handleRefreshClick = () => {
    setLoading(true);
    setTimeout(() => {
      onRefreshClick();
      setLoading(false);
    }, 2000);
  };
  return (
    <>
      <Box className={styles.leadHeaderRoot}>
        <Box className={styles.leadHeaderSecondRoot}>
          <Box className={styles.leadHeaderFirstRow}>
            <Back onClick={handleRouteBack} />
            {/* <Back onClick={() => router.back()} /> */}
          </Box>
          <Avatar
            sx={{
              bgcolor: "#D9EFFF",
              height: "60px",
              width: "60px",
              color: "#0062FF",

              fontWeight: "600",
              fontSize: "24px",
              mb: 2,
            }}
          >
            {initials || "U"}
          </Avatar>
          <Stack gap={1}>
            <Typography fontWeight={600} variant="h5" color="#0D0D12">
              {name}
            </Typography>

            <Chip
              className={styles.leadHeaderChip}
              label={status}
              size="small"
              sx={{
                background: "#FFF0F3",
                color: "#36394A",
                fontSize: "14",
                fontWeight: "500",
              }}
              icon={<Urgent />}
            />
          </Stack>
        </Box>

        <Box display={"flex"} alignItems="center" gap={2}>
          <CustomButton
            variant="contained"
            onClick={handleRefreshClick}
            startIcon={
              loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                <Refresh sx={{ cursor: "pointer" }} />
              )
            }
          >
            Refresh
          </CustomButton>

          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              padding: "6px 10px",
              background: "#ECEFF3",
              color: "#36394A",
            }}
          >
            <Call />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ cursor: "pointer" }}
            >
              Call logs
            </Typography>
          </Box> */}
        </Box>
      </Box>
      <Divider className={styles.leadHeaderSlider}/>
    </>
  );
};

export default LeadHeader;
