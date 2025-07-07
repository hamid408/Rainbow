"use client";
import React, { useState } from "react";
import { Box, TextField, Stack } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import TaskIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import CustomButton from "@/src/components/common/CustomButton";
import { AssignTask, Mark, SmallPhone } from "@/src/assests/icons";
import CallModal from "./CallModal";
import { Email } from "@mui/icons-material";
import { useSendSmsMutation } from "@/src/redux/services/conversation/conversationApi";
import { toast } from "react-toastify";
import styles from "./style.module.scss";

const ChatInputBox = ({ data }: any) => {
  const [message, setMessage] = useState("");
  const [isCallOpen, setIsCallOpen] = useState(false);
  const lead = data?.data?.[0];
  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();

  const leadId = lead?.lead_id;
  const phone = lead?.phone;
  const handleSendMessage = async () => {
    try {
      await sendSms({
        lead_id: leadId,
        sms_content: message,
      }).unwrap();
      toast.success("Sugestion Sent Successfully!!");
      setMessage("");
    } catch (err) {
      console.error("SMS Failed:", err);
      toast.error("Failed to send Message. Try Again");
    }
  };
  return (
    <Box className={styles.chatInputBox}>
      <TextField
        multiline
        rows={5}
        placeholder="Type your message..."
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 400,
            color: "#0D0D12",
            padding: "16px",
            border: "none",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      />

      <Box className={styles.chatInputBoxButtonsRoot}>
        <Box className={styles.chatInputBoxButtons}>
          <CustomButton
            className={styles.chatInputButtons}
            variant="outlined"
            startIcon={<SmallPhone />}
            fontWeight="600"
            onClick={() => setIsCallOpen(true)}
          >
            Call via Twilio
          </CustomButton>

          <CustomButton
            className={styles.chatInputButtons}
            variant="outlined"
            startIcon={<Email />}
            fontWeight="600"
            disabled
          >
            Send Email
          </CustomButton>

          <CustomButton
            className={styles.chatInputButtons}
            variant="outlined"
            startIcon={<Mark />}
            fontWeight="600"
          >
            Mark as Resolved
          </CustomButton>
        </Box>

        <CustomButton
          className={styles.chatInputSendButton}
          variant="contained"
          startIcon={<SendIcon />}
          fontWeight="600px"
          onClick={handleSendMessage}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </CustomButton>

      </Box>
      <CallModal
        open={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        leadId={leadId}
        phone={phone}
      />
    </Box>
  );
};

export default ChatInputBox;
// Twiliyo phone number +12187893464
