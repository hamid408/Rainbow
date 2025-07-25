"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  
} from "@mui/material";
import CustomButton from "@/components/common/CustomButton";
import CustomTextField from "@/components/common/CustomTextfield";

const CSVUploader = ({
  onBulkSubmit,
}: {
  onBulkSubmit: (data: any[]) => void;
}) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [errors, setErrors] = useState<boolean[][]>([]);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") return;

      const rows = result
        .trim()
        .split("\n")
        .map((row) => row.split(","));

      if (rows.length > 0) {
        setHeaders(rows[0]);
        setTableData(rows.slice(1));
        setErrors(
          rows.slice(1).map((row) => row.map((cell) => cell.trim() === ""))
        );
      }
    };

    reader.readAsText(file);
  };

  const handleCellChange = (value: string, rowIdx: number, colIdx: number) => {
    const updatedData = [...tableData];
    updatedData[rowIdx][colIdx] = value;
    setTableData(updatedData);

    const updatedErrors = [...errors];
    updatedErrors[rowIdx][colIdx] = value.trim() === "";
    setErrors(updatedErrors);
  };

  const handleSubmit = () => {
    const hasErrors = errors.flat().some((err) => err);
    if (hasErrors) {
      alert("Please fill all required fields before submitting.");
      return;
    }
    const result = tableData.map((row) =>
      headers.reduce((acc, header, idx) => {
        const key = header.trim().toLowerCase().replace(/\s+/g, "_");
        acc[key] = row[idx].trim();
        return acc;
      }, {} as Record<string, string>)
    );

    const formatted = result.map((lead) => ({
      first_name: lead.first_name || "",
      last_name: lead.last_name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      inquiry_type: lead.inquiry_type || "",
      is_mobile: true,
      inquiry_status: lead.inquiry_status || "",
      tag: lead.tag || "",
      notes: lead.notes || "",
      time_zone: lead.time_zone || "UTC",
      preferred_calling_window: [800, 2000],
    }));

    onBulkSubmit(formatted);
  };

  return (
    <Box sx={{ p: 4, marginTop: "-32px" }}>
      <Typography variant="h5" gutterBottom>
        {headers.length > 0 ? "Bulk Leads" : "Upload CSV File"}
      </Typography>

      {headers.length === 0 && (
        <Button variant="contained" component="label">
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleCSVUpload} />
        </Button>
      )}

      {headers.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            mt: 4,
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          <Table sx={{ minWidth: headers.length * 150 }}>
            <TableHead>
              <TableRow>
                {headers.map((header, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: "bold",
      
                      minWidth: 150,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <TableCell
                      key={colIdx}
                      sx={{
                        minWidth: 170,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <CustomTextField
                        value={cell}
                        onChange={(e: any) =>
                          handleCellChange(e.target.value, rowIdx, colIdx)
                        }
                        error={errors[rowIdx]?.[colIdx]}
                    
                        helperText={errors[rowIdx]?.[colIdx] ? "Required" : ""}
                        fullWidth
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {headers.length > 0 && (
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <CustomButton
            variant="contained"
            color="success"
            onClick={handleSubmit}
          >
            Submit
          </CustomButton>
        </Box>
      )}
    </Box>
  );
};

export default CSVUploader;
