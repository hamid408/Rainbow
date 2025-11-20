"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  ListItemButton,
  Card,
  CardContent,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AudioWaveform from "./AudioWaveForm";
const SlotModal = ({ open, slot, onClose }: any) => {
  const audioRef = useRef<any>(null);
  const [openTranscript, setOpenTranscript] = useState(false);

  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null); // NEW: track open card
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleCard = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null); // close if already open
    } else {
      setOpenIndex(index); // open clicked card
    }
  };

  useEffect(() => {
    if (!open) {
      setActiveMarker(null);
      setOpenIndex(null); // reset all cards when modal closes
    }
  }, [open]);

  const memoizedAudioUrl = useMemo(() => slot?.audioUrl, [slot?.audioUrl]);

  const convertTimestampToSeconds = (timestamp: string) => {
    if (!timestamp) return 0;
    const [minStr, secStr] = timestamp.split(":");
    const minutes = parseInt(minStr, 10) || 0;
    const seconds = parseFloat(secStr) || 0;
    return minutes * 60 + seconds;
  };

  // Format timestamp for display: "MM:SS" (drop fractional seconds)
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "—";
    const [minStr, secStr] = timestamp.split(":");
    const minutes = parseInt(minStr, 10) || 0;
    const seconds = Math.floor(parseFloat(secStr)) || 0; // drop fractional part
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const markers = slot?.slots
    ? Object.entries(slot.slots).map(([key, s]: any) => ({
        time: convertTimestampToSeconds(s.timestamp),
        label: s.key || key,
      }))
    : [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        p={isMobile ? 2 : 3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 700,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 6,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" mb={2} fontWeight={600}>
          {slot?.title || "Audio Details"}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
          <AudioWaveform
            ref={audioRef}
            audioUrl={memoizedAudioUrl}
            // markers={data.timestamp}
            markers={markers}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* <Box my={2}>
          <Typography fontWeight={600} mb={1}>
            Transcript
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-line",
              fontSize: isMobile ? 13 : 15,
              lineHeight: 1.5,
            }}
          >
            {slot?.transcript || "No transcript available"}
          </Typography>
        </Box> */}

        <Box my={2}>
          <ListItemButton
            onClick={() => setOpenTranscript((prev) => !prev)}
            sx={{ borderRadius: 1, px: 1, py: 0.5 }}
          >
            <Typography fontWeight={700} fontSize={isMobile ? 16 : 20}>
              Transcript
            </Typography>
          </ListItemButton>

          <Collapse in={openTranscript} timeout={300} unmountOnExit>
            <Box px={1} pl={2} mt={1}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  fontSize: isMobile ? 13 : 15,
                  lineHeight: 1.5,
                }}
              >
                {slot?.transcript || "No transcript available"}
              </Typography>
            </Box>
          </Collapse>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight={700} mb={1} fontSize={isMobile ? 16 : 20}>
          Time Slots
        </Typography>
        {slot?.slots &&
          Object.entries(slot.slots).map(([key, data]: any, index: number) => (
            <Card key={index} variant="outlined" sx={{ mb: 1.5 }}>
              <CardContent>
                {/* <ListItemButton
                  onClick={() => toggleCard(index)}
                  sx={{ borderRadius: 1, px: 1, py: 0.5, mb: 1 }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={isMobile ? 13 : 15}
                  >
                    {data.key}
                  </Typography> */}
                <ListItemButton
                  onClick={() => {
                    toggleCard(index);
                    const seconds = convertTimestampToSeconds(data.timestamp);
                    audioRef.current?.seekTo(seconds); // start audio at timestamp
                  }}
                  sx={{ borderRadius: 1, px: 1, py: 0.5, mb: 1 }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={isMobile ? 13 : 15}
                  >
                    {data.key}
                  </Typography>
                </ListItemButton>

                <Collapse in={openIndex === index} timeout={300} unmountOnExit>
                  <Box px={1} pl={2}>
                    <Typography fontSize={14} mb={0.5}>
                      <strong>Value:</strong> {data.value || "—"}
                    </Typography>
                    <Typography fontSize={14}>
                      <strong>Timestamp:</strong>{" "}
                      {data.timestamp ? formatTimestamp(data.timestamp) : "—"}
                    </Typography>
                    <Typography fontSize={14}>
                      <strong>Description:</strong> {data.description || "—"}{" "}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Typography
            onClick={onClose}
            sx={{
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 500,
              fontSize: isMobile ? 14 : 16,
            }}
          >
            Close
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default SlotModal;
