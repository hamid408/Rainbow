"use client";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Box } from "@mui/material";
import DropZone from "./Dropzone";
import DraggableCard from "./DropExample";

interface Card {
  id: number;
  title: string;
  status: string;
}

const DragDropBoard = () => {
  const [cards, setCards] = useState<Card[]>([
    { id: 1, title: "Task A", status: "todo" },
    { id: 2, title: "Task B", status: "inProgress" },
    { id: 3, title: "Task C", status: "done" },
  ]);

  const moveCard = (id: number, from: string, to: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, status: to } : card))
    );
  };

  const changeStatus = (id: number, status: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, status } : card))
    );
  };

  const getCardsByStatus = (status: string) =>
    cards.filter((card) => card.status === status);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box display="flex" gap={2} p={4}>
        {["todo", "inProgress", "done"].map((status) => (
          <DropZone key={status} status={status} onCardDrop={moveCard}>
            {getCardsByStatus(status).map((card) => (
              <DraggableCard
                key={card.id}
                {...card}
              
                onStatusChange={changeStatus}
              />
            ))}
          </DropZone>
        ))}
      </Box>
    </DndProvider>
  );
};

export default DragDropBoard;
