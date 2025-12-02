

"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";

interface Marker {
  time: number;
  label: string;
}

interface AudioWaveformProps {
  audioUrl: string;
  markers?: Marker[];
}

const AudioWaveform = forwardRef(
  ({ audioUrl, markers = [] }: AudioWaveformProps, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const lastUrlRef = useRef<string>("");

    useEffect(() => {
      if (!containerRef.current || !audioUrl) return;

      if (!wavesurferRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: containerRef.current,
          waveColor: "#C7D2FE",
          progressColor: "#4F46E5",
          cursorColor: "#111",
          height: 90,
          barWidth: 2,
        });
      }

      const ws = wavesurferRef.current;

      if (audioUrl !== lastUrlRef.current) {
        setIsLoading(true); 
        ws.load(audioUrl);
        lastUrlRef.current = audioUrl;
      }

      ws.on("ready", () => {
        setIsLoading(false); 
        setDuration(ws.getDuration());
        setCurrentTime(0);

        markers.forEach((marker) => {
          const el = document.createElement("div");
          el.style.position = "absolute";
          el.style.left = `${(marker.time / ws.getDuration()) * 100}%`;
          el.style.top = "0";
          el.style.width = "2px";
          el.style.height = "100%";
          el.style.backgroundColor = "#FF4081";
          el.title = marker.label;
          containerRef.current?.appendChild(el);
        });
      });

      ws.on("audioprocess", () => setCurrentTime(ws.getCurrentTime()));
      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      return () => ws.unAll();
    }, [audioUrl, markers]);

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        const ws = wavesurferRef.current;
        if (!ws || !ws.getDuration()) return;
        ws.seekTo(time / ws.getDuration());
        ws.play();
      },
      play: () => wavesurferRef.current?.play(),
      pause: () => wavesurferRef.current?.pause(),
    }));

    const handlePlayPause = () => {
      if (isLoading) return; 
      const ws = wavesurferRef.current;
      ws?.playPause();
      setIsPlaying(ws?.isPlaying() || false);
    };

    return (
      <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
        <Button
          variant="outlined"
          onClick={handlePlayPause}
          sx={{ borderRadius: "12px" }}
          disabled={isLoading} 
          startIcon={isLoading ? null : isPlaying ? <Pause /> : <PlayArrow />}
        >
          {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
        </Button>

        <Box
          sx={{
            width: "100%",
            height: 90,
            position: "relative",
            backgroundColor: "#f9fafb",
            borderRadius: 2,
          }}
        >
          {isLoading && (
            <Stack
              sx={{
                position: "absolute",
                inset: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.7)",
                zIndex: 10,
              }}
            >
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1, color: "grey.700" }}>
                Loading audio...
              </Typography>
            </Stack>
          )}

          <Box
            ref={containerRef}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: isLoading ? 0.3 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>
      </Stack>
    );
  }
);

AudioWaveform.displayName = "AudioWaveform";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}

export default AudioWaveform;
