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
} from "@/assests/icons";
import { Edit } from "@mui/icons-material";
// import CustomTextField from "@/components/common/CustomTextfield";
import styles from "./style.module.scss";

interface OutreachAndSuggestionCardProps {
  status1: string;
  status2: string;
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
            <MailGrey />
            <Typography variant="caption" className={styles.statusColor}>
              {status1}
            </Typography>
          </Stack>

          <Stack className={styles.statusesStack}>
            <MessageGrey />
            <Typography variant="caption" className={styles.statusColor}>
              {status2}
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
              // type="text"
              value={message}
              className={styles.input}
              onChange={handleChange}
              disabled={!editField || save}
              rows={1}
            />
            

          <Stack direction="row" spacing={0.8} className={styles.editPreiewStack}>
            {!editField && (
              <IconButton className={styles.editButton}>
                <Editting onClick={() => setEditField(true)} />
              </IconButton>
            )}

            {!editField && (
              <Button variant="outlined" className={styles.previewButton}>
                Preview
              </Button>
            )}

            {editField && !save &&(
              <Button
                onClick={() => setSave(true)}
                variant="outlined"
                className={styles.saveButton}
              >
                Save
              </Button>
            )}

            {save && (
              <Button
                onClick={() => setSave(true)}
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
