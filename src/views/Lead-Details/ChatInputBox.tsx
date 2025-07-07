"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
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
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "12px",
        marginTop: "55px",
        padding: 2,
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        border: "1px solid #DFE1E7",
      }}
    >
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

      <Box
        mt={2}
        display="flex"
        alignItems="center"
        gap={2}
        width="100%"
        justifyContent="space-between"
      >
        <Box display="flex" gap={2}>
          <CustomButton
            variant="outlined"
            startIcon={<SmallPhone />}
            fontWeight="600"
            onClick={() => setIsCallOpen(true)}
          >
            Call via Twilio
          </CustomButton>

          <CustomButton
            variant="outlined"
            startIcon={<Email />}
            fontWeight="600"
            disabled
          >
            Send Email
          </CustomButton>

          <CustomButton
            variant="outlined"
            startIcon={<Mark />}
            fontWeight="600"
            onClick={() => setIsConfirmOpen(true)}
          >
            Mark as Resolved
          </CustomButton>
        </Box>

        <CustomButton
          variant="contained"
          startIcon={<SendIcon />}
          fontWeight="600"
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
