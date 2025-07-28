import React from "react";
import { CampaignsRow, leadsRows } from "@/src/constants/Grid-Table/RowData";
import useCampaignColumns from "@/src/hooks/Ag-Grid/useCampaignColumn";
import { campaignsColumn } from "@/src/constants/Grid-Table/ColDefs";
import AgGridTable from "@/src/components/ag-grid";
const CampaignTable = () => {
  const campaignCol = useCampaignColumns(campaignsColumn); // Assuming similar structure for campaigns

  return (
    <AgGridTable
      rowData={CampaignsRow}
      columnDefs={campaignCol}
      domLayout="autoHeight"
    />
  );
};

export default CampaignTable;
