"use client";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import { BigPause } from "@/src/assests/icons";
// import CustomButton from "@/src/components/common/CustomButton";
import styles from "./style.module.scss";

interface PauseAIDialogProps {
  open: boolean;
  onClose: () => void;
  leadName: string;
  onPauseConfirm: () => void;
}

const PauseAIDialog = ({ open, onClose, leadName, onPauseConfirm }: PauseAIDialogProps) => {
  return (
    
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{
      className: styles.pauseDialogBox,
  }}
  >
      <IconButton onClick={onClose} className={styles.dialogCrossIcon}>
        <CloseIcon />
      </IconButton>

      <DialogContent className={styles.dialogContent}>
        {/* <PauseCircleOutlineIcon sx={{ fontSize: 64, color: "#555", mb: 2 }} /> */}
        <BigPause></BigPause>

        <Typography className={styles.dialogHeading}>
          Do you want to pause AI?
        </Typography>

        <Typography variant="body2" className={styles.dialogSubheading}>
          Pausing AI means you want AI to hold the conversation with{" "}
          <strong>{leadName}</strong> until you decide to let AI continue the conversation.
        </Typography>

        <Button variant="contained" color="primary" onClick={onPauseConfirm} className={styles.dialogButton}>
          Agree, Pause AI
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PauseAIDialog;
