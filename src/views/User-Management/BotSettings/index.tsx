"use client";
import React, { useEffect } from "react";
import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import PreviewBox from "./PreviewBox";
import StyleControls from "./StyleControl";
import Scripted from "./Scripted";
import {
  useGetLexBotStylingQuery,
  useUpdateBotStylingMutation,
} from "@/src/redux/services/organization/organizationApi";
import CustomButton from "@/src/components/common/CustomButton";
import { toast } from "react-toastify";

const StyleEditor = () => {
  const { data, error, isLoading: isFetching } = useGetLexBotStylingQuery();
  const [updateBotStyling, { isLoading }] = useUpdateBotStylingMutation();

  const {
    register,
    watch,
    control,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      primaryColor: "#FFA726",
      backgroundColor: "#FFFFFF",
      borderColor: "#e0e0e0",
      fontSize: 16,
      borderRadius: 12,
      padding: 12,
      botMessage: "Hi, I'm Bot 🤖",
      userMessage: "I need your help!",
      botMessageColor: "#F8BBD0",
      userMessageColor: "#FFECB3",
      headerColor: "#BBDEFB",
      welcomeMessage: "Hello! How can I help?",
    },
  });

  // useEffect(() => {
  //   if (data) {
  //     console.log("Lex Bot Styling Data:", data);

  //     setValue("botMessage", data.botMessage);
  //     setValue("userMessage", data.userMessage);
  //     setValue("backgroundColor", data.background);
  //     setValue("headerColor", data.headerColor);
  //     setValue("userMessageColor", data.userMessageColor);
  //     setValue("botMessageColor", data.botMessageColor);
  //     setValue("primaryColor", data.primaryColor);
  //     setValue("fontSize", data.fontSize);
  //     setValue("borderRadius", data.borderRadius);
  //     setValue("welcomeMessage", data.welcomeMessage);
  //   }

  //   if (error) {
  //     console.error("Error fetching Lex Bot Styling:", error);
  //   }
  // }, [data, error, setValue]);
  useEffect(() => {
    if (data) {
      reset({
        botMessage: data.botMessage,
        userMessage: data.userMessage,
        backgroundColor: data.background,
        headerColor: data.headerColor,
        userMessageColor: data.userMessageColor,
        botMessageColor: data.botMessageColor,
        primaryColor: data.primaryColor,
        fontSize: data.fontSize,
        borderRadius: data.borderRadius,
        welcomeMessage: data.welcomeMessage,
        borderColor: data.borderColor,
      });
    }

    if (error) {
      console.error("Error fetching Lex Bot Styling:", error);
    }
  }, [data, error, reset]);
  const handleUpdate = async () => {
    const payload = {
      background: watch("backgroundColor"),
      headerColor: watch("headerColor"),
      userMessageColor: watch("userMessageColor"),
      botMessageColor: watch("botMessageColor"),
      primaryColor: watch("primaryColor"),
      fontSize: watch("fontSize"),
      borderRadius: watch("borderRadius"),
      welcomeMessage: watch("welcomeMessage"),
      // botMessage: watch("botMessage"),
      // userMessage: watch("userMessage"),
      borderColor: watch("borderColor"),
    };

    try {
      await updateBotStyling(payload).unwrap();
      console.log("Bot styling updated successfully");
      toast.success("Bot styling updated successfully");
    } catch (err) {
      console.error("Failed to update bot styling:", err);
      toast.error("Failed to update bot styling");
    }
  };

  const values = watch();
  
  if (isFetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Style Controls and Save Button Row */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
          alignItems: { xs: "stretch", lg: "flex-start" }
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            flex: 1,
          }}
        >
          <StyleControls
            register={register}
            setValue={setValue}
            watch={watch}
            control={control}
          />
        </Paper>

        {/* Save Button */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "flex-start",
            justifyContent: { xs: "center", lg: "flex-start" },
            pt: { lg: 2 }
          }}
        >
          <CustomButton
            variant="contained"
            onClick={handleUpdate}
            disabled={!isDirty || isLoading}
            sx={{ 
              minWidth: { xs: "200px", lg: "180px" },
              height: "fit-content",
              whiteSpace: "nowrap"
            }}
          >
            Save Changes
          </CustomButton>
        </Box>
      </Box>

      {/* Preview Section */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <PreviewBox values={values} />
      </Paper>

      {/* Script Section */}
      <Scripted cloudfrontUrl={data?.cloudfront_url} />
    </Box>
  );
};

export default StyleEditor;