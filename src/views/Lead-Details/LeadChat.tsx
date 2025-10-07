"use client";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Avatar,
  Paper,
} from "@mui/material";
import Image from "next/image";
import AvatarPic from "../../assests/images/Avatars.png";
import {
  useGetConversationQuery,
  useLazyGetSuggestionsQuery,
} from "@/src/redux/services/conversation/conversationApi";
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
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [fetchSuggestions] = useLazyGetSuggestionsQuery();

  const { data, isLoading, refetch } = useGetConversationQuery({
    lead_ID: leadId,
    offset: latestOffset.current,
  });

  //
  const lastMessageId = useRef<string | null>(null);
  const lastMessageCount = useRef(0);

  // ✅ Trigger suggestion API when conversation refreshes via refreshTrigger
  useEffect(() => {
    fetchSuggestions({ lead_id: leadId });
  }, [refreshTrigger, leadId]);
  //

  const [hasMounted, setHasMounted] = useState(false);

  const [callLogModalOpen, setCallLogModalOpen] = useState(false);
  const [callLogData, setCallLogData] = useState<{
    transcript: string;
    presigned_url: string;
    call_status: string;
    in_voicemail: boolean;
    disconnection_reason: string;
    conversation_status: string;
    provider_event_id?: string;
  } | null>(null);
  const handleOpenModal = (eventId: string) => {
    setCallLogData({ provider_event_id: eventId } as any);
    setCallLogModalOpen(true);
  };

  const handleCloseModal = () => {
    setCallLogModalOpen(false);
    setCallLogData(null);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // useEffect(() => {
  //   if (data?.data?.length) {
  //     const newMessages = data.data;
  //     setAllMessages((prev) => [...prev, ...newMessages]);
  //     latestOffset.current += newMessages.length;
  //   }
  // }, [data]);

  useEffect(() => {
    if (data?.data?.length) {
      const newMessages = data.data;
      setAllMessages((prev) => [...prev, ...newMessages]);
      latestOffset.current += newMessages.length;

      // Compare count or ID to detect change
      if (
        newMessages.length !== lastMessageCount.current ||
        newMessages[newMessages.length - 1]?.id !== lastMessageId.current
      ) {
        lastMessageCount.current = newMessages.length;
        lastMessageId.current = newMessages[newMessages.length - 1]?.id || null;
        fetchSuggestions({ lead_id: leadId });
      }
    }
  }, [data, fetchSuggestions, leadId]);

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

  return (
    <>
      <Box className={styles.leadChat}>
        {/* <Stack gap={4}>
          {allMessages.map((msg: any, index: number) => {
            const time = msg.created_at;
            const isAI = msg.is_bot === true;
            const campaign = msg.sender_name === "Campaign Drip";
            const AIAssistant =
              msg.sender_name === "AI Assistant (to Director)";
            const senderName = msg.sender_name || "Unknown";

            return (
              <Box key={index} className={styles.leadChatMainBox}>
                {isAI || campaign || AIAssistant ? (
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
                      {msg.channel === "call" && (
                        <CustomButton
                          variant="outlined"
                          size="small"
                          padding="2px 4px"
                          onClick={() => handleOpenModal(msg.provider_event_id)}
                        >
                          Call logs
                        </CustomButton>
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
        </Stack> */}
        <Stack gap={3}>
          {allMessages.map((msg: any, index: number) => {
            const isBot =
              msg.is_bot === true ||
              msg.sender_name === "Campaign Drip" ||
              msg.sender_name?.includes("AI Assistant");
            const isUser = !isBot;

            return (
              <Box
                key={index}
                display="flex"
                justifyContent={isUser ? "flex-end" : "flex-start"}
                mb={2.5}
                alignItems="flex-end"
              >
                {!isUser && (
                  <Avatar sx={{ bgcolor: "#EDE7F6", mr: 2, mb: 3 }}>
                    <Image
                      src={AvatarPic}
                      alt="AI Avatar"
                      width={40}
                      height={40}
                    />
                  </Avatar>
                )}

                <Box maxWidth="70%">
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      borderTopLeftRadius: isUser ? 12 : 0,
                      borderTopRightRadius: isUser ? 0 : 12,
                      bgcolor: isUser ? "#624AA6" : "#fff",
                      color: isUser ? "#fff" : "#333",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontSize={14}
                      fontWeight={400}
                      color={isUser ? "#fff" : "#000"}
                    >
                      {msg.content}
                    </Typography>
                  </Paper>

                  <Box
                    mt={0.5}
                    display="flex"
                    justifyContent={isUser ? "flex-end" : "flex-start"}
                    alignItems="center"
                    gap={1}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {msg.channel} • {msg.created_at}
                    </Typography>

                    {msg.channel === "call" && (
                      <CustomButton
                        variant="outlined"
                        size="small"
                        padding="2px 6px"
                        onClick={() => handleOpenModal(msg.provider_event_id)}
                      >
                        Call logs
                      </CustomButton>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Stack>
        <CallLogModal
          open={callLogModalOpen}
          onClose={handleCloseModal}
          provider_event_id={callLogData?.provider_event_id || null}
        />
      </Box>
    </>
  );
};

export default LeadChatSection;
