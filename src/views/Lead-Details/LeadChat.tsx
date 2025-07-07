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

const LeadChatSection = ({ refreshTrigger, leadId, userName }: any) => {
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const latestOffset = useRef(0);

  const { data, isLoading, refetch } = useGetConversationQuery({
    lead_ID: leadId,
    offset: latestOffset.current,
  });
  const [hasMounted, setHasMounted] = useState(false);

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
  console.log("data", data.data);
  return (
    <Box
     className = {styles.leadChat}
      // p={"40px 32px 32px 0"}
      // sx={{
      //   height: "400px",
      //   overflowY: "auto",
      // }}
    >
      <Stack gap={4}>
        {allMessages.map((msg: any, index: number) => {
          // const time = extractTime(msg.created_at);
          const time = msg.created_at;
          const isAI = msg.sender_type === "user";
          // const senderName = isAI ? "AI Assistant" : userName;
          // const senderName = isAI ? "AI Assistant" : msg.sender_name;
          const senderName = msg.sender_name || "Unknown";

          return (
            <Box
              key={index}
              className = {styles.leadChatMainBox}
              // display={"flex"}
              // alignItems={"start"}
              // gap={2.5}
              // flexDirection="row"
            >
              {/* {isAI ? (
                <Image src={AvatarPic} alt="AI Avatar" width={60} height={60} />
              ) : (
                renderUserAvatar(userName)
              )} */}
              {renderUserAvatar(senderName)}
              <Stack spacing={1.5}>
                <Box>
                  <Box 
                  className = {styles.leadChatFirstRow}
                  // display={"flex"} alignItems={"center"} gap={1}
                  >
                    <Typography mb={0.5} variant="body1">
                      {senderName}
                    </Typography>

                    {/* {msg.channel === "sms" ? <Typing /> : <Message />} */}
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
                      // mb={0.5}
                      // fontWeight={400}
                      // color="#666D80"
                      // mt={0.5}
                    >
                      {time}
                    </Typography>
                    {msg.channel === "call" && (
                      <CustomButton
                        variant="outlined"
                        size="small"
                        padding="2px 4px"
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
      </Stack>
    </Box>
  );
};

export default LeadChatSection;
