"use client";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Image from "next/image";
import AvatarPic from "../../assests/images/Avatars.png";
import { useGetConversationQuery } from "@/src/redux/services/conversation/conversationApi";
import { useEffect, useRef, useState } from "react";
import { getInitials } from "@/src/utils/GetInitials";
import { Message, Typing } from "@/src/assests/icons";
import { CallEnd } from "@mui/icons-material";
import CustomButton from "@/src/components/common/CustomButton";
import CallLogModal from "./CallLogModal";
import styles from "./style.module.scss";
const LeadChatSection = ({ refreshTrigger, leadId, userName }: any) => {
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const latestOffset = useRef(0);

  const { data, isLoading, refetch } = useGetConversationQuery({
    lead_ID: leadId,
    offset: latestOffset.current,
  });
  const [hasMounted, setHasMounted] = useState(false);

  const [callLogModalOpen, setCallLogModalOpen] = useState(false);
  const [callLogData, setCallLogData] = useState<{
    transcript: string;
    recording_url: string;
    call_status: string;
    in_voicemail: boolean;
    disconnection_reason: string;
    conversation_status: string;
  } | null>(null);

  const handleOpenModal = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setCallLogData(parsed);
      setCallLogModalOpen(true);
    } catch (e) {
      console.error("Failed to parse call log JSON", e);
    }
  };

  const handleCloseModal = () => {
    setCallLogModalOpen(false);
    setCallLogData(null);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (data?.data?.length) {
      const newMessages = data.data;
      setAllMessages((prev) => [...prev, ...newMessages]);
      latestOffset.current += newMessages.length;
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refreshTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);
  if (!hasMounted) return null;

  if (isLoading && allMessages.length === 0)
    return <CircularProgress sx={{ m: 5 }} />;

  if (allMessages.length === 0)
    return (
      <Typography m={10} fontSize={28} fontWeight={600}>
        No Conversation Found!
      </Typography>
    );
  const renderUserAvatar = (name: string | undefined | null) => {
    const initials = getInitials(name);
    return (
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
    );
  };

  const isValidCallLogJson = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      return (
        typeof parsed === "object" &&
        (parsed.recording_url ||
          parsed.transcript ||
          parsed.call_status ||
          parsed.disconnection_reason ||
          parsed.in_voicemail ||
          parsed.conversation_status)
      );
    } catch (e) {
      console.warn("❌ Invalid JSON string:", str);
      return false;
    }
  };

  return (
    <>
      <Box className={styles.leadChat}>
        <Stack gap={4}>
          {allMessages.map((msg: any, index: number) => {
            const time = msg.created_at;
            const isAI = msg.is_bot === true;

            const senderName = msg.sender_name || "Unknown";

            return (
              <Box key={index} className={styles.leadChatMainBox}>
                {isAI ? (
                  <Image
                    src={AvatarPic}
                    alt="AI Avatar"
                    width={60}
                    height={60}
                  />
                ) : (
                  renderUserAvatar(senderName)
                )}
                <Stack spacing={1.5}>
                  <Box>
                    <Box className={styles.leadChatFirstRow}>
                      <Typography mb={0.5} variant="body1">
                        {senderName}
                      </Typography>

                      {msg.channel === "sms" ? (
                        <Typing />
                      ) : msg.channel === "call" ? (
                        <CallEnd />
                      ) : (
                        <Message />
                      )}

                      <Typography
                        className={styles.leadChatDate}
                        variant="subtitle1"
                      >
                        {time}
                      </Typography>
                      {msg.channel === "call" &&
                        isValidCallLogJson(msg.provider_metadata) && (
                          <>
                            <CustomButton
                              variant="outlined"
                              size="small"
                              padding="2px 4px"
                              onClick={() =>
                                handleOpenModal(msg.provider_metadata)
                              }
                            >
                              Call logs
                            </CustomButton>
                          </>
                        )}
                    </Box>
                    <Typography variant="body2" color="#0D0D12">
                      {msg.content}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
        <CallLogModal
          open={callLogModalOpen}
          onClose={handleCloseModal}
          data={callLogData}
        />
      </Box>
    </>
  );
};

export default LeadChatSection;
