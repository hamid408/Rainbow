"use client";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { viewButtons } from "./data";
import CustomButton from "@/src/components/common/CustomButton";
import { Add } from "@/src/assests/icons";
import styles from "./styles.module.scss";

const TaskHeader = () => {
  const [activeButton, setActiveButton] = useState("list");

   return (
    <Box className={styles.headerMainBox}>
      <Box className={styles.headerSecondaryBox}>
        <Typography variant="h1" className={styles.heading}>
          Task & Reminder
        </Typography>

        <Box className={styles.headerLastBox}>
          <Box className={styles.toggleBox}>
            {viewButtons.map(({ id, icon }) => (
              <Box
                key={id}
                onClick={() => setActiveButton(id)}
                className={`${styles.headerToggleButton} ${
                  activeButton === id ? styles.active : ""
                }`}
              >
                {React.cloneElement(icon, {
                  backgroundColor: activeButton === id ? "#7A4DF5" : "#A0A0A0",
                  sx: {
                    fontSize: 24,
                    color: activeButton === id ? "#7A4DF5" : "#A0A0A0",
                  },
                })}
              </Box>
            ))}
          </Box>
          <CustomButton
            variant="contained"
            startIcon={<Add />}
            className={styles.headerNewTaskBtn}
          >
            Create New Task
          </CustomButton>

          <CustomButton className = {styles.floatingAddBtn}>
            <Add />
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskHeader;
