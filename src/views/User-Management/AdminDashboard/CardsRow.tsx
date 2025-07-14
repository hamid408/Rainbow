"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Arrow, Urgent } from "@/src/assests/icons";
import styles from "./styles.module.scss";


export default function CardsRow() {
  return (
    <Box className={styles.cardRowMainBox}>
      {/* First Card */}
      <Card className={styles.cardRowCard}>
        <CardContent>
          <Typography variant="subtitle1" className={styles.cardTitle}>
            Active Outreach
          </Typography>
          <Typography variant="h5" className={styles.cardNumber1}>
            350
          </Typography>
        </CardContent>
      </Card>

      {/* Second Card */}
      <Card className={styles.cardRowCard}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Urgent></Urgent>
            <Typography variant="subtitle2" className={styles.cardTitle}>
              Hot Leads Awaiting User Follow Up
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            mt={2}
            alignItems="center"
          >
            <Typography variant="h6" className={styles.cardNumber2}>
              75%
            </Typography>
            <Button
              variant="outlined"
              size="small"
              endIcon={<Arrow></Arrow>}
              className={styles.cardsRowBtn}
            >
              See Details
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Third Card */}
      <Card className={styles.cardRowCard}>
        <CardContent>
          <Typography variant="subtitle1" className={styles.cardTitle}>
            Alerts Conversations
          </Typography>
          <Typography variant="h5" className={styles.cardNumber3}>
            75%
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
