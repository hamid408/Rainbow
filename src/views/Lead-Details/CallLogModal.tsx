// "use client";

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Box,
//   Link,
// } from "@mui/material";
// import CustomButton from "@/src/components/common/CustomButton";

// interface CallLogModalProps {
//   open: boolean;
//   onClose: () => void;
//   data: {
//     transcript: string;
//     recording_url: string;
//     call_status: string;
//     in_voicemail: boolean;
//     disconnection_reason: string;
//   } | null;
// }

// const CallLogModal = ({ open, onClose, data }: CallLogModalProps) => {
//   if (!data) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ fontSize: "22px", fontWeight: "600" }}>
//         Call Recording & Transcript
//       </DialogTitle>
//       <DialogContent>
//         <Box mb={2}>
//           <Typography fontWeight={600} mb={1} fontSize={20}>
//             Recording:
//           </Typography>
//           <audio controls src={data.recording_url} style={{ width: "100%" }} />
//           <Typography fontSize={12} color="text.secondary" mt={0.5}>
//             <Link
//               href={data.recording_url}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Open recording in new tab
//             </Link>
//           </Typography>
//         </Box>

//         <Typography fontWeight={600} mb={1} fontSize={20}>
//           Transcript:
//         </Typography>
//         <Typography variant="body2" whiteSpace="pre-wrap">
//           {data.transcript}
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <CustomButton onClick={onClose} variant="outlined">
//           Close
//         </CustomButton>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CallLogModal;
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
    recording_url: string;
    call_status: string;
    in_voicemail: boolean;
    disconnection_reason: string;
    conversation_status: string;
  } | null;
}

const CallLogModal = ({ open, onClose, data }: CallLogModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontSize: "22px",
          fontWeight: "600",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Call Recording & Transcript
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600,color: "text.primary" }}
          
        >
          Status:{" "}
          {data.call_status ? data.call_status : data.conversation_status}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <Typography fontWeight={600} mb={1} fontSize={20}>
            Recording:
          </Typography>
          <audio controls src={data.recording_url} style={{ width: "100%" }} />
          <Typography fontSize={12} color="text.secondary" mt={0.5}>
            <Link
              href={data.recording_url}
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

        <Box mt={3}>
          <Typography variant="body2">
            <strong>Disconnection Reason:</strong>{" "}
            {data.disconnection_reason || "—"}
          </Typography>
          <Typography variant="body2">
            <strong>Voicemail:</strong> {data.in_voicemail ? "Yes" : "No"}
          </Typography>
        </Box>
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
