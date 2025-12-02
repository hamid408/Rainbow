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
  CircularProgress,
} from "@mui/material";
import { Download, PlayArrow, Search } from "@mui/icons-material";
import ReactDOM from "react-dom";

import SlotModal from "./SlotModal";
import IconChip from "@/src/components/common/CustomChip";
import CustomSearchField from "@/src/components/common/CustomSearch";
import { Plus } from "@/src/assests/icons";

interface CallLogsTableProps {
  data: any[];
  selected: string[];
  setSelected: (ids: string[]) => void;
  onDownloadCSV: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCallTypes: string[];
  setSelectedCallTypes: (types: string[]) => void;
  selectedPayers: string[];
  setSelectedPayers: (payers: string[]) => void;
  isFetching: boolean;
  call_type: string[];
  payer_name: string[];
}

const CallLogsTable: React.FC<CallLogsTableProps> = ({
  data,
  selected,
  setSelected,
  onDownloadCSV,
  searchQuery,
  setSearchQuery,
  selectedCallTypes,
  setSelectedCallTypes,
  selectedPayers,
  setSelectedPayers,
  isFetching,
  call_type,
  payer_name,
}) => {
  const [openSlot, setOpenSlot] = useState<any | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [callTypeMenu, setCallTypeMenu] = useState<HTMLElement | null>(null);
  const [payerMenu, setPayerMenu] = useState<HTMLElement | null>(null);

  const uniqueCallTypes = Array.from(new Set(call_type)).sort();
  const uniquePayers = Array.from(new Set(payer_name)).sort();

  const toggleSelect = (id: string) =>
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );

  const handlePlay = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingUrl(url);
  };

  const handleCallTypeSelect = (type: string) =>
    setSelectedCallTypes(
      selectedCallTypes.includes(type)
        ? selectedCallTypes.filter((t) => t !== type)
        : [...selectedCallTypes, type]
    );

  const handlePayerSelect = (payer: string) =>
    setSelectedPayers(
      selectedPayers.includes(payer)
        ? selectedPayers.filter((p) => p !== payer)
        : [...selectedPayers, payer]
    );

  const clearAllCallTypes = () => setSelectedCallTypes([]);
  const clearAllPayers = () => setSelectedPayers([]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h5" fontWeight={600}>
          Patients Call Records
        </Typography>
        {selected.length > 0 && (
          <Button variant="outlined" onClick={onDownloadCSV}>
            <Download sx={{ mr: 1, fontSize: 18 }} /> Export CSV
          </Button>
        )}
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <CustomSearchField
          endIcon={<Search />}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          style={{
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: "#f5f5f5",
            marginTop: "12px",
            marginLeft: "12px",
          }}
        />
        <Typography
          variant="subtitle1"
          fontWeight={400}
          fontSize={14}
          color="#818181"
          marginRight={2.5}
        >
          Showing {data.length} result{data.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mt={3}
        mb={2}
        flexWrap="wrap"
      >
        <Box>
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
              "& .MuiMenuItem-root": { fontSize: 12, py: 0.3, minHeight: 28 },
            },
          }}
        >
          {uniqueCallTypes.length > 0 ? (
            uniqueCallTypes.map((type) => (
              <MenuItem key={type} onClick={() => handleCallTypeSelect(type)}>
                <Checkbox
                  checked={selectedCallTypes.includes(type)}
                  size="small"
                />
                <ListItemText primary={type} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No call types found</MenuItem>
          )}
        </Menu>

        <Box>
          <div onClick={(e) => setPayerMenu(e.currentTarget)}>
            <IconChip label="Payer Name" icon={<Plus />} color="#656565" />
          </div>
        </Box>
        <Menu
          anchorEl={payerMenu}
          open={Boolean(payerMenu)}
          onClose={() => setPayerMenu(null)}
          MenuListProps={{
            sx: {
              p: 0,
              "& .MuiMenuItem-root": { fontSize: 12, py: 0.3, minHeight: 28 },
            },
          }}
        >
          {uniquePayers.length > 0 ? (
            uniquePayers.map((payer) => (
              <MenuItem key={payer} onClick={() => handlePayerSelect(payer)}>
                <Checkbox
                  checked={selectedPayers.includes(payer)}
                  size="small"
                />
                <ListItemText primary={payer} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No payers found</MenuItem>
          )}
        </Menu>

        {(selectedCallTypes.length > 0 || selectedPayers.length > 0) && (
          <Box display="flex" alignItems="center" gap={1.5} width="100%">
            {selectedCallTypes.length > 0 && (
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
                  {selectedCallTypes.map((type) => (
                    <IconChip
                      key={type}
                      label={type}
                      color="#7A4DF5"
                      onClick={() =>
                        setSelectedCallTypes(
                          selectedCallTypes.filter((t) => t !== type)
                        )
                      }
                    />
                  ))}
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

            {selectedPayers.length > 0 && (
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
                  Payers:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {selectedPayers.map((payer) => (
                    <IconChip
                      key={payer}
                      label={payer}
                      color="#7A4DF5"
                      onClick={() =>
                        setSelectedPayers(
                          selectedPayers.filter((p) => p !== payer)
                        )
                      }
                    />
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  color="#7A4DF5"
                  sx={{ cursor: "pointer" }}
                  onClick={clearAllPayers}
                >
                  Clear all
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto", position: "relative" }}>
        <Table sx={{ minWidth: 1350 }}>
          <TableHead sx={{ background: "#fafafa" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === data.length && data.length > 0}
                  onChange={() =>
                    setSelected(
                      selected.length === data.length
                        ? []
                        : data.map((r) => r.id)
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
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 8 }}>
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((r, index) => (
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
                  <TableCell sx={{ minWidth: 170 }}>{r.date}</TableCell>
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
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
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
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
                setPlayingUrl(null);
              }}
            >
              Close
            </Button>
          </Box>,
          document.body
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
