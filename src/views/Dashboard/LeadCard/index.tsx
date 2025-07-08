"use client";
import { Box, Typography, Avatar, Stack, Button, Chip } from "@mui/material";
import StatusTag from "./StatusTag";
import ActionButtons from "./ActionButtons";
import { Cold, Typing, Urgent } from "@/src/assests/icons";
import StatusButton from "./StatusButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import CallModal from "../../Lead-Details/CallModal";
import ChatInputModal from "./ChatInputModal";
import styles from "./style.module.scss";
import { useMediaQuery, useTheme } from "@mui/material";

interface LeadCardProps {
  lead_id: string;
  name: string;
  initials: string;
  isGoingCold?: boolean;
  serviceType: string;
  serviceName: string;
  message: string;
  avatarUrl?: string;
  tag?: string;
  page?: number;
  phone?: string;
}

const LeadCard = ({
  lead_id,
  name,
  initials,
  isGoingCold = false,
  serviceType,
  serviceName,
  message,
  tag,
  page,
  avatarUrl,
  phone,
}: LeadCardProps) => {
  const router = useRouter();
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Link
        href={`/dashboard/${lead_id}?page=${page}`}
        style={{ textDecoration: "none" }}
      >
        <Box
          className={styles.root}
          // onClick={() => router.push(`/dashboard/${lead_id}`)} // <-- navigate to dynamic route
          // onClick={() => router.push(`/dashboard/${lead_id}?page=${page}`)}
        >
          <Box className={styles.secondaryRoot}>
            <Avatar src={avatarUrl} className={styles.avator}>
              {initials}
            </Avatar>

            <Stack className={styles.firstRow}>
              <Stack direction="row" className={styles.nameAndTag}>
                <Typography variant="body1" className={styles.name}>
                  {name}
                </Typography>

                <Box>
                  {tag?.toLowerCase() === "cold" ? (
                    <StatusTag
                      label="Cold"
                      color="#FAEDCC"
                      icon={<Cold sx={{ fontSize: 16 }} />}
                    />
                  ) : (
                    <StatusTag
                      label={tag || "hot"}
                      color="#FFF0F3"
                      icon={<Urgent />}
                    />
                  )}
                </Box>
              </Stack>

              {/* {message !== "No message available" && ( */}
              <Box className={styles.messageIconBox}>
                <Typing />
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  className={styles.messageIconLable}
                >
                  {serviceType}
                </Typography>
              </Box>
              {/* )}  */}
            </Stack>
          </Box>

          <Box className={styles.serviceNameTypeBox}>
            <Typography variant="body2" className={styles.serviceName}>
              {serviceName}
            </Typography>
            <Typography variant="body1" className={styles.message}>
              {/* {message} */}
              <Typography  className={styles.message}>
                {isSmallScreen && message.length > 20
                  ? `${message.slice(0, 20)}...`
                  : message}
              </Typography>
            </Typography>
          </Box>

          <Box className={styles.icons}>
            {isGoingCold ? (
              serviceType.toLowerCase().startsWith("missed") ? (
                <>
                  <StatusButton type="snoozed" label="Snooze for later" />
                  <StatusButton type="meeting" label="Meeting set for 3 PM" />
                </>
              ) : (
                <>
                  <StatusButton type="addressed" label="Addressed" />
                  <StatusButton type="meeting" label="Meeting set for 3 PM" />
                </>
              )
            ) : (
              <ActionButtons
                callOpen={setIsCallOpen}
                emailOpen={setIsEmailOpen}
                lead_id={lead_id}
                phone={phone}
              />
            )}
          </Box>
        </Box>
      </Link>
      <CallModal
        open={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        leadId={lead_id}
        phone={phone}
      />
      {isEmailOpen && (
        <ChatInputModal
          open={isEmailOpen}
          onClose={() => setIsEmailOpen(false)}
          leadId={lead_id}
          phone={phone}
        />
      )}
    </>
  );
};

export default LeadCard;
