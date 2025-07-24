// components/useLeadColumns.ts
import { useMemo } from "react";

const useCampaignColumns = (columns: { field: string }[]) => {
  return useMemo(() => {
    return columns.map((col) => {
      switch (col.field) {
        case "badge_name":
          return {
            ...col,
            headerName: "Badge Name",
            flex: 1.5,
          };
        case "campagin_name":
          return { ...col, headerName: "Campagin Name", flex: 2 };
        case "performance":
          return {
            ...col,
            headerName: "performance",
            flex: 1,
            // cellRenderer: (params: ICellRendererParams) => (
            //   <StatusCell value={params.value} />
            // ),
          };

        default:
          return col;
      }
    });
  }, [columns]);
};

export default useCampaignColumns;
