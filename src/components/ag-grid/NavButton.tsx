import React from "react";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

interface NavButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        gap: "10px",

        color: "#344054",
        fontWeight: "600",
        padding: "8px 12px",
        fontSize: "12px",
        borderRadius: "8px",
        border: "1px solid var(--Grey-300, #D0D5DD)",
        marginLeft: 1,
        "&:hover": {
          // backgroundColor: "#303652",
          color: "#000",
          padding: "6px 12px",
          // boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        },
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        "&:active": {
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
        },
        "&.Mui-disabled": {
          // backgroundColor: "#555",
          opacity: 0.6,
          // color: "#AAA",
        },
      }}
    >
      {/* {text === "Previous" && <ArrowPrevious />} */}
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {text}
      </Typography>
      {/* {text === "Next" && <ArrowNext />} */}
    </Button>
  );
};

export default NavButton;
