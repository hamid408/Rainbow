"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Email } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import CustomButton from "@/src/components/common/CustomButton";
import { AssignTask, Mark, SmallPhone } from "@/src/assests/icons";
import CallModal from "./CallModal";
import { useSendSmsMutation } from "@/src/redux/services/conversation/conversationApi";
import { useResolvedLeadMutation } from "@/src/redux/services/leads/leadsApi";
import styles from "./style.module.scss";

const ChatInputBox = ({ data }: any) => {
  const [message, setMessage] = useState("");
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const lead = data?.data?.[0];
  const leadId = lead?.lead_id;
  const phone = lead?.phone;

  const router = useRouter();
  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();
  const [resolveLead, { isLoading: isResolving }] = useResolvedLeadMutation();

  const handleSendMessage = async () => {
    try {
      await sendSms({
        lead_id: leadId,
        sms_content: message,
      }).unwrap();
      toast.success("Suggestion Sent Successfully!");
      setMessage("");
    } catch (err) {
      console.error("SMS Failed:", err);
      toast.error("Failed to send message. Try again.");
    }
  };

  const handleConfirmDeactivate = async () => {
    try {
      await resolveLead({
        lead_id: leadId,
        is_active: false,
      }).unwrap();
      toast.success("Lead marked resolved!");
      setIsConfirmOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to resolve lead:", error);
      toast.error("Failed to resolve lead. Try again.");
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
        }}
      />

      <Box className={styles.chatInputBoxButtonsRoot}>
        <Box className={styles.chatInputBoxButtons}>
          <CustomButton
            className={styles.chatInputCallBtn}
            variant="outlined"
            startIcon={<SmallPhone />}
            fontWeight="600"
            onClick={() => setIsCallOpen(true)}
          >
            Call via Twilio
          </CustomButton>

          <CustomButton
            className={styles.chatInputSendBtn}
            variant="outlined"
            startIcon={<Email />}
            fontWeight="600"
            disabled
            sx={{
              "@media(max-width: 900px)": {
                marginLeft: "23px",
              },
              "@media(max-width: 320px)": {
                marginLeft: "0px",
              },
            }}
          >
            Send Email
          </CustomButton>

          <CustomButton
            className={styles.chatInputMarkBtn}
            variant="outlined"
            startIcon={<Mark />}
            fontWeight="600"
            onClick={() => setIsConfirmOpen(true)}
            sx={{
              "@media(max-width: 900px)": {
                marginTop: "15px",
              },
              "@media(min-width: 680px) and (max-width: 700px)": {
                marginLeft: "16px",
              },
            }}
          >
            Mark as Resolved
          </CustomButton>
        </Box>

        <Divider
         className={styles.divider}
          sx={{
            my: 2, // vertical margin
            borderColor: "#ccc", // optional
            width: "108%",
          }}
        >
        </Divider>

        <div className = {styles.sendBtn} >
          <CustomButton
            className={styles.chatInputSendButton}
            variant="contained"
            startIcon={<SendIcon />}
            fontWeight="600"
            onClick={handleSendMessage}
            disabled={isSending}
            sx={{
              "@media(max-width: 900px)": {
                marginTop: "55px",
              },
              "@media(max-width: 600px)": {
                marginTop: "0px",
              },
            }}
          >
            {isSending ? "Sending..." : "Send"}
          </CustomButton>
        </div>
      </Box>

      <CallModal
        open={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        leadId={leadId}
        phone={phone}
      />

      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        PaperProps={{ sx: { padding: "14px 10px" } }}
      >
        <DialogTitle sx={{ fontSize: "18px", fontWeight: 500, pb: 0 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Are you sure you want to deactivate this lead?
          </Typography>
        </DialogTitle>

        <DialogActions
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            pt: 0,
          }}
        >
          <CustomButton
            onClick={() => setIsConfirmOpen(false)}
            variant="outlined"
          >
            Cancel
          </CustomButton>

          <CustomButton
            onClick={handleConfirmDeactivate}
            variant="contained"
            background="red"
            disabled={isResolving}
            sx={{
              minWidth: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isResolving ? "Deactivating..." : "Deactivate"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatInputBox;
