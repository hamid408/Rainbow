// AdminDashboard.tsx
import { Box } from "@mui/material";
import React from "react";
import CardComponent from "./CardComponent";
import { conversationData, messageData } from "./data";
import CardsRow from "./CardsRow";
import styles from "./styles.module.scss";
import { ThreeDotsVertical } from "@/src/assests/icons";
import {
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

const AdminDashboard = () => {
  return (
    <Box className={styles.indexRoot}>
      {/* Top row */}
      <CardsRow />

      {/* Left Card */}
      <Box sx={{ display: "flex", gap: "16px" }}>
        <Box className={styles.cardRoot}>
          <Box className={styles.cardHeadingBox}>
            <Box className={styles.headingLeftBox}>
              <Box className={styles.redDot}></Box>
              <Typography className={styles.headingTypo}>
                Live Conversation Monitor
              </Typography>
            </Box>

            <IconButton size="small">
              <ThreeDotsVertical></ThreeDotsVertical>
            </IconButton>
          </Box>

          <Divider className={styles.divider} />

          <Box className={styles.conversationBox}>
            <CardComponent type="conversation" data={conversationData} />
          </Box>
        </Box>

        {/* Right Card */}
        <Box className={styles.cardRoot}>
          <Box className={styles.cardHeadingBox}>
            <Box className={styles.headingLeftBox}>
              <Typography className={styles.headingTypo}>
                Quality Control Tools
              </Typography>
            </Box>

            <IconButton size="small">
              <ThreeDotsVertical></ThreeDotsVertical>
            </IconButton>
          </Box>

          <Divider className={styles.divider} />

          <Box flex={1} minWidth={350} display="flex" marginRight={17}>
            <CardComponent type="message" data={messageData} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
