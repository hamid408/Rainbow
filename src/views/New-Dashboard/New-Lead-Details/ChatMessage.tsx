import React from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Image from "next/image";
import AvatarPic from "../../../assests/images/Avatars.png";
type ChatMessageProps = {
  text: string;
  sender: "user" | "bot";
  channel?: string;
  time?: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  text,
  sender,
  channel,
  time,
}) => {
  const isUser = sender === "user";

  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={2.5}
      alignItems={"flex-end"}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "#EDE7F6", mr: 2, mb: 3 }}>
          <Image src={AvatarPic} alt="AI Avatar" width={60} height={60} />{" "}
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
            color={isUser ? "#fff" : "#000"}
            fontSize={14}
            fontWeight={400}
          >
            {text}
          </Typography>
        </Paper>

        {/* Meta Info */}
        <Box
          mt={0.5}
          display="flex"
          justifyContent={isUser ? "flex-end" : "flex-start"}
        >
          <Typography variant="caption" color="text.secondary">
            {channel} • {time}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;
