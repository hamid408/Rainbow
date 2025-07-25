import { Stack, IconButton } from "@mui/material";
 
import { Phone, Typing } from "@/assests/icons";
 
const iconStyle = {
  border: "1px solid #7A4DF5",
  borderRadius: "50%",
  width: 52,
  height: 52,
  color: "#8647F5",
};
 
const ActionButtons = ({ callOpen, emailOpen }: any) => {
  const handleOpenCallModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    callOpen(true);
  };
 
  return (
    <>
      <Stack direction="row" spacing={2}>
        <IconButton
          sx={iconStyle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenCallModal(e);
          }}
        >
          <Phone />
        </IconButton>
        <IconButton
          sx={iconStyle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            emailOpen(true);
          }}
        >
          <Typing />
        </IconButton>
      </Stack>
    </>
  );
};
 
export default ActionButtons;