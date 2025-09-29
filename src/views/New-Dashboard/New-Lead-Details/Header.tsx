import { Back } from "@/src/assests/icons";
import { Box, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <Box>
      <Box>
        <Back />
        <Typography variant="h4" fontSize={23} fontWeight={500}>
          Back to my Inbox
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
