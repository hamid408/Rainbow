"use client";
import { BackNew } from "@/src/assests/icons";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Refresh } from "@mui/icons-material";
import { getInitials } from "@/src/utils/GetInitials";
import CustomButton from "@/src/components/common/CustomButton";
import styles from "./style.module.scss";
import { Edit } from "@mui/icons-material";
import ActionsButton from "@/src/components/common/ActionsButton";

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
  const actionsData = [
    { label: "1", value: "once" },
    { label: "2", value: "twice" },
    { label: "3", value: "thrice" },
  ];
  const [actions, setActions] = React.useState("Actions");

  return (
    <>
      <Box className={styles.leadHeaderRoot}>
        <Stack className={styles.leadHeaderSecondRoot}>
          {!hideBackButton && (
            <Box
              className={styles.leadHeaderFirstRow}
              onClick={() => router.back()}
            >
              <BackNew />
              <Typography
                variant="subtitle1"
                fontSize={15}
                fontWeight={400}
                color="#0D0D12"
              >
                Back to my Inbox
              </Typography>
            </Box>
          )}

          {/* <Avatar className={styles.leadHeaderAvatar}>{initials || "U"}</Avatar> */}
          <Stack gap={1}>
            <Box
              display={"flex"}
              alignItems="center"
              gap={1.5}
              justifyContent={"space-between"}
              width={"100%"}
              // maxWidth={1200}
            >
              <Box display="flex" alignItems="center" gap={3.8}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontSize={23}
                  color="#0D0D12"
                >
                  {name}
                </Typography>
                <Box display={"flex"} alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#D3C4FC",
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="#090909"
                    fontSize={13}
                    fontWeight={400}
                  >
                    {/* {status} */}
                    AI is active
                  </Typography>
                </Box>
              </Box>

              <Box>
                <ActionsButton />
              </Box>
            </Box>
          </Stack>
        </Stack>
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
      {/* <Divider className={styles.leadHeaderSlider} /> */}
    </>
  );
};

export default LeadHeader;
