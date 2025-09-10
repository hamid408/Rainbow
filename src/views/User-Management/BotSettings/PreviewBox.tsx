
import React from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import { motion } from "framer-motion";
import CustomTextField from "@/src/components/common/CustomTextfield";

const PreviewBox = ({ values }: any) => {
  console.log("PreviewBox values:", values);
  return (
    <motion.div
      style={{
        backgroundColor: values.backgroundColor,
        border: `2px solid ${values.borderColor}`,
        borderRadius: values.borderRadius,
        fontSize: values.fontSize,
        width: "390px",
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
        <Avatar sx={{ color: values.primaryColor, bgcolor: "#fff" }}>🤖</Avatar>
        <Typography
          variant="body1"
          fontSize={values.fontSize}
          fontFamily={values.fontFamily}
          fontWeight={600}
          color="#0e0e0e"
        >
          {/* Support */}
          {values.botMessage}
        </Typography>
      </Box>

      {/* Chat Area */}
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
        {/* Bot Bubble (left) */}
        <Box
          sx={{
            bgcolor: values.primaryColor,
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
            {values.welcomeMessage}
          </Typography>
        </Box>

        {/* User Bubble (right) */}
        <Box
          sx={{
            bgcolor: values.userMessageColor,
            p: 1.5,
            borderRadius: 2,
            maxWidth: "75%",
            alignSelf: "flex-end",
            color: "black",
          }}
        >
          <Typography
            fontSize={values.fontSize}
            fontFamily={values.fontFamily}
            color="inherit"
          >
            {values.userMessage}
          </Typography>
        </Box>
      </Box>

      {/* Input Area */}
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
            color: "black",
          }}
        >
          Send
        </Button>
      </Box>
    </motion.div>
  );
};

export default PreviewBox;
