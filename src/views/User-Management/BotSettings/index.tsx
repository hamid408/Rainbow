"use client";
import React from "react";
import { Grid, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import PreviewBox from "./PreviewBox";
import StyleControls from "./StyleControl";

const StyleEditor = () => {
  const { register, watch, control, setValue } = useForm({
    defaultValues: {
      primaryColor: "#ff2600ff",
      backgroundColor: "#ffffff",
      borderColor: "#e0e0e0",
      fontFamily: "Roboto",
      fontSize: 16,
      borderRadius: 12,
      padding: 12,
    },
  });

  const values = watch();

  return (
    <Grid
      container
      spacing={4}
      sx={{
        height: "100vh",
        p: 4,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <Grid>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <StyleControls
            register={register}
            setValue={setValue}
            watch={watch}
            control={control}
          />
        </Paper>
      </Grid>

      <Grid>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            // borderRadius: 3,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // bgcolor: "#fafafa",
          }}
        >
          <PreviewBox values={values} />
          {/* <iframe
            src="../../public/preview.html"
            style={{
              width: "400px",
              height: "500px",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            title="Chat Preview"
          ></iframe> */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StyleEditor;
