// AdminDashboard.tsx
import { Box } from "@mui/material";
import React from "react";
import CardComponent from "./CardComponent";
import userData, { conversationData, messageData } from "./data";
import CardsRow from "./CardsRow";
import styles from "./styles.module.scss";
import { ThreeDotsVertical } from "@/src/assests/icons";
import { Divider, IconButton, Typography } from "@mui/material";
import useUserManagementColumns from "@/src/hooks/Ag-Grid/useUserManagementColumn";
import { userColumn } from "@/src/constants/Grid-Table/ColDefs";
import AgGridTable from "@/src/components/ag-grid";
import { usersRows } from "@/src/constants/Grid-Table/RowData";

const AdminDashboard = () => {
  const userCol = useUserManagementColumns(userColumn);
  return (
    <Box className={styles.indexRoot}>
      <CardsRow />

      <Box className={styles.bothCards}>
        <Box className={styles.cardRoot}>
          <Box className={styles.cardHeadingBox}>
            <Box className={styles.headingLeftBox}>
              <Box className={styles.redDot}></Box>
              <Typography className={styles.headingTypo}>
                Live Conversation Monitor
              </Typography>
            </Box>

            <IconButton size="small">
              <ThreeDotsVertical />
            </IconButton>
          </Box>

          <Divider className={styles.divider} />

          <Box className={styles.conversationBox}>
            <CardComponent type="conversation" data={conversationData} />
          </Box>
        </Box>

        <Box className={styles.cardRoot}>
          <Box className={styles.cardHeadingBox}>
            <Box className={styles.headingLeftBox}>
              <Typography
                className={styles.headingTypo}
                variant="body1"
                fontSize={18}
                fontWeight={600}
              >
                Quality Control Tools
              </Typography>
            </Box>

            <IconButton size="small">
              <ThreeDotsVertical />
            </IconButton>
          </Box>

          <Divider className={styles.divider} />

          <Box flex={1} minWidth={350} display="flex">
            <CardComponent type="message" data={messageData} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ borderRadius: "12px", border: "1px solid #C1C7D0" }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            // variant="body1"
            color="#0D0D12"
            fontWeight={600}
            m={2.4}
            fontSize={18}
          >
            User Performance View
          </Typography>
          <Box pr={3.4} sx={{ cursor: "pointer" }}>
            <ThreeDotsVertical />
          </Box>
        </Box>
        {/* <AgGridTable
          rowData={usersRows}
          columnDefs={userCol}
          domLayout="autoHeight"
        /> */}

        <Box sx={{ display: { md: "block", xs: "none" } }}>
          <AgGridTable
            rowData={usersRows}
            columnDefs={userCol}
            domLayout="autoHeight"
          />
        </Box>
        <Box>
          <Box
            sx={{ display: { xs: "block", md: "none" } }}
            paddingInline={2.5}
          ></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
