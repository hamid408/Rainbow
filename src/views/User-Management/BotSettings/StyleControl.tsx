import React from "react";
import {
  Box,
  Typography,
  Slider,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { Controller } from "react-hook-form";

const fonts = ["Roboto", "Arial", "Georgia", "Courier New", "Times New Roman"];

const StyleControls = ({ register, setValue, watch, control }: any) => {
  const primaryColor = watch("primaryColor");
  const backgroundColor = watch("backgroundColor");
  const borderColor = watch("borderColor");

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      width="100%"
      maxWidth={"100%"}
    >
      <Typography variant="h5" fontWeight={700}>
        Widget Appearance
      </Typography>
      <Divider />

      {/* Colors Section */}
      <Box
        display="flex"
        gap={3}
        width="100%"
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        {/* Primary Color */}
        <Box flex={1} minWidth="200px" display="flex" flexDirection="column" alignItems="center">
          <Typography gutterBottom>Primary Color</Typography>
          <HexColorPicker
            color={primaryColor}
            onChange={(val) =>
              setValue("primaryColor", val, { shouldDirty: true })
            }
          />
        </Box>

        {/* Background Color */}
        <Box flex={1} minWidth="200px" display="flex" flexDirection="column" alignItems="center">
          <Typography gutterBottom>Background Color</Typography>
        
          <HexColorPicker
            color={backgroundColor}
            onChange={(val) =>
              setValue("backgroundColor", val, { shouldDirty: true })
            }
          />
        </Box>

        {/* Border Color */}
        <Box flex={1} minWidth="200px" display="flex" flexDirection="column" alignItems="center">
          <Typography gutterBottom>Border Color</Typography>
          
          <HexColorPicker
            color={borderColor}
            onChange={(val) =>
              setValue("borderColor", val, { shouldDirty: true })
            }
          />
        </Box>
      </Box>

      <Divider />

      {/* Font & Layout Section */}
      <Box display="flex" flexWrap="wrap" gap={4} width="100%">
        {/* Font Size */}
        <Box flex={1} minWidth="200px">
          <Typography gutterBottom>Font Size</Typography>
          <Controller
            name="fontSize"
            control={control}
            render={({ field }) => (
              <Slider
                {...field}
                value={field.value || 16}
                min={10}
                max={30}
                step={1}
              />
            )}
          />
        </Box>

        {/* Border Radius */}
        <Box flex={1} minWidth="200px">
          <Typography gutterBottom>Border Radius</Typography>
          <Controller
            name="borderRadius"
            control={control}
            render={({ field }) => (
              <Slider {...field} value={field.value || 12} min={0} max={30} />
            )}
          />
        </Box>

        {/* Padding */}
        {/* <Box flex={1} minWidth="200px">
          <Typography gutterBottom>Padding</Typography>
          <Controller
            name="padding"
            control={control}
            render={({ field }) => (
              <Slider {...field} value={field.value || 12} min={4} max={30} />
            )}
          />
        </Box> */}
      </Box>
    </Box>
  );
};

export default StyleControls;
