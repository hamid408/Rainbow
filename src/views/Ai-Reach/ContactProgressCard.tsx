"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Avatar, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PauseIcon from "@mui/icons-material/Pause";

import { ContactData } from "./data";
import { AfterTakeOver, AssignAI, Pause } from "@/src/assests/icons";
import { Height, PlayArrow } from "@mui/icons-material";
import styles from "./style.module.scss";
import PauseAIDialog from "./PauseAIDialog";
import TakeOverDialog from "./TakeOverDialog";
import { useChangeCampaignStatusMutation } from "@/src/redux/services/campagin/campaignApi";
import { toast } from "react-toastify";

interface ContactProgressCardProps {
  contact: ContactData;
  completedSteps?: number;
  campaginStatus: string;
  totalSteps?: number;
  leadId: any;
  campaignId: any;
  refetchCampaigns: () => void;
}

const ContactProgressCard: React.FC<ContactProgressCardProps> = ({
  contact,
  completedSteps = 2,
  totalSteps = 5,
  campaignId,
  campaginStatus,
  leadId,
  refetchCampaigns,
}) => {
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [isAIPaused, setIsAIPaused] = useState(false);

  const [takeOverOpen, setTakeOverOpen] = useState(false);
  const [takeOver, setTakeOver] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [changeCampaignStatus] = useChangeCampaignStatusMutation();

  const handleTakeOverConfirm = async () => {
    const payload = {
      lead_id: leadId,
      campaign_id: campaignId,
      action: "STOP", // ✅ Always STOP
    };
    console.log("TakeOver Payload:", payload);

    try {
      const res = await changeCampaignStatus(payload).unwrap();
      console.log("TakeOver Response:", res);
      toast.success("Campaign stopped successfully");
      refetchCampaigns();

      setTakeOver(true);
    } catch (err: any) {
      console.error("TakeOver API Error:", err);
      toast.error("Failed to stop campaign");
    } finally {
      setTakeOverOpen(false);
    }
  };

  const handlePauseConfirm = async () => {
    const nextAction = campaginStatus === "PAUSE" ? "RESUME" : "PAUSE";

    const payload = {
      lead_id: leadId,
      campaign_id: campaignId,
      // action: campaginStatus === "PAUSE" ? "RESUME" : "PAUSE",
      action: nextAction,
    };
    console.log("Payload being sent:", payload);

    try {
      const res = await changeCampaignStatus(payload).unwrap();
      console.log("Response:", res);
      toast.success(
        nextAction === "PAUSE"
          ? "AI Resumed Successfully"
          : "AI Paused Successfully"
      );

      setIsAIPaused(nextAction === "PAUSE");
      // setIsAIPaused(true);
      refetchCampaigns();
    } catch (err: any) {
      console.error("API Error:", err);
      toast.error("Failed to pause AI");
      setIsAIPaused(false);
    } finally {
      setPauseDialogOpen(false);
    }
  };

  return (
    <Box className={styles.contactProgressRoot}>
      <Box className={styles.contactBox}>
        {/* <Avatar
          className={`${styles.avatarBox} ${
            contact.id >= 85
              ? styles.green
              : contact.id >= 61 && contact.id < 85
              ? styles.yellow
              : styles.red
          }`}
        >
          {contact.id}
        </Avatar> */}

        <Stack spacing={0.2}>
          <Typography className={styles.title}>{contact.name}</Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            className={styles.subTitle}
          >
            {contact.inquiry_type}
          </Typography>
        </Stack>
      </Box>

      {/* Progress Bar */}
      <Box className={styles.progressBox}>
        <Typography variant="body2" className={styles.progressText}>
          Progress Status
        </Typography>

        <Box className={styles.progressbar}>
          {Array.from({ length: totalSteps || 5 }).map((_, index) => (
            <Box
              key={index}
              className={`${styles.progressBarStep} ${
                index < completedSteps ? styles.active : "0"
              }`}
            />
          ))}
        </Box>
      </Box>

      {/* Buttons */}
      <Box className={styles.buttonBox}>
        {/* {!isAIPaused ? ( */}
        <Button
          variant="outlined"
          startIcon={campaginStatus === "PAUSE" ? <Pause /> : <PlayArrow />}
          className={styles.pauseButton}
          onClick={() => setPauseDialogOpen(true)}
        >
          {campaginStatus === "IN_PROGRESS" ? "RESUME" : "PAUSE"}

          {/* {isAIPaused ? "RESUME" : "PAUSE"} */}
        </Button>
        {/* ) : (
          <Button
            variant="outlined"
            startIcon={
              campaginStatus === "PAUSE" ? <AssignAI /> : <PlayArrow />
            }
            className={styles.assignAIButton}
            onClick={() => setPauseDialogOpen(true)}
          >
            {campaginStatus === "IN_PROGRESS" ? "RESUME" : "PAUSE"}
          </Button> */}
        {/* )} */}

        {/* {!takeOver ? ( */}
        <Button
          variant="contained"
          className={styles.takeOverButton}
          onClick={() => setTakeOverOpen(true)}
        >
          Take Over
        </Button>
        {/* ) : (
          <AfterTakeOver></AfterTakeOver>
        )} */}

        <PauseAIDialog
          open={pauseDialogOpen}
          onClose={() => setPauseDialogOpen(false)}
          leadName={contact.name}
          // onPauseConfirm={() => {
          //   setIsAIPaused(true);
          //   setPauseDialogOpen(false);
          // }}
          onPauseConfirm={handlePauseConfirm}
          campaginStatus={campaginStatus}
        />
        <TakeOverDialog
          open={takeOverOpen}
          onClose={() => setTakeOverOpen(false)}
          onConfirm={handleTakeOverConfirm}
        />

        {/* <TakeOverDialog
          open={takeOverOpen}
          onClose={() => setTakeOverOpen(false)}
          selectedReason={selectedReason}
          onReasonChange={(reason) => setSelectedReason(reason)}
          // onConfirm={() => {
          //   setTakeOver(true);
          //   setTakeOverOpen(false);
          // }}
          onConfirm={handlePauseConfirm}
        /> */}
      </Box>
    </Box>
  );
};

export default ContactProgressCard;
// No fear
// Meditation
// Physical strength
// Diet
// { }
