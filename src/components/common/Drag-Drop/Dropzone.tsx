"use client";
import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Paper, Typography } from "@mui/material";
import { ItemType } from "./DropExample";

interface DropZoneProps {
  status: string;
  children: React.ReactNode;
  onCardDrop: (id: number, from: string, to: string) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ status, children, onCardDrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item: { id: number; from: string }) => {
      if (item.from !== status) {
        onCardDrop(item.id, item.from, status);
      }
    },
  });

  drop(ref);

  return (
    <Paper
      ref={ref}
      sx={{
        p: 2,
        minHeight: 300,
        backgroundColor: "#f8f9fa",
        border: "1px solid #ccc",
        flex: 1,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={1}>
        {status.toUpperCase()}
      </Typography>
      {children}
    </Paper>
  );
};

export default DropZone;
