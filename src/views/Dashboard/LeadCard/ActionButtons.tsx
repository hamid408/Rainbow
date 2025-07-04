import { Stack, IconButton } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Call, Mail, Meeting, Phone } from '@/src/assests/icons';
import styles from "./style.module.scss";

const iconStyle = {
  border: '1px solid #7A4DF5',
  borderRadius: '50%',
  width: 52,
  height: 52,
  color: '#8647F5',
};

const ActionButtons = () => (
  <Stack 
  className={styles.actionButtons}
  // direction="row" spacing={2}
  >
    <IconButton 
    // sx={iconStyle}
    className={styles.icon}
    >
      <Phone />
    </IconButton>
    <IconButton 
    // sx={iconStyle}
    className={styles.icon}
    >
      <Mail />
    </IconButton>
    <IconButton 
    // sx={iconStyle}
    className={styles.icon}
    >
      <Meeting />
    </IconButton>
  </Stack>
);

export default ActionButtons;
