"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Avatar, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PauseIcon from "@mui/icons-material/Pause";

import { ContactData } from "./data";
import { AfterTakeOver, AssignAI, Pause } from "@/assests/icons";
import { Height } from "@mui/icons-material";
import styles from "./style.module.scss";
import PauseAIDialog from "./PauseAIDialog";
import TakeOverDialog from "./TakeOverDialog";

interface ContactProgressCardProps {
  contact: ContactData;
  completedSteps?: number;
  totalSteps?: number;
}

const ContactProgressCard: React.FC<ContactProgressCardProps> = ({
  contact,
  completedSteps = 2,
  totalSteps = 5,
}) => {
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [isAIPaused, setIsAIPaused] = useState(false);

  const [takeOverOpen, setTakeOverOpen] = useState(false);
  const [takeOver, setTakeOver] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  return (
    <Box className={styles.contactProgressRoot}>
      {/* Contact Info */}
      <Box className={styles.contactBox}>
        <Avatar
          className={`${styles.avatarBox} ${
            contact.id >= 85
              ? styles.green
              : contact.id >= 61 && contact.id < 85
              ? styles.yellow
              : styles.red
          }`}
        >
          {contact.id}
        </Avatar>

        <Stack spacing={0.2}>
          <Typography 
          className={styles.title}
          >{contact.title}</Typography>

          <Typography variant="body2" color="text.secondary" className={styles.subTitle}>
            {contact.subtitle}
          </Typography>
        </Stack>
      </Box>

      {/* Progress Bar */}
      <Box className={styles.progressBox}>
        <Typography variant="body2" className={styles.progressText}>
          Progress Status
        </Typography>

        <Box className={styles.progressbar}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <Box
              key={index}
              className={`${styles.progressBarStep} ${
                index < completedSteps ? styles.active : ""
              }`}
            />
          ))}
        </Box>
      </Box>

      {/* Buttons */}
      <Box className={styles.buttonBox}>
        {!isAIPaused ? (
          <Button
            variant="outlined"
            startIcon={<Pause />}
            className={styles.pauseButton}
            onClick={() => setPauseDialogOpen(true)}
          >
            Pause
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<AssignAI></AssignAI>}
            className={styles.assignAIButton}
            // onClick={() => setPauseDialogOpen(true)}
          >
            Assign to AI
          </Button>
        )}

        {!takeOver ? (
          <Button
          variant="contained"
          className={styles.takeOverButton}
          onClick={() => setTakeOverOpen(true)}
        >
          Take Over
        </Button>
        ) : (
          <AfterTakeOver></AfterTakeOver>
        )}
        

        <PauseAIDialog
          open={pauseDialogOpen}
          onClose={() => setPauseDialogOpen(false)}
          leadName={contact.title}
          onPauseConfirm={() => {
            setIsAIPaused(true);
            setPauseDialogOpen(false);
          }}
        />

        <TakeOverDialog
          open={takeOverOpen}
          onClose={() => setTakeOverOpen(false)}
          selectedReason={selectedReason}
          onReasonChange={(reason) => setSelectedReason(reason)}
          
          onConfirm={() => {
            setTakeOver(true);
            setTakeOverOpen(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default ContactProgressCard;
