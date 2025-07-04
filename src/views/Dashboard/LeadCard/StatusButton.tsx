import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Meeting } from '@/src/assests/icons';
import styles from "./style.module.scss";

interface StatusButtonProps {
  type: 'addressed' | 'snoozed' | 'meeting';
  label: string;
  onClick?: () => void;
}

const statusStyles = {
  addressed: {
    dotColor: '#339446',
    icon: null,
    hasDot: true,
  },
  snoozed: {
    dotColor: '#36394A',
    icon: null,
    hasDot: true,
  },
  meeting: {
    dotColor: '',
    icon: <Meeting className = {styles.meeting}/>,
    hasDot: false,
  },
};

const StatusButton: React.FC<StatusButtonProps> = ({ type, label, onClick }) => {
  const {
    dotColor,
    icon,
    hasDot,
  } = statusStyles[type];

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      className={`${styles.statusButton} ${styles[type]}`}
      // sx={{
      //   borderColor,
      //   backgroundColor,
      //   borderRadius: '24px',
      //   height: 40,
      //   px: 2,
      //   textTransform: 'none',
      //   fontWeight: 600,
      //   fontSize: 14,
      //   color: textColor,
      //   '&:hover': {
      //     backgroundColor,
      //   },
      // }}
      startIcon={
        hasDot ? (
          <FiberManualRecordIcon 
          className={`${styles.dot} ${styles[`${type}Dot`]}`}
          // sx={{ fontSize: 12, color: dotColor }}
           />
        ) : (
          icon
        )
      }
    >
      {label}
    </Button>
  );
};

export default StatusButton;
