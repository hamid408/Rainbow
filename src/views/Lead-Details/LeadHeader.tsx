"use client";
import { Back, Cold, Urgent } from "@/src/assests/icons";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Refresh } from "@mui/icons-material";
import { getInitials } from "@/src/utils/GetInitials";
import CustomButton from "@/src/components/common/CustomButton";
import styles from "./style.module.scss";
import { Edit } from "@mui/icons-material";
interface LeadHeaderProps {
  name: string;
  status: string;
  onRefreshClick: () => void;
  onEditClick: () => void;
  hideBackButton?: boolean;
}
const LeadHeader = ({
  name,
  status,
  onRefreshClick,
  onEditClick,
  hideBackButton,
}: LeadHeaderProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleRouteBack = () => {
    const page = searchParams.get("page") || "1";
    router.push(`/dashboard?page=${page}`);
  };

  const keyword = status?.split(" ")[0]?.toLowerCase();
  const initials = getInitials(name);
  const handleRefreshClick = (e: any) => {
    e.preventDefault();
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
          {!hideBackButton && (
            <Box className={styles.leadHeaderFirstRow}>
              {/* <Back onClick={handleRouteBack} /> */}
              <Back onClick={() => router.back()} />
            </Box>
          )}

          <Avatar
            className={styles.leadHeaderAvatar}
            // sx={{
            //   bgcolor: "#D9EFFF",
            //   height: "60px",
            //   width: "60px",
            //   color: "#0062FF",

            //   fontWeight: "600",
            //   fontSize: "24px",
            //   mb: 2,
            // }}
          >
            {initials || "U"}
          </Avatar>
          <Stack gap={1}>
            <Typography className={styles.leadHeaderName}>{name}</Typography>

            <Chip
              className={styles.leadHeaderChip}
              label={status}
              size="small"
              icon={keyword === "hot" ? <Urgent /> : <Cold />}
            />
          </Stack>
        </Box>

        <Box className={styles.refreshEditBtn}>
          <Box className={styles.refreshBtn}>
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
          </Box>

          <Box className={styles.editSlider}>
            <IconButton onClick={onEditClick} sx={{ color: "#0057b7" }}>
              <Edit />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Divider className={styles.leadHeaderSlider} />
    </>
  );
};

export default LeadHeader;





