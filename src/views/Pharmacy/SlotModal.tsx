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
  Chip,
} from "@mui/material";
import AudioWaveform from "./AudioWaveForm";

const SlotModal = ({ open, slot, onClose }: any) => {
  const audioRef = useRef<any>(null);
  const [openTranscript, setOpenTranscript] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCall, setSelectedCall] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get all calls
  const allCalls = useMemo(() => slot?.calls || [], [slot?.calls]);

  // Get current call based on selection (null = show all, but use latest for audio/transcript)
  const currentCall = useMemo(() => {
    if (!allCalls.length) return null;
    if (selectedCall !== null && allCalls[selectedCall]) {
      return allCalls[selectedCall];
    }
    return allCalls[allCalls.length - 1]; // Latest call
  }, [allCalls, selectedCall]);

  // Get slots based on selection
  const currentCallSlots = useMemo(() => {
    if (!allCalls.length) return {};
    
    if (selectedCall !== null) {
      // Show only selected call's slots
      return allCalls[selectedCall]?.slots || {};
    }
    
    // Show all slots from all calls
    return Object.assign(
      {},
      ...allCalls.map((call: any) => call.slots || {})
    );
  }, [allCalls, selectedCall]);

  // Get audio URL
  const audioUrl = useMemo(() => {
    return currentCall?.recording_url || slot?.audioUrl || "";
  }, [currentCall, slot?.audioUrl]);

  // Generate markers for waveform
  const markers = useMemo(() => {
    const convertTimestamp = (timestamp: string) => {
      if (!timestamp) return 0;
      const parts = timestamp.split(":").map(Number);
      
      if (parts.length === 3) {
        const [h, m, s] = parts;
        return h * 3600 + m * 60 + s;
      }
      if (parts.length === 2) {
        const [m, s] = parts;
        return m * 60 + s;
      }
      return 0;
    };

    return Object.entries(currentCallSlots).map(([key, s]: any) => ({
      time: convertTimestamp(s.timestamp),
      label: s.key || key,
    }));
  }, [currentCallSlots]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedCall(null);
      setOpenIndex(null);
      setOpenTranscript(false);
    }
  }, [open]);

  // Reset audio position when call changes
  useEffect(() => {
    if (audioRef.current && open) {
      audioRef.current.seekTo(0);
    }
  }, [selectedCall, open]);

  const toggleCard = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const convertTimestampToSeconds = (timestamp: string) => {
    if (!timestamp) return 0;
    const parts = timestamp.split(":").map(Number);
    
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    }
    if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }
    return 0;
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "—";
    const totalSeconds = convertTimestampToSeconds(timestamp);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleCallChange = (callIndex: number | null) => {
    setSelectedCall(callIndex);
    setOpenIndex(null); // Close any open slot cards
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        px={isMobile ? 2 : 3}
        pb={isMobile ? 2 : 3}
        pt={0}
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
          border: "none",
          outline: "none",
        }}
      >
        {/* Sticky Header with Audio Player */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "white",
            pb: 2,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight={600} mt={2}>
            {slot?.title || "Audio Details"}
          </Typography>
          <AudioWaveform
            key={audioUrl} // Force re-render when audio changes
            ref={audioRef}
            audioUrl={audioUrl}
            markers={markers}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Call Selection Chips */}
        {allCalls.length > 0 && (
          <Box mb={2}>
            <Typography fontWeight={700} fontSize={isMobile ? 16 : 20}>
              Calls
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              <Chip
                label="All Calls"
                onClick={() => handleCallChange(null)}
                variant={selectedCall === null ? "filled" : "outlined"}
                color={selectedCall === null ? "primary" : "default"}
                sx={{
                  cursor: "pointer",
                  fontWeight: selectedCall === null ? 600 : 500,
                }}
              />
              {allCalls.map((call: any, index: number) => (
                <Chip
                  key={index}
                  label={`Call ${index + 1}`}
                  onClick={() => handleCallChange(index)}
                  variant={selectedCall === index ? "filled" : "outlined"}
                  color={selectedCall === index ? "primary" : "default"}
                  sx={{
                    cursor: "pointer",
                    fontWeight: selectedCall === index ? 600 : 500,
                  }}
                />
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Transcript Section */}
        <Box my={2}>
          <ListItemButton
            onClick={() => setOpenTranscript((prev) => !prev)}
            sx={{ borderRadius: 1, px: 1, py: 0.5 }}
          >
            <Typography fontWeight={700} fontSize={isMobile ? 16 : 20}>
              Transcript
              {selectedCall === null && allCalls.length > 1 && " (Latest Call)"}
              {selectedCall !== null && ` (Call ${selectedCall + 1})`}
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
                {currentCall?.transcript || "No transcript available"}
              </Typography>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Slots Section */}
        <Typography fontWeight={700} fontSize={isMobile ? 16 : 20} mb={1}>
          Slots
          {selectedCall !== null && ` (Call ${selectedCall + 1})`}
          {selectedCall === null && allCalls.length > 1 && " (All Calls)"}
        </Typography>

        {Object.entries(currentCallSlots).length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No slots available
          </Typography>
        ) : (
          Object.entries(currentCallSlots).map(([key, data]: any, index: number) => (
            <Card key={`${key}-${index}`} variant="outlined" sx={{ mb: 1.5 }}>
              <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                <ListItemButton
                  onClick={() => {
                    toggleCard(index);
                    const seconds = convertTimestampToSeconds(data.timestamp);
                    if (audioRef.current) {
                      audioRef.current.seekTo(seconds);
                    }
                  }}
                  sx={{ borderRadius: 1, px: 1, py: 0.5, mb: openIndex === index ? 1 : 0 }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={isMobile ? 13 : 15}
                  >
                    {data.key || key}
                  </Typography>
                </ListItemButton>

                <Collapse in={openIndex === index} timeout={300} unmountOnExit>
                  <Box px={1} pl={2}>
                    <Typography fontSize={14} mb={0.5}>
                      <strong>Value:</strong> {data.value || "—"}
                    </Typography>
                    <Typography fontSize={14} mb={0.5}>
                      <strong>Timestamp:</strong>{" "}
                      {data.timestamp ? formatTimestamp(data.timestamp) : "—"}
                    </Typography>
                    <Typography fontSize={14}>
                      <strong>Description:</strong> {data.description || "—"}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))
        )}

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Typography
            onClick={onClose}
            sx={{
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 500,
              fontSize: isMobile ? 14 : 16,
              "&:hover": { textDecoration: "underline" },
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