"use client";
import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { Download, PlayArrow } from "@mui/icons-material";
import SlotModal from "./SlotModal";
import ReactDOM from "react-dom";
import CustomFilterSelect from "@/src/components/common/CustomFilterSelect";
import IconChip from "@/src/components/common/CustomChip";
import { Plus } from "@/src/assests/icons";

const CallLogsTable = ({ data, selected, setSelected, onDownloadCSV }: any) => {
  const [openSlot, setOpenSlot] = useState<any | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedCallTypes, setSelectedCallTypes] = useState<string[]>([]);
  const [callTypeMenu, setCallTypeMenu] = useState<HTMLElement | null>(null);

  const toggleSelect = (id: string) => {
    setSelected((prev: string[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePlay = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingUrl(url);
  };

  // Get unique call types from data
  const uniqueCallTypes: string[] = Array.from(
    new Set(data.map((r: any) => r.call_type).filter(Boolean))
  );

  // Filter data based on selected call types
  const filteredData =
    selectedCallTypes.length > 0
      ? data.filter((r: any) => selectedCallTypes.includes(r.call_type))
      : data;

  const handleCallTypeSelect = (callType: string) =>
    setSelectedCallTypes((prev) =>
      prev.includes(callType)
        ? prev.filter((t) => t !== callType)
        : [...prev, callType]
    );

  const clearAllCallTypes = () => setSelectedCallTypes([]);

  console.log("Data ", data[0]?.call_type);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Box display={"flex"} alignItems="center" gap={3}>
          <Typography variant="h5" fontWeight={600}>
            Patient Call Records
          </Typography>
        </Box>
        {selected.length > 0 && (
          <Button variant="outlined" onClick={onDownloadCSV}>
            <Download sx={{ mr: 1, fontSize: 18 }} /> Export CSV
          </Button>
        )}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mt={3}
        mb={2}
        flexWrap="wrap"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <div onClick={(e) => setCallTypeMenu(e.currentTarget)}>
            <IconChip label="Call Type" icon={<Plus />} color="#656565" />
          </div>
        </Box>
        <Menu
          anchorEl={callTypeMenu}
          open={Boolean(callTypeMenu)}
          onClose={() => setCallTypeMenu(null)}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": {
                fontSize: "12px",
                py: 0.3,
                minHeight: "28px",
              },
              "& .MuiCheckbox-root": {
                p: 0.3,
              },
              "& .MuiListItemText-primary": {
                fontSize: "12px",
              },
            },
          }}
        >
          {uniqueCallTypes.length > 0 ? (
            uniqueCallTypes.map((callType) => (
              <MenuItem
                key={callType}
                onClick={() => handleCallTypeSelect(callType)}
              >
                <Checkbox
                  checked={selectedCallTypes.includes(callType)}
                  size="small"
                />
                <ListItemText primary={callType} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No call types found</MenuItem>
          )}
        </Menu>

        {/* Display selected call types */}
        {selectedCallTypes.length > 0 && (
          <Box display="flex" alignItems="center" gap={1.5} width="100%">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(0,0,0,0.05)",
                borderRadius: "20px",
                padding: "6px 10px",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 13, color: "#555" }}
              >
                Call Types:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {selectedCallTypes.map((callType) => (
                  <IconChip
                    key={callType}
                    label={callType}
                    color="#7A4DF5"
                    onClick={() =>
                      setSelectedCallTypes((prev) =>
                        prev.filter((t) => t !== callType)
                      )
                    }
                  />
                ))}
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="#7A4DF5"
              sx={{ cursor: "pointer" }}
              onClick={clearAllCallTypes}
            >
              Clear all
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 1350 }}>
          <TableHead sx={{ background: "#fafafa" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selected.length === filteredData.length &&
                    filteredData.length > 0
                  }
                  onChange={() =>
                    setSelected(
                      selected.length === filteredData.length
                        ? []
                        : filteredData.map((r: any) => r.id)
                    )
                  }
                />
              </TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Patient Dob</TableCell>
              <TableCell>Member Id</TableCell>
              <TableCell>Payer Name</TableCell>
              <TableCell>Payer Phone</TableCell>
              <TableCell>Call Type</TableCell>
              <TableCell>Call Date</TableCell>
              <TableCell>Call Duration</TableCell>
              <TableCell>Audio</TableCell>
              <TableCell>Slots</TableCell>
              <TableCell>Call Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((r: any, index: number) => (
                <TableRow key={`${r.id}-${index}`} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                    />
                  </TableCell>

                  <TableCell sx={{ width: 140 }}>{r.name}</TableCell>
                  <TableCell sx={{ minWidth: 140 }}>{r.patient_dob}</TableCell>
                  <TableCell>{r.member_id}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{r.payer_name}</TableCell>
                  <TableCell>{r.phone}</TableCell>
                  <TableCell sx={{ width: 140 }}>{r.call_type}</TableCell>

                  <TableCell sx={{ minWidth: 170, margin: "auto", flex: 2 }}>
                    {r.date}
                  </TableCell>
                  <TableCell sx={{ minWidth: 160 }}>
                    {r.callDuration || "-"}
                  </TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => r.audioUrl && handlePlay(r.audioUrl)}
                      disabled={!r.audioUrl}
                    >
                      <PlayArrow />
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    {r.transcript || r.audioUrl ? (
                      <Box
                        onClick={() => setOpenSlot(r)}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 500,
                          color: "primary.main",
                          width: "max-content",
                        }}
                      >
                        View Details
                      </Box>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell sx={{ width: 160 }}>{r.call_status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
      {playingUrl &&
        (typeof document !== "undefined"
          ? ReactDOM.createPortal(
              <>
                <Box
                  sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 6,
                    zIndex: 1401,
                    width: { xs: "90%", sm: 360 },
                    textAlign: "center",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <audio
                    ref={audioRef}
                    controls
                    autoPlay
                    src={playingUrl}
                    style={{ width: "100%" }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      }
                      setPlayingUrl(null);
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </>,
              document.body
            )
          : null)}
      {openSlot && (
        <SlotModal
          open={!!openSlot}
          slot={openSlot}
          onClose={() => setOpenSlot(null)}
        />
      )}
    </Box>
  );
};

export default CallLogsTable;
