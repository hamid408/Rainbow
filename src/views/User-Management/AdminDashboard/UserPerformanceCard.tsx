import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";

const UserPerformanceCard = ({ user }: any) => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={2}
        gap={1.5}
      >
        <Box>
          <Typography fontWeight={600} color="#0D0D12" fontSize={16}>
            {user.name}
          </Typography>
          <Typography color="#666D80" fontSize={14} fontWeight={400} mt={0.5}>
            {user.service} &nbsp; | &nbsp; {user.time} &nbsp; | &nbsp;{" "}
            {user.score}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          sx={{
            borderRadius: "20px",
            borderColor: "#A855F7",
            color: "#7A4DF5",
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            ":hover": {
              borderColor: "#9333EA",
              backgroundColor: "#F3E8FF",
            },
          }}
        >
          View
        </Button>
      </Box>
      <Divider />
    </>
  );
};

export default UserPerformanceCard;
