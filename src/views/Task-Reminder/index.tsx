"use client";
import { Box } from "@mui/material";
import React from "react";
import TaskReminderCard from "./TaskCard";
import TaskHeader from "./TaskHeader";
import { taskList } from "./data";
import styles from "./styles.module.scss";

const TaskReminder = () => {
  return (
    <Box className = {styles.indexBox}>
      <TaskHeader />
      {taskList.map((task, index) => (
        <TaskReminderCard key={index} {...task} />
      ))}
    </Box>
  );
};

export default TaskReminder;
