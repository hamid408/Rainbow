// "use client";

// import React, {
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   forwardRef,
//   useState,
// } from "react";
// import WaveSurfer from "wavesurfer.js";
// import { Box, Button, Stack, Typography } from "@mui/material";
// import { Pause, PlayArrow } from "@mui/icons-material";

// interface Marker {
//   time: number;
//   label: string;
// }

// interface AudioWaveformProps {
//   audioUrl: string;
//   markers?: Marker[];
// }

// const AudioWaveform = forwardRef(
//   ({ audioUrl, markers = [] }: AudioWaveformProps, ref) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const wavesurferRef = useRef<WaveSurfer | null>(null);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [duration, setDuration] = useState(0);
//     const [currentTime, setCurrentTime] = useState(0);

//     // Setup WaveSurfer
//     useEffect(() => {
//       if (!containerRef.current || !audioUrl) return;

//       const ws = WaveSurfer.create({
//         container: containerRef.current,
//         waveColor: "#C7D2FE",
//         progressColor: "#4F46E5",
//         cursorColor: "#111",
//         height: 90,
//         barWidth: 2,
//         // responsive: true,
//       });

//       wavesurferRef.current = ws;

//       ws.load(audioUrl);

//       ws.on("ready", () => {
//         setDuration(ws.getDuration());
//         // add markers if any
//         const total = ws.getDuration();
//         markers.forEach((marker) => {
//           const el = document.createElement("div");
//           el.style.position = "absolute";
//           el.style.left = `${(marker.time / total) * 100}%`;
//           el.style.top = "0";
//           el.style.width = "2px";
//           el.style.height = "100%";
//           el.style.backgroundColor = "#FF4081";
//           el.title = marker.label;
//           containerRef.current?.appendChild(el);
//         });
//       });

//       ws.on("audioprocess", () => {
//         setCurrentTime(ws.getCurrentTime());
//       });

//       ws.on("finish", () => {
//         setIsPlaying(false);
//         setCurrentTime(0);
//       });

//       return () => {
//         ws.destroy();
//       };
//     }, [audioUrl, markers]);

//     // Expose seekTo() externally if needed
//     useImperativeHandle(ref, () => ({
//       seekTo: (time: number) => {
//         const ws = wavesurferRef.current;
//         if (ws) {
//           const dur = ws.getDuration();
//           if (dur > 0) ws.seekTo(time / dur);
//         }
//       },
//     }));

//     // Toggle play/pause
//     const handlePlayPause = () => {
//       const ws = wavesurferRef.current;
//       if (!ws) return;
//       ws.playPause();
//       setIsPlaying(ws.isPlaying());
//     };

//     return (
//       <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
//         <Button
//           variant="outlined"
//           onClick={handlePlayPause}
//           sx={{ borderRadius: "12px" }}
//           startIcon={isPlaying ? <Pause /> : <PlayArrow />}
//         >
//           {isPlaying ? "Pause" : "Play"}
//         </Button>

//         <Box
//           ref={containerRef}
//           onClick={handlePlayPause}
//           sx={{
//             position: "relative",
//             width: "100%",
//             height: 90,
//             overflow: "hidden",
//             backgroundColor: "#f9fafb",
//             borderRadius: 2,
//             cursor: "pointer",
//           }}
//         />

//         <Typography variant="body2" color="text.secondary">
//           {formatTime(currentTime)} / {formatTime(duration)}
//         </Typography>
//       </Stack>
//     );
//   }
// );

// AudioWaveform.displayName = "AudioWaveform";

// function formatTime(seconds: number): string {
//   if (!seconds || isNaN(seconds)) return "0:00";
//   const minutes = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60)
//     .toString()
//     .padStart(2, "0");
//   return `${minutes}:${secs}`;
// }

// export default AudioWaveform;
"use client";

import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
} from "react";
import WaveSurfer from "wavesurfer.js";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";

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

    // Initialize WaveSurfer once
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

      // Only load if URL changed
      if (audioUrl !== lastUrlRef.current) {
        ws.load(audioUrl);
        lastUrlRef.current = audioUrl;
      }

      ws.on("ready", () => {
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

    // Expose seekTo externally
    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        const ws = wavesurferRef.current;
        if (!ws || !ws.getDuration()) return;
        ws.seekTo(time / ws.getDuration());
        ws.play(); // play after seeking
      },
      play: () => wavesurferRef.current?.play(),
      pause: () => wavesurferRef.current?.pause(),
    }));

    const handlePlayPause = () => {
      const ws = wavesurferRef.current;
      if (!ws) return;
      ws.playPause();
      setIsPlaying(ws.isPlaying());
    };

    return (
      <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
        <Button
          variant="outlined"
          onClick={handlePlayPause}
          sx={{ borderRadius: "12px" }}
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <Box
          ref={containerRef}
          sx={{
            position: "relative",
            width: "100%",
            height: 90,
            overflow: "hidden",
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            cursor: "pointer",
          }}
        />

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
