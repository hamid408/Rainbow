// components/useLeadColumns.ts
import { useMemo } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Box, Button, Typography, Avatar } from "@mui/material";
import CustomButton from "@/src/components/common/CustomButton";

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
   
<Box
  sx={{
    borderRadius: "60px",
    border: "1px solid #7A4DF5",
    padding: "10px 8px",
    cursor: "pointer",
    maxWidth: "64px",
      background: "#F8F5FF",
    display: "flex",
  
  }}
>
  <button
    style={{
      border: "none",
      outline: "none",
      cursor: "pointer",
      color: "#7A4DF5",
      background: "none",
      fontWeight: 600,
      fontSize: "14px",
      padding: 0,
      margin: 0,
      width: "100%",
      height: "100%",
      
    }}
    onClick={() => {
      // your click logic here
      console.log("View clicked");
    }}
  >
    View
  </button>
</Box>

  );
};

const useUserManagementColumns = (columns: { field: string }[]) => {
  return useMemo(() => {
    return columns.map((col) => {
      switch (col.field) {
        case "user_name":
          return {
            ...col,
            headerName: "User Name",
            flex: 1.5,
            // cellRenderer: (params: ICellRendererParams) => (
            //   <AvatarCell value={params.value} />
            // ),
          };
        case "email":
          return { ...col, headerName: "Email", flex: 2 };
        case "avg_response_time":
          return {
            ...col,
            headerName: "Response Time",
            flex: 1.5,
            // cellRenderer: (params: ICellRendererParams) => (
            //   <StatusCell value={params.value} />
            // ),
          };
        case "inquiry_type":
          return { ...col, headerName: "Inquiry Type", flex: 1 };
        case "task_overdue":
          return { ...col, headerName: "Task Overdue", flex: 1 };
        case "actions":
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

export default useUserManagementColumns;
