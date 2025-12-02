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
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const convertTimestampToSeconds = (timestamp: string = "") => {
    // Add null/undefined check
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
    const total = convertTimestampToSeconds(timestamp);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const allCalls = useMemo(() => slot?.calls ?? [], [slot?.calls]);

  const currentCall = useMemo(() => {
    if (!allCalls.length) return null;
    return selectedCall !== null ? allCalls[selectedCall] : allCalls.at(-1);
  }, [allCalls, selectedCall]);

  const currentCallSlots = useMemo(() => {
    if (!allCalls.length) return {};

    if (selectedCall !== null) {
      return allCalls[selectedCall]?.slots ?? {};
    }

    const merged: any = {};
    allCalls.forEach((call: any, callIndex: number) => {
      Object.entries(call.slots ?? {}).forEach(([key, value]: any) => {
        merged[`${key}_call_${callIndex}`] = {
          ...value,
          originalKey: key,
          callIndex,
        };
      });
    });
    return merged;
  }, [allCalls, selectedCall]);

  const audioUrl = useMemo(
    () => currentCall?.recording_url || slot?.audioUrl || "",
    [currentCall, slot?.audioUrl]
  );

  const markers = useMemo(() => {
    const referenceSlots =
      selectedCall !== null
        ? allCalls[selectedCall]?.slots
        : allCalls.at(-1)?.slots;
    if (!referenceSlots) return [];
    return Object.entries(referenceSlots).map(([key, s]: any) => ({
      time: convertTimestampToSeconds(s.timestamp),
      label: s.key || key,
    }));
  }, [allCalls, selectedCall]);

  useEffect(() => {
    if (open) {
      setSelectedCall(null);
      setOpenIndex(null);
      setOpenTranscript(false);
      setPendingSeek(null);
    }
  }, [open]);

  const toggleCard = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSlotClick = (index: number, data: any) => {
    const seconds = convertTimestampToSeconds(data.timestamp);

    if (selectedCall === null && data.callIndex !== undefined) {
      const latestCallIndex = allCalls.length - 1;

      if (data.callIndex !== latestCallIndex) {
        setSelectedCall(data.callIndex);
        setOpenIndex(null);
        setPendingSeek(seconds);
        return;
      }
    }

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
          outline: "none",
        }}
      >
        {/* Sticky Header */}
        <Box
          sx={{
            position: "sticky",
            top: 10,
            zIndex: 10,
            background: "white",
            pb: 2,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight={600} mt={2}>
            {slot?.title || "Audio Details"}
          </Typography>

          <AudioWaveform
            key={audioUrl}
            ref={audioRef}
            audioUrl={audioUrl}
            markers={markers}
            onReady={() => {
              if (pendingSeek !== null) {
                audioRef.current?.seekTo(pendingSeek);
                setPendingSeek(null);

                if (selectedCall !== null) {
                  const newSlots = allCalls[selectedCall]?.slots ?? {};
                  const newIndex = Object.keys(newSlots).findIndex(
                    (key) =>
                      key ===
                      currentCallSlots[Object.keys(currentCallSlots)[0]]
                        ?.originalKey
                  );
                  if (newIndex !== -1) setOpenIndex(newIndex);
                }
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
              {allCalls.map((_: any, index: number) => (
                <Chip
                  key={index}
                  label={`Call ${index + 1}`}
                  onClick={() =>
                    handleCallChange(selectedCall === index ? null : index)
                  }
                  variant={selectedCall === index ? "filled" : "outlined"}
                  color={selectedCall === index ? "primary" : "default"}
                  sx={{ cursor: "pointer", fontWeight: 600 }}
                />
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Transcript */}
        <Box my={2}>
          <ListItemButton
            onClick={() => setOpenTranscript((p) => !p)}
            sx={{ borderRadius: 1, px: 1, py: 0.5 }}
          >
            <Typography fontWeight={700} fontSize={isMobile ? 16 : 20}>
              Transcript
            </Typography>
          </ListItemButton>

          <Collapse in={openTranscript} timeout={300}>
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

        <Typography fontWeight={700} fontSize={isMobile ? 16 : 20} mb={1}>
          Slots
        </Typography>

        {Object.entries(currentCallSlots).length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No slots available
          </Typography>
        ) : (
          Object.entries(currentCallSlots).map(([key, data]: any, index) => (
            <Card key={key} variant="outlined" sx={{ mb: 1.5 }}>
              <CardContent>
                <ListItemButton
                  onClick={() => handleSlotClick(index, data)}
                  sx={{
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    mb: openIndex === index ? 1 : 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={isMobile ? 13 : 15}
                  >
                    {data.key || data.originalKey || key}
                  </Typography>
                </ListItemButton>

                <Collapse in={openIndex === index} timeout={300}>
                  <Box px={1} pl={2}>
                    <Typography fontSize={14} mb={0.5}>
                      <strong>Value:</strong> {data.value || "—"}
                    </Typography>
                    <Typography fontSize={14} mb={0.5}>
                      <strong>Timestamp:</strong>{" "}
                      {formatTimestamp(data.timestamp)}
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
