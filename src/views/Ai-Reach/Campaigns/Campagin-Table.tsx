import React from "react";
import { CampaignsRow, leadsRows } from "@/constants/Grid-Table/RowData";
import useCampaignColumns from "@/hooks/Ag-Grid/useCampaignColumn";
import { campaignsColumn } from "@/constants/Grid-Table/ColDefs";
import AgGridTable from "@/components/ag-grid";
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
