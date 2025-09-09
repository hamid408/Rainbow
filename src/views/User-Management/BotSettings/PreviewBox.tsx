import React from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import { motion } from "framer-motion";
import CustomTextField from "@/src/components/common/CustomTextfield";

const PreviewBox = ({ values }: any) => {
  return (
    <motion.div
      style={{
        backgroundColor: values.backgroundColor,
        border: `2px solid ${values.borderColor}`,
        borderRadius: values.borderRadius,
        fontFamily: values.fontFamily,
        fontSize: values.fontSize,
        width: "350px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      animate={{ opacity: [0.9, 1] }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: values.primaryColor,
          borderRadius: `${values.borderRadius}px ${values.borderRadius}px 0 0`,
          color: "#fff",
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar sx={{ bgcolor: "#fff", color: values.primaryColor }}>🤖</Avatar>
        <Typography
          variant="body1"
          fontSize={values.fontSize}
          fontFamily={values.fontFamily}
          fontWeight={600}
        >
          Support
        </Typography>
      </Box>

      {/* Chat Area */}
      {/* <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          backgroundColor: values.backgroundColor,
        }}
      >
        <Box
          bgcolor={values.primaryColor}
          sx={{
            p: 1.5,
            borderRadius: 2,
            mb: 1,
            maxWidth: "80%",
          }}
        >
          <Typography
            fontSize={values.fontSize}
            fontFamily={values.fontFamily}
            // bgcolor={values.primaryColor}
          >
            Hello world{" "}
          </Typography>
        </Box>
      </Box> */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          backgroundColor: values.backgroundColor,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {/* Left Bubble */}
        <Box
          sx={{
            bgcolor: "#f1f1f1",
            p: 1.5,
            borderRadius: 2,
            maxWidth: "75%",
            alignSelf: "flex-start",
          }}
        >
          <Typography
            fontSize={values.fontSize}
            fontFamily={values.fontFamily}
            color="black"
          >
            Hello world
          </Typography>
        </Box>

        {/* Right Bubble */}
        <Box
          sx={{
            bgcolor: values.primaryColor,
            p: 1.5,
            borderRadius: 2,
            maxWidth: "75%",
            alignSelf: "flex-end",
            color: "white",
          }}
        >
          <Typography
            fontSize={values.fontSize}
            fontFamily={values.fontFamily}
            color="inherit"
          >
            Hi there how can I help you?
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          borderTop: "1px solid #e0e0e0",
          p: 1,
          gap: 1,
          alignItems: "center",
        }}
      >
        <CustomTextField
          placeholder="Type a message..."
          size="small"
          fullWidth
          variant="outlined"
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: values.primaryColor,
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Send
        </Button>
      </Box>
    </motion.div>
  );
};

export default PreviewBox;
