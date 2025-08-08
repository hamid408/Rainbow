"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import { Arrow, LargeUrgent, Urgent } from "@/src/assests/icons";
import styles from "./styles.module.scss";
import { useState } from "react";
import { Dialog, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LeadCard from "../../Dashboard/LeadCard";
import CustomButton from "@/src/components/common/CustomButton";

export default function CardsRow() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box className={styles.cardRowMainBox}>
      {/* First Card */}
      <Card className={styles.cardRowCard}>
        <CardContent>
          <Typography
            variant="body2"
            color="#666D80"
            className={styles.cardTitle}
          >
            Active Outreach
          </Typography>
          <Typography variant="h3" mt={3} className={styles.cardNumber1}>
            350
          </Typography>
        </CardContent>
      </Card>

      {/* Second Card */}
      <Card className={styles.cardRowCard}>
        <CardContent>
          <Stack className={styles.secondCardLeadStack}>
            <Urgent />
            <Typography
              variant="body2"
              color="#666D80"
              className={styles.cardTitle}
              sx={{
                "@media(max-width: 350px)": {
                  display: "none",
                },
              }}
            >
              Hot Leads Awaiting User Follow Up
            </Typography>

            <Typography
              variant="body2"
              color="#666D80"
              className={styles.cardTitle}
              sx={{
                display: "none",
                "@media(max-width: 350px)": {
                  display: "block",
                },
              }}
            >
              Leads Awaiting
            </Typography>
          </Stack>

          <Stack className={styles.secondCardNumStack}>
            <Typography
              variant="h3"
              color="#DF1C41"
              className={styles.cardNumber2}
            >
              75.0%
            </Typography>
            <CustomButton
              variant="outlined"
              size="small"
              endIcon={<Arrow></Arrow>}
              className={styles.cardsRowBtn}
              onClick={handleOpenModal}
            >
              See Details
            </CustomButton>
          </Stack>
        </CardContent>
      </Card>

      {/* Third Card */}
      <Card className={styles.cardRowCard}>
        <CardContent>
          <Typography
            variant="body2"
            color="#666D80"
            className={styles.cardTitle}
          >
            Alerts Conversations
          </Typography>
          <Typography
            variant="h3"
            color="#7a4df5"
            mt={3}
            className={styles.cardNumber3}
          >
            75.0%
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: styles.hotLeadsDialog }}
        BackdropProps={{ className: styles.hotLeadsDialogBackdrop }}
      >
        {/* Header */}
        <Box className={styles.hotLeadsDialogHeader}>
          <Box className={styles.titleSection}>
            <LargeUrgent />
            <Typography className={styles.redText}>Hot Leads</Typography>
            <Typography className={styles.blackText}>
              &nbsp;awaiting user Follow-up
            </Typography>
          </Box>

          <IconButton onClick={handleCloseModal} className={styles.closeIcon}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider className={styles.dialogDivider} />

        {/* Body - Call your existing component here */}
        <Box className={styles.dialogContent}>
          <LeadCard
            lead_id="123"
            name="John Doe"
            initials="JD"
            isGoingCold={false}
            serviceType="Web Development"
            serviceName="Landing Page"
            message="Looking for a redesign"
            tag="Hot Lead"
            // page="Dashboard"
            avatarUrl="https://example.com/avatar.jpg"
            phone="+1234567890"
          />
        </Box>
      </Dialog>
    </Box>
  );
}
