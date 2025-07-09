import { Chip } from '@mui/material';
import React from 'react';
import styles from "./style.module.scss";

interface StatusTagProps {
  label: string;
  color?: string; 
  icon?: React.ReactElement;
}

const StatusTag = ({ label, color = '#F6F8FA', icon }: StatusTagProps) => {
  return (
    <Chip
      label={label}
      size="small"
      icon={icon}
      color="default"
      className={styles.chip}
    />
  );
};

export default StatusTag;
