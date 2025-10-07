import { Back, BackNew } from "@/src/assests/icons";
import { Box, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <Box>
      <Box
        display={"flex"}
        alignItems="center"
        gap={1}
        mb={1.6}
        sx={{ cursor: "pointer" }}
      >
        <BackNew />
        <Typography variant="subtitle1" fontSize={15} fontWeight={400}>
          Back to my Inbox
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
