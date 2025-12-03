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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const convertTimestampToSeconds = (timestamp: string = "") => {
    if (!timestamp) return 0;

  const toggleCard = (index: number) => {
    if (openIndex === index) setOpenIndex(null);
    else setOpenIndex(index);
  };

  useEffect(() => {
    if (!open) {
      setOpenIndex(null);
      setOpenTranscript(false);
    }
  }, [open]);

  const memoizedAudioUrl = useMemo(() => slot?.audioUrl, [slot?.audioUrl]);

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

  const allCalls = useMemo(() => slot?.calls ?? [], [slot?.calls]);

  const currentCall = useMemo(() => {
    if (!allCalls.length) return null;
    return selectedCall !== null ? allCalls[selectedCall] : allCalls.at(-1);
  }, [allCalls, selectedCall]);

  const currentCallSlots = useMemo(() => {
    return slot?.slots ?? [];
  }, [slot?.slots]);

  const audioUrl = useMemo(
    () => currentCall?.recording_url || slot?.audioUrl || "",
    [currentCall, slot?.audioUrl]
  );

  const markers = useMemo(() => {
    const referenceSlots = slot?.slots ?? [];
    if (!referenceSlots) return [];
    return Object.entries(referenceSlots).map(([key, s]: any) => ({
      time: convertTimestampToSeconds(s.timestamp),
      label: s.key || key,
    }));
  }, [slot?.slots]);

  useEffect(() => {
    if (open) {
      setSelectedCall(null);
      setOpenIndex(null);
      setOpenTranscript(false);
      setPendingSeek(null);
    }
  }, [open]);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSlotClick = (index: number, data: any) => {
    const seconds = convertTimestampToSeconds(data.timestamp);
    toggleCard(index);
    audioRef.current?.seekTo(seconds);
  };

  const handleCallChange = (callIndex: number | null) => {
    setSelectedCall(callIndex);
    setOpenIndex(null);
    setPendingSeek(null);
  };

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
        {/* Sticky Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "background.paper",
            pt: 2,
            pb: 2,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight={600}>
            {slot?.title || "Audio Details"}
          </Typography>

        <Box sx={{ width: "100%", overflowX: "hidden" }}>
          <AudioWaveform
            ref={audioRef}
            audioUrl={memoizedAudioUrl}
            markers={markers}
            onReady={() => {
              if (pendingSeek !== null) {
                audioRef.current?.seekTo(pendingSeek);
                setPendingSeek(null);
              }
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {allCalls.length > 1 && (
          <Box mb={2}>
            <Typography fontWeight={700} fontSize={isMobile ? 16 : 20}>
              Calls
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {allCalls.map((_: any, index: number) => {
                const isLatestCall = index === allCalls.length - 1;
                const isSelected = selectedCall === index || (selectedCall === null && isLatestCall);
                
                return (
                  <Chip
                    key={index}
                    label={`Call ${index + 1}`}
                    onClick={() =>
                      handleCallChange(selectedCall === index ? null : index)
                    }
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                  />
                );
              })}
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Transcript */}
        <Box my={2}>
          <Typography fontWeight={700} fontSize={isMobile ? 16 : 20} mb={1}>
            Transcript
          </Typography>

          <ListItemButton
            onClick={() => setOpenTranscript((prev) => !prev)}
            sx={{ borderRadius: 1, px: 2, py: 0.5 }}
          >
            <Typography fontWeight={600} fontSize={isMobile ? 14 : 16}>
              {openTranscript ? "Hide Transcript" : "Show Transcript"}
            </Typography>
          </Box>
        </Collapse>

        <Divider sx={{ my: 2 }} />

        <Typography
          fontWeight={700}
          fontSize={isMobile ? 16 : 20}
          sx={{ mb: 1, px: 1 }}
        >
          Slots
        </Typography>

        {!hasSlots ? (
          <Typography
            fontSize={15}
            sx={{ px: 2, py: 1, opacity: 0.7 }}
          >
            No slots available
          </Typography>
        ) : (
          Object.entries(slot.slots).map(([key, data]: any, index: number) => (
            <Card key={index} variant="outlined" sx={{ mb: 1.5 }}>
              <CardContent>
                <ListItemButton
                  onClick={() => {
                    toggleCard(index);
                    const seconds = convertTimestampToSeconds(data.timestamp);
                    audioRef.current?.seekTo(seconds);
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
                  <Box px={2}>
                    <Typography fontSize={14} mb={0.5}>
                      <strong>Value:</strong> {data.value || "—"}
                    </Typography>
                    <Typography fontSize={14}>
                      <strong>Timestamp:</strong>{" "}
                      {data.timestamp ? formatTimestamp(data.timestamp) : "—"}
                    </Typography>
                    <Typography fontSize={14}>
                      <strong>Description:</strong>{" "}
                      {data.description || "—"}
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