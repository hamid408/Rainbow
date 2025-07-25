import AgGridTable from "@/components/ag-grid";
import React, { useRef, useState } from "react";
import useLeadColumns from "@/hooks/Ag-Grid/useLeadColumn";
import { leadsRows } from "@/constants/Grid-Table/RowData";
import { leadsColumn } from "@/constants/Grid-Table/ColDefs";
import { Box, Typography } from "@mui/material";
import CustomButton from "@/components/common/CustomButton";

const Badge = () => {
  const leadCol = useLeadColumns(leadsColumn);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const gridRef = useRef<any>(null);

  const handleSelectionChange = () => {
    const selected = gridRef.current?.api?.getSelectedRows() || [];
    setSelectedRows(selected);
  };

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        gap={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body1" color="textSecondary">
          This section displays the leads with their respective badges.
        </Typography>
        <CustomButton
          variant="contained"
          color="primary"
          onClick={() => {
            // logic to assign badge to selectedRows
            console.log("Assign badge to:", selectedRows);
          }}
          disabled={selectedRows.length === 0}
        >
          Assign Badge
        </CustomButton>
      </Box>

      <AgGridTable
        ref={gridRef}
        rowData={leadsRows}
        columnDefs={leadCol}
        domLayout="autoHeight"
        rowSelection="multiple"
        onRowSelected={handleSelectionChange}
      />
    </Box>
  );
};

export default Badge;
