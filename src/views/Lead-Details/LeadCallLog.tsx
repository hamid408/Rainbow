"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { Ai } from "@/src/assests/icons";
import CustomButton from "@/src/components/common/CustomButton";
import {
  useChangeSuggestionMutation,
  useGetSuggestionsQuery,
  useSendSmsMutation,
} from "@/src/redux/services/conversation/conversationApi";
import { toast } from "react-toastify";
import styles from "./style.module.scss";

const CallLogsSection = ({ lead_id }: any) => {
  const { data: SuggestionData, isLoading } = useGetSuggestionsQuery({
    lead_id,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const originalMessage = useRef(message);
  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();
  const [changeSuggestion, { isLoading: isSaving }] =
    useChangeSuggestionMutation();
  useEffect(() => {
    if (SuggestionData?.suggestion?.content) {
      setMessage(SuggestionData.suggestion.content);
    }
  }, [SuggestionData]);

  const handleEditClick = () => {
    originalMessage.current = message;
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setMessage(originalMessage.current);
    setIsEditing(false);
  };
  const ChangeSuggestionMessage = async () => {
    try {
      await changeSuggestion({
        suggestion_id: SuggestionData.suggestion?.id,
        content: message,
      }).unwrap();
      toast.success("Suggestion updated Successfully!!");
      setIsEditing(false);
    } catch (err) {
      console.error("SMS Failed:", err);
      toast.error("Failed to update suggestion. Try Again");
    }
  };
  const SendNowMessage = async () => {
    try {
      await sendSms({
        lead_id: lead_id,
        sms_content: message,
        suggestion_id: SuggestionData.suggestion?.id,
      }).unwrap();
      toast.success("Suggestion Sent Successfully!!");
    } catch (err) {
      console.error("SMS Failed:", err);
      toast.error("Failed to send Message. Try Again");
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={styles.leadCallLog}>
      <Stack className = {styles.leadCallLogStack}>
        <Ai />
        <Typography variant="body1" className = {styles.leadCallLogTypo}>
          AI Draft & Suggestion Panel
        </Typography>
      </Stack>

      {!isEditing ? (
        <Box className = {styles.leadCallLogMessageBox}>
          {!message ? (
            <Typography color="error">No Suggestion Found!</Typography>
          ) : (
            <Box>{message}</Box>
          )}
        </Box>
      ) : (
        <textarea className={styles.leadCallLogEditTextfield}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      )}

      <Box className = {styles.leadCallLogInvitationButtons}>
        {!isEditing && (
          <CustomButton variant="outlined" onClick={handleEditClick}
          className={styles.leadCallLogEditMessage}>
            Edit Message
          </CustomButton>
        )}
        {isEditing && (
          <>
            <CustomButton variant="outlined" onClick={handleCancelClick}>
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={ChangeSuggestionMessage}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </CustomButton>
          </>
        )}
        {!isEditing && (
          <CustomButton
            variant="contained"
            // background="#6B39F4"
            // fontWeight="600px"
            onClick={SendNowMessage}
            disabled={isSending}
            className={styles.leadCallLogSendNow}
          >
            {isSending ? "Sending..." : "Send Now"}
          </CustomButton>
        )}
      </Box>
    </Box>
  );
};

export default CallLogsSection;
