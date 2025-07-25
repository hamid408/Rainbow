"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";
import CustomButton from "@/components/common/CustomButton";
import { useGetCallLogsQuery } from "@/redux/services/twilio/twilioApi";
import { useEffect, useState } from "react";

interface CallLogModalProps {
  open: boolean;
  onClose: () => void;
  provider_event_id: string | null;
}

const CallLogModal = ({
  open,
  onClose,
  provider_event_id,
}: CallLogModalProps) => {
  const [callData, setCallData] = useState<any>(null);

  const {
    data: callLogApiData,
    isLoading,
    isSuccess,
    refetch,
  } = useGetCallLogsQuery(
    { provider_event_id },
    {
      skip: !provider_event_id,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setCallData(null);
    if (provider_event_id) {
      refetch();
    }
  }, [provider_event_id]);

  useEffect(() => {
    if (isSuccess && callLogApiData) {
      setCallData(callLogApiData);
    }
  }, [isSuccess, callLogApiData]);

  const renderFormattedTranscript = () => {
    if (!callData?.transcript) return null;

    const lines = callData.transcript.trim().split("\n");

    return (
      <Box display="flex" flexDirection="column" gap={1} mt={1}>
        {lines.map((line: string, idx: number) => {
          const isUser = line.startsWith("User:");
          const isAgent = line.startsWith("Agent:");
          const message = line.replace(/^User:\s?|^Agent:\s?/, "");

          return (
            <Box
              key={idx}
              display="flex"
              justifyContent={isUser ? "flex-end" : "flex-start"}
            >
              <Box
                maxWidth="75%"
                bgcolor={isUser ? "#e3f2fd" : "#f1f1f1"}
                px={2}
                py={1}
                borderRadius={2}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  textAlign={isUser ? "right" : "left"}
                  mb={0.5}
                >
                  {isUser ? "User" : "Agent"}
                </Typography>
                <Typography
                  variant="body2"
                  textAlign={isUser ? "right" : "left"}
                >
                  {message}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

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
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Status:{" "}
          {callData?.call_status || callData?.conversation_status || "—"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 300 }}>
        {!provider_event_id || !callData ? (
          // <Typography>Loading call details...</Typography>
          <CircularProgress />
        ) : (
          <>
            <Box mb={2}>
              <Typography fontWeight={600} mb={1} fontSize={20}>
                Recording:
              </Typography>
              {callData?.presigned_url ? (
                <>
                  <audio
                    controls
                    src={callData.presigned_url}
                    style={{ width: "100%" }}
                    onError={() => console.error("Failed to load audio")}
                  />
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    mt={0.5}
                    sx={{ cursor: "pointer" }}
                  >
                    <Link
                      href={callData.presigned_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open recording in new tab
                    </Link>
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recording available
                </Typography>
              )}
            </Box>

            <Typography fontWeight={600} mb={1} fontSize={20}>
              Transcript:
            </Typography>
            {callData?.transcript ? (
              renderFormattedTranscript()
            ) : (
              <Typography variant="body2" color="text.secondary">
                No transcript available
              </Typography>
            )}

            <Divider sx={{ margin: "16px" }} />
            <Box mt={3}>
              <Typography variant="body2">
                <strong>Disconnection Reason:</strong>{" "}
                {callData?.disconnection_reason || "—"}
              </Typography>
              <Typography variant="body2">
                <strong>Voicemail:</strong>{" "}
                {callData?.in_voicemail ? "Yes" : "No"}
              </Typography>
            </Box>
          </>
        )}
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
