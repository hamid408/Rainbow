"use client";
import React from "react";
import { Box, Typography, Stack, Button, Checkbox } from "@mui/material";
import CustomButton from "@/components/common/CustomButton";
import { Bell, Details, Meeting, UrgentBlue } from "@/assests/icons";
import CheckCircleOutlineIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./styles.module.scss";

interface TaskReminderCardProps {
  taskTitle: string;
  leadName: string;
  taskDescription: string;
  dueDate: string;
  dueLabel?: string;
  tagLabel?: string;
  tagColor?: string;
}

const TaskReminderCard: React.FC<TaskReminderCardProps> = ({
  taskTitle,
  leadName,
  taskDescription,
  dueDate,
  dueLabel,
  tagLabel,
  tagColor,
}) => {
  return (
    <Box className={`${styles.taskCardBox} ${dueLabel ? styles.due : ""}`}>
      <Stack
        className={styles.taskCardStack}
        sx={{ "@media(max-width: 600px)": { display: "none" } }}
      >
        <Checkbox
          icon={<CheckCircleOutlineIcon />}
          checkedIcon={<CheckCircleIcon />}
          sx={{
            color: "#A0A0A0",
            "&.Mui-checked": {
              color: "#007BFF",
            },
            "@media(max-width: 600px)": {
              marginBottom: "20px",
              display: "none",
            },
          }}
        />

        <Box
          className={styles.taskCardTypoBox}
          sx={{ "@media(max-width: 600px)": { display: "none" } }}
        >
          <Typography variant="body1" className={styles.taskTitle}>
            {taskTitle}
          </Typography>

          <Stack className={styles.taskDetailStack}>
            <Details className={styles.taskDetails} />
            <Typography variant="caption" className={styles.taskDueDate}>
              {dueDate}
            </Typography>
            {dueLabel && (
              <Box className={styles.taskDueLabel}>
                <Bell />
                {dueLabel}
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>

        <Box
          className={styles.leadAndTaskBox}
          sx={{ "@media(max-width: 600px)": { display: "none" } }}
        >
          <Box className={styles.leadNameBox}>
            <Typography variant="body2" className={styles.leadName}>
              Lead:&nbsp;{leadName}
            </Typography>
            {tagLabel && (
              <Box
                className={styles.tagLabelBox}
                sx={{
                  bgcolor: tagColor || "#CEE5FF",
                }}
              >
                <UrgentBlue />
                {tagLabel}
              </Box>
            )}
          </Box>
          <Box> 
          <Typography className={styles.taskDescription}>
            Tasks:&nbsp;{taskDescription}
          </Typography>
          </Box>
        </Box>


      {/* Component for smaller screen(> 600px) starts */}
      <Box
        sx={{
          display: "none",
          "@media(max-width: 600px)": {
            display: "flex",
          },

          "@media(max-width: 360px)":{
            marginLeft: "-10px",
          }
        }}
      >
        <Stack className={styles.taskCardStack}>
          <Checkbox
            icon={<CheckCircleOutlineIcon />}
            checkedIcon={<CheckCircleIcon />}
            sx={{
              color: "#A0A0A0",
              "&.Mui-checked": {
                color: "#007BFF",
              },
              "@media(max-width: 600px)": {
                marginBottom: "20px",
              },
            }}
          />

          <Box className={styles.taskCardTypoBox}>
            <Typography variant="body1" className={styles.taskTitle}>
              {taskTitle}
            </Typography>

            <Stack className={styles.taskDetailStack}>
              <Details className={styles.taskDetails} />
              <Typography variant="caption" className={styles.taskDueDate}>
                {dueDate}
              </Typography>
              {dueLabel && (
                <Box className={styles.taskDueLabel}>
                  <Bell />
                  {dueLabel}
                </Box>
              )}

              {tagLabel && (
              <Box
                className={styles.tagLabelBox}
                sx={{
                  bgcolor: tagColor || "#CEE5FF",
                }}
              >
                <UrgentBlue />
                {tagLabel}
              </Box>
            )}
            </Stack>
          </Box>
        

        <Box className={styles.leadAndTaskBox}>
          <Box className={styles.leadNameBox}>
            <Typography variant="body2" className={styles.leadName}>
              Lead:&nbsp;{leadName}
            </Typography>
            {/* {tagLabel && (
              <Box
                className={styles.tagLabelBox}
                sx={{
                  bgcolor: tagColor || "#CEE5FF",
                }}
              >
                <UrgentBlue />
                {tagLabel}
              </Box>
            )} */}
          </Box>
          <Box>
            <Typography className={styles.taskDescription}>
              Tasks:&nbsp;{taskDescription}
            </Typography>
          </Box>
        </Box>
        </Stack>
      </Box>
      {/* Component for smaller screen ends */}

      <Stack className={styles.taskBtnStack}>
        <CustomButton variant="outlined" className={styles.taskSnoozeBtn}>
          Snooze
        </CustomButton>
        <CustomButton
          variant="outlined"
          startIcon={<Meeting />}
          customColor="#7A4DF5"
          className={styles.taskResheduleBtn}
        >
          Reschedule
        </CustomButton>
      </Stack>
    </Box>
  );
};

export default TaskReminderCard;
