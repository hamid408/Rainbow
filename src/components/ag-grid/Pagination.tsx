import { Box, Button, Typography } from "@mui/material";
import React from "react";
import NavButton from "./NavButton";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "12px",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "14px", color: "#667185" }}>
        {"page"} {currentPage } {"of"} {totalPages}
      </Typography>

      {/* <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {[...Array(totalPages).keys()].map((page) => {
          if (
            page === 0 ||
            page === totalPages - 1 ||
            page === currentPage - 1 ||
            page === currentPage ||
            page === currentPage + 1
          ) {
            return (
              <Button
                key={page}
                variant={page === currentPage ? "contained" : "text"}
                sx={{
                  width: "14px",
                  height: "24px",
                  padding: "8px",
                  fontSize: "14px",
                  color: page === currentPage ? "#004FA7" : "#98A2B3",
                  backgroundColor: page === currentPage ? "#F9FAFB" : "#fff",
                  "&:hover": {
                    backgroundColor:
                      page === currentPage ? "#E5F0FF" : "#F0F0F0",
                    color: "#004FA7",
                    width: "14px",
                  },
                }}
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </Button>
            );
          } else if (
            (page === 1 && currentPage > 2) ||
            (page === totalPages - 2 && currentPage < totalPages - 3)
          ) {
            return (
              <Typography key={page} sx={{ fontSize: "14px" }}>
                {"skip"}
              </Typography>
            );
          }
          return null;
        })}
      </Box> */}

      <Box sx={{ display: "flex", gap: "16px" }}>
        <NavButton
          text="Previous"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <NavButton
          text={"Next"}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages || totalPages === 1}
        />
      </Box>
    </Box>
  );
};

export default Pagination;
