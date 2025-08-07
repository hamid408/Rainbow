"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
} from "@mui/material";

import {
  Editting,
  Lightning,
  Mail,
  MailGrey,
  Message,
  MessageGrey,
  TickMark,
} from "@/src/assests/icons";
import { Edit } from "@mui/icons-material";
// import CustomTextField from "@/src/components/common/CustomTextfield";
import styles from "./style.module.scss";

interface OutreachAndSuggestionCardProps {
  status1: { channel: string; message: string } | null;
  status2: { channel: string; message: string } | null;
  suggestedMessage: string;
}

const OutreachAndSuggestionCard: React.FC<OutreachAndSuggestionCardProps> = ({
  status1,
  status2,
  suggestedMessage,
}) => {
  const [editField, setEditField] = useState(false);
  const [message, setMessage] = useState(suggestedMessage);
  const [save, setSave] = useState(false);
  const [originalMessage, setOriginalMessage] = useState(suggestedMessage);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    setMessage(e.target.value);
  };

  return (
    <Box className={styles.outReachRoot}>
      {/* Outreach Status */}
      <Box className={styles.outReachBox}>
        <Typography variant="caption" className={styles.outReachText}>
          Current Outreach Status
        </Typography>

        <Box className={styles.statusesBox}>
         
          <Stack className={styles.statusesStack}>
            {status1?.channel === "Email" ? <MailGrey /> : <MessageGrey />}
            <Typography variant="caption" className={styles.statusColor}>
              {status1?.message || "No last action"}
            </Typography>
          </Stack>

       
          <Stack className={styles.statusesStack}>
            {status2?.channel === "Email" ? <MailGrey /> : <MessageGrey />}
            <Typography variant="caption" className={styles.statusColor}>
              {status2?.message || "No next action"}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Suggested Message */}
      <Box className={styles.suggestedMessageBox}>
        <Stack className={styles.statusesStack}>
          <Lightning />
          <Typography variant="caption" className={styles.AiText}>
            AI Suggested Message
          </Typography>
        </Stack>

        <Box className={styles.messageBox}>
          <textarea
            value={message}
            className={styles.input}
            onChange={handleChange}
            disabled={!editField || save}
            rows={3}
          />

          <Stack
            direction="row"
            spacing={0.8}
            className={styles.editPreiewStack}
          >
            {!editField && (
              <IconButton className={styles.editButton}>
                <Editting
                  onClick={() => {
                    setOriginalMessage(message);
                    setEditField(true);
                  }}
                />
              </IconButton>
            )}

            {!editField && (
              <Button variant="outlined" className={styles.previewButton}>
                Preview
              </Button>
            )}
            <Box display={"flex"} alignItems="center" gap={1}>
              {editField && !save && (
                <Button
                  onClick={() => {
                    setMessage(originalMessage);
                    setEditField(false);
                    setSave(false);
                  }}
                  variant="outlined"
                  className={styles.saveButton}
                >
                  Cancel
                </Button>
              )}

              {editField && !save && (
                <Button
                  onClick={() => setSave(true)}
                  variant="outlined"
                  className={styles.saveButton}
                >
                  Save
                </Button>
              )}
            </Box>

            {save && (
              <Button
                onClick={() => {
                  setSave(true);
                  setEditField(false);
                }}
                variant="outlined"
                className={styles.saveButton}
              >
                Saved
                <TickMark className={styles.tickMark}> </TickMark>
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default OutreachAndSuggestionCard;
