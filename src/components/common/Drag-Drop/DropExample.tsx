
"use client";
import React from "react";
import { useDrag } from "react-dnd";
import { MenuItem, Select, Typography, Box, Paper } from "@mui/material";

const ItemType = "CARD";

export interface DraggableCardProps {
  id: number;
  title: string;
  status: string;
  onStatusChange: (id: number, status: string) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  title,
  status,
  onStatusChange,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: ItemType,
    item: { id, from: status },
   
  });

  drag(ref);

  return (
    <Paper
      ref={ref}
      sx={{
        p: 2,
        mb: 2,
        cursor: "move",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        boxShadow: 1,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Box mt={1}>
        <Select
          value={status}
          onChange={(e) => onStatusChange(id, e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="inProgress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
      </Box>
    </Paper>
  );
};

export default DraggableCard;
export { ItemType };
