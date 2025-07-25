"use client";
import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CustomButton from "@/components/common/CustomButton";
import { useSendSmsMutation } from "@/redux/services/conversation/conversationApi";
import { toast } from "react-toastify";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

const ChatInputModal = ({
  open,
  onClose,
  leadId,
  phone,
}: {
  open: boolean;
  onClose: () => void;
  leadId: string;
  phone?: string;
}) => {
  const [message, setMessage] = useState("");
  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();

  const handleSendMessage = async () => {
    try {
      await sendSms({
        lead_id: leadId,
        sms_content: message,
      }).unwrap();
      toast.success("Message sent successfully!");
      setMessage("");
      onClose();
    } catch (err) {
      console.error("SMS Failed:", err);
      toast.error("Failed to send message. Try again.");
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" mb={2}>
          Send  Message
        </Typography>
        <TextField
          multiline
          rows={4}
          placeholder="Type your message..."
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 400,
              color: "#0D0D12",
              padding: "16px",
              border: "none",
            },
          }}
        />
        <Stack direction="row" justifyContent="flex-end" gap={2}>
          <CustomButton variant="outlined" onClick={onClose}>
            {"Cancel"}
          </CustomButton>
          <CustomButton
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={isSending || message.trim() === ""}
          >
            {isSending ? "Sending..." : "Send"}
          </CustomButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChatInputModal;
