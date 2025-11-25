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
} from "@mui/material";
import { Download, PlayArrow } from "@mui/icons-material";
import SlotModal from "./SlotModal";

const CallLogsTable = ({ data, selected, setSelected, onDownloadCSV }: any) => {
  const [openSlot, setOpenSlot] = useState<any | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Box display={"flex"} alignItems="center" gap={3}>
          <Typography variant="h5" fontWeight={600}>
            Patient Call Records
          </Typography>

          {/* will use in future */}

          {/* <CustomSearchField
             endIcon={<Search />}
             searchQuery={searchQuery}
             setSearchQuery={setSearchQuery}
           /> */}
        </Box>
        {selected.length > 0 && (
          <Button variant="outlined" onClick={onDownloadCSV}>
            <Download sx={{ mr: 1, fontSize: 18 }} /> Export CSV
          </Button>
        )}
      </Box>
      <Box display={"flex"} gap={2} mt={3} mb={2} justifyContent={"flex-start"}>
        {/* will use in future */}

        {/* <CustomFilterSelect
           title="Date"
           options={dateOptions}
           onSelect={(option) =>
             setSelectedDateFilter((prev: any) => ({
               ...prev,
               [selectedTab]: String(option?.value || ""),
             }))
           }
         /> */}
      </Box>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 1350 }}>
          <TableHead sx={{ background: "#fafafa" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === data.length}
                  onChange={() =>
                    setSelected(
                      selected.length === data.length
                        ? []
                        : data.map((r: any) => r.id)
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((r: any, index: number) => (
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
                  <TableCell sx={{width:140}}>{r.call_type}</TableCell>

                  <TableCell sx={{ minWidth: 170,margin:"auto",flex:2 }}>{r.date}</TableCell>
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

      {/* SIMPLE AUDIO PLAYER POPUP */}
      {playingUrl && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 4,
            zIndex: 9999,
          }}
        >
          <audio
            ref={audioRef}
            controls
            autoPlay
            src={playingUrl}
            style={{ width: 300 }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setPlayingUrl(null)}
          >
            Close
          </Button>
        </Box>
      )}

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
