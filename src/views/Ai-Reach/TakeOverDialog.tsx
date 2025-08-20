// "use client";

// import {
//   Dialog,
//   DialogContent,
//   IconButton,
//   Typography,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Box,
//   Button,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import { useState } from "react";
// import { TakeOver } from "@/src/assests/icons";
// import CustomSelect from "@/src/components/common/CustomSelect";
// import styles from "./style.module.scss";

// interface TakeOverDialogProps {
//   open: boolean;
//   onClose: () => void;
//   selectedReason?: string;
//   onReasonChange?: (reason: string) => void;
//   onConfirm?: () => void; // for Yes, I Agree button
// }

// const TakeOverDialog = ({
//   open,
//   onClose,
//   selectedReason = "",
//   onReasonChange = () => {},
//   onConfirm = () => {},
// }: TakeOverDialogProps) => {
//   const [reason, setReason] = useState(selectedReason);

//   const handleReasonChange = (event: any) => {
//     const value = event.target.value;
//     setReason(value);
//     onReasonChange(value);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="xs"
//       fullWidth
//       PaperProps={{
//         className: styles.pauseDialogBox,
//       }}
//     >
//       {/* Close Button */}
//       <IconButton className={styles.dialogCrossIcon} onClick={onClose}>
//         <CloseIcon />
//       </IconButton>

//       {/* Dialog Content */}
//       <DialogContent className={styles.dialogContent}>
//         {/* Center Icon */}
//         <TakeOver></TakeOver>

//         {/* Heading */}
//         <Typography className={styles.dialogHeading}>
//           Take Over Confirmation
//         </Typography>

//         {/* Description */}
//         <Typography variant="body2" className={styles.dialogSubheading}>
//           Do you want to remove a lead from automation and decide to handle it
//           personally, which would stop further AI Outreach?
//         </Typography>

//         {/* Select Reason */}
//         <Box className = {styles.dialogSelectBox}>
//             <Typography className={styles.dialogSelectText}>
//             Select Reason </Typography>

//           <CustomSelect
//             // label="Select Reason"
//             variant="black"
//             value={reason}
//             onChange={handleReasonChange}
//             required
//             placeholder="Choose a reason"
//             options={[
//               { label: "Not a good fit", value: "Not a good fit" },
//               {
//                 label: "Manual handling preferred",
//                 value: "Manual handling preferred",
//               },
//               { label: "AI not accurate", value: "AI not accurate" },
//               { label: "Other", value: "Other" },
//             ]}
//             width="100%"
//           />
//         </Box>

//         {/* Confirm Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={onConfirm}
//           className={styles.dialogButton}
//         >
//           Yes, I Agree
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TakeOverDialog;
import CustomButton from "@/src/components/common/CustomButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface TakeOverDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TakeOverDialog: React.FC<TakeOverDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{fontSize:"24px",fontWeight:"600"}}>Confirm Take Over</DialogTitle>
      <DialogContent>
        <Typography fontSize={14} fontWeight={400} mb={2}>
          Are you sure you want to stop the campaign and take over manually?
        </Typography>
      </DialogContent>
      <DialogActions>
        <CustomButton variant="outlined" onClick={onClose}>
          No
        </CustomButton>
        <CustomButton
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color="primary"
        >
          Yes
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default TakeOverDialog;
