"use client";

import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import { contactData } from "./data";
import ContactProgressCard from "./ContactProgressCard";
import OutreachAndSuggestionCard from "./OutreachAndSuggestionCard";
import styles from "./style.module.scss";

const AiReach = () => {
    return (
        <Box className = {styles.indexRoot}>
            {/* 🔹 Heading */}
            <Typography variant="h1" mb="16px" className={styles.mainHeading}>
                AI Outreach Queue
            </Typography>

            {/* 🔹 Contact Cards */}
            {contactData.map((contact, index) => (
                <Box key={index} className = {styles.indexSecondary}>
                    <ContactProgressCard contact={contact} completedSteps={2} totalSteps={5} />

                    <Divider className={styles.divider}
                     />

                    <OutreachAndSuggestionCard
                        status1={contact.outReachStatus1}
                        status2={contact.outReachStatus2}
                        suggestedMessage={contact.message}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default AiReach;
