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

const LeadChatSection = ({ refreshTrigger, leadId, userName }: any) => {
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const latestOffset = useRef(0);

  const { data, isLoading, refetch } = useGetConversationQuery({
    lead_ID: leadId,
    offset: latestOffset.current,
  });

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

  if (isLoading && allMessages.length === 0)
    return <CircularProgress sx={{ m: 5 }} />;

  if (allMessages.length === 0)
    return (
      <Typography m={10} fontSize={28} fontWeight={600}>
        No Conversation Found!
      </Typography>
    );
  const renderUserAvatar = (name: string) => {
    const initials = getInitials(name);
    return (
      <Avatar
        sx={{
          bgcolor: "#1976d2",
          width: 60,
          height: 60,
          fontSize: 32,
          mb: 2,
        }}
      >
        {initials || "U"}
      </Avatar>
    );
  };
  console.log("data", data.data);
  return (
    <Box
      p={"40px 32px 32px 0"}
      sx={{
        height: "400px",
        overflowY: "auto",
      }}
    >
      <Stack gap={4}>
        {allMessages.map((msg: any, index: number) => {
          // const time = extractTime(msg.created_at);
          const time = msg.created_at;
          const isAI = msg.sender_type === "user";
          // const senderName = isAI ? "AI Assistant" : userName;
          // const senderName = msg.sender_name;
          const senderName = isAI ? "AI Assistant" : msg.sender_name;

          return (
            <Box
              key={index}
              display={"flex"}
              alignItems={"start"}
              gap={2.5}
              flexDirection="row"
            >
              {isAI ? (
                <Image src={AvatarPic} alt="AI Avatar" width={60} height={60} />
              ) : (
                renderUserAvatar(userName)
              )}
              <Stack spacing={1.5}>
                <Box>
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    <Typography mb={0.5} variant="body1">
                      {senderName}
                    </Typography>

                    {msg.channel === "sms" ? <Typing /> : <Message />}

                    <Typography
                      mb={0.5}
                      variant="subtitle1"
                      fontWeight={400}
                      color="#666D80"
                      mt={0.5}
                    >
                      {time}
                    </Typography>
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
    </Box>
  );
};

export default LeadChatSection;
