"use client";
import React, { useState } from "react";
import { Box, Popper, Paper, Typography, TextFieldProps } from "@mui/material";
import { DigitalClock } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CustomTextField from "@/components/common/CustomTextfield";

type TimeSelectorProps = {
  label?: string;
  value: string;
  onChange: (val: string) => void;
} & Partial<Pick<TextFieldProps, "sx" | "fullWidth" | "size" | "disabled">>;

const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  value,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <Box width="100%">
      <CustomTextField
        value={value}
        size="small"
        fullWidth
        readOnly
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
      />

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <Paper elevation={3}>
          <DigitalClock
            value={dayjs(value, "HH:mm")}
            onChange={(val) => {
              onChange(dayjs(val).format("HH:mm"));
              setAnchorEl(null);
            }}
          />
        </Paper>
      </Popper>
    </Box>
  );
};

export default TimeSelector;
