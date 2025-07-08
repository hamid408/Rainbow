"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Link,
} from "@mui/material";
import CustomButton from "@/src/components/common/CustomButton";

interface CallLogModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    transcript: string;
    RecordingUrl: string;
  } | null;
}

const CallLogModal = ({ open, onClose, data }: CallLogModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: "22px", fontWeight: "600" }}>
        Call Recording & Transcript
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography fontWeight={600} mb={1} fontSize={20}>
            Recording:
          </Typography>
          <audio controls src={data.RecordingUrl} style={{ width: "100%" }} />
          <Typography fontSize={12} color="text.secondary" mt={0.5}>
            <Link
              href={data.RecordingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open recording in new tab
            </Link>
          </Typography>
        </Box>

        <Typography fontWeight={600} mb={1} fontSize={20}>
          Transcript:
        </Typography>
        <Typography variant="body2" whiteSpace="pre-wrap">
          {data.transcript}
        </Typography>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={onClose} variant="outlined">
          Close
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default CallLogModal;
