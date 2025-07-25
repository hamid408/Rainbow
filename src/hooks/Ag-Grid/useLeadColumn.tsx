// components/useLeadColumns.ts
import { useMemo } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Box, Button, Typography, Avatar } from "@mui/material";
import CustomButton from "@/components/common/CustomButton";

const StatusCell = ({ value }: { value: string }) => {
  const styles = {
    subscribed: { bgcolor: "#E0F8E9", color: "#299438" },
    unsubscribed: { bgcolor: "#FFF4E5", color: "#B26A00" },
    never_subscribed: { bgcolor: "#FDECEA", color: "#D32F2F" },
    default: { bgcolor: "#E3E8EB", color: "#68717D" },
  };

  const key = value?.toLowerCase()?.replace(/ /g, "_") || "default";
  const style = styles[key as keyof typeof styles] || styles.default;

  return (
    <Box
      sx={{
        ...style,
        fontWeight: 600,
        borderRadius: "12px",
        padding: "4px 12px",
        fontSize: 12,
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      {value}
    </Box>
  );
};

const AvatarCell = ({ value }: { value: string }) => {
  if (!value) return null;
  const initials = value
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar sx={{ bgcolor: "#D9D9D9", color: "#555", fontSize: 14 }}>
        {initials}
      </Avatar>
      <Typography sx={{ fontWeight: 400 }}>{value}</Typography>
    </Box>
  );
};

const ActionCell = (params: ICellRendererParams) => {
  return (
    <CustomButton
      size="small"
      variant="outlined"
      // onClick={() => alert(`Viewing ${params.data.name}`)}
    >
      View
    </CustomButton>
  );
};

const useLeadColumns = (columns: { field: string }[]) => {
  return useMemo(() => {
    return columns.map((col) => {
      switch (col.field) {
        case "name":
          return {
            ...col,
            headerName: "Lead Name",
            flex: 1.5,
            cellRenderer: (params: ICellRendererParams) => (
              <AvatarCell value={params.value} />
            ),
          };
        case "email":
          return { ...col, headerName: "Email", flex: 2 };
        case "inquiry_status":
          return {
            ...col,
            headerName: "Inquiry Status",
            flex: 1,
            // cellRenderer: (params: ICellRendererParams) => (
            //   <StatusCell value={params.value} />
            // ),
          };
        case "inquiry_type":
          return { ...col, headerName: "Inquiry Type", flex: 1 };
        case "tag":
          return { ...col, headerName: "Tag", flex: 1 };
        case "action":
          return {
            ...col,
            headerName: "Action",
            width: 100,
            cellRenderer: ActionCell,
          };
        default:
          return col;
      }
    });
  }, [columns]);
};

export default useLeadColumns;
