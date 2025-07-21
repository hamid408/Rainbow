// components/CardComponent.tsx

import {
  Avatar,
  Box,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import React, { useState } from "react";
import { CardData } from "./data";
import styles from "./styles.module.scss";
import { Ai, EditPurple, ThumbsDown, ThumbsUp } from "@/src/assests/icons";
import { Dialog } from "@mui/material";
import LeadDetails from "../../Lead-Details";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "@/src/components/common/CustomTextfield";
import CustomButton from "@/src/components/common/CustomButton";

interface Props {
  type: "conversation" | "message";
  data: CardData[];
}

const CardComponent: React.FC<Props> = ({ data }) => {
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [localData, setLocalData] = useState<CardData[]>(data);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [currentEditIndex, setCurrentEditIndex] = React.useState<number | null>(
    null
  );
  const [editMessageValue, setEditMessageValue] = React.useState("");

  const handleEditClick = (index: number) => {
    const item = localData[index];
    if (item.type === "message") {
      setCurrentEditIndex(index);
      setEditMessageValue(item.message);
      setEditDialogOpen(true);
    }
  };

  const handleSaveChanges = () => {
    if (currentEditIndex !== null) {
      const updatedData = [...localData];
      const currentItem = updatedData[currentEditIndex];
      if (currentItem.type === "message") {
        currentItem.message = editMessageValue;
        setLocalData(updatedData);
      }
      setEditDialogOpen(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newData = [...localData];
    const currentItem = newData[index];

    if (currentItem.type === "message") {
      currentItem.message = e.target.value;
      setLocalData(newData);
    }
  };

  const [openPopup, setOpenPopup] = React.useState(false);

  return (
    <>
      <CardContent sx={{ p: 0, flex: 1 }}>
        {localData.map((item, index) => (
          <React.Fragment key={index}>
            <Box className={styles.cardContentRootBox}>
              {/* Left Side: Avatar + Name + Description/Message */}
              <Box className={styles.leftContentBox}>
                <Avatar className={styles.avatar} src={item.avatarUrl}>
                  {item.avatarInitials}
                </Avatar>
                <Box sx={{ marginLeft: "-6px" }}>
                  <Typography variant="body1">{item.name}</Typography>

                  {item.type === "conversation" && (
                    <Typography className={styles.description}>
                      {item.description}
                    </Typography>
                  )}

                  {item.type === "message" && (
                    <Box className={styles.messageBox}>
                      <TextField
                        InputProps={{
                          disableUnderline: true,
                          readOnly: editableIndex !== index,
                          sx: {
                            fontSize: "14px !important",
                            fontWeight: "400 !important",
                            color: "text.primary",
                          },
                        }}
                        variant="standard"
                        value={
                          item.message.length > 30
                            ? `${item.message.slice(0, 25)}...`
                            : item.message
                        }
                        onChange={(e) => handleInputChange(e, index)}
                        fullWidth
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(index)}
                      >
                        <EditPurple />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Right Side: Time or Like/Dislike */}
              {item.type === "conversation" ? (
                <Box className={styles.rightContentBox}>
                  <Typography className={styles.timeAgoTypo}>
                    {item.timeAgo}
                  </Typography>
                  <Box
                    className={styles.roundIconBox}
                    onClick={() => setOpenPopup(true)}
                    sx={{ cursor: "pointer" }}
                  >
                    <NorthEastIcon className={styles.arrowIcon} />
                  </Box>

                  <Dialog
                    open={openPopup}
                    onClose={() => setOpenPopup(false)}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                      className: styles.dialogPaper,
                    }}
                    BackdropProps={{
                      className: styles.dialogBackdrop,
                    }}
                  >
                    <Box sx={{ position: "relative", p: 2 }}>
                      <IconButton
                        onClick={() => setOpenPopup(false)}
                        className={styles.closeIconButton}
                      >
                        <CloseIcon />
                      </IconButton>

                      <Box className={styles.leadDetailsSmallText}>
                        <LeadDetails
                          leadId="50b5897c-eb12-4e2b-897d-d91c5cbdd3b5"
                          hideBackButton={true}
                        />
                      </Box>
                    </Box>
                  </Dialog>
                </Box>
              ) : (
                <Box className={styles.likeDislikeBox}>
                  <IconButton size="small">
                    <ThumbsDown />
                  </IconButton>
                  <IconButton size="small">
                    <ThumbsUp />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* <Box className={styles.dividerContainer}> */}
              {/* Divider between entries (except after last) */}
              {index !== localData.length - 1 && (
                <Divider className={styles.insideDivider} />
              )}
            {/* </Box> */}
          </React.Fragment>
        ))}
      </CardContent>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
          },
        }}
      >
        {/* Header with title and close icon */}
        <Box className={styles.editPopUpBox}>
          <Typography className={styles.editMessageTypo}>
            Edit Message
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider className={styles.editPopUpDivider} />

        {/* AI Suggested Box */}
        <Box className={styles.aiSuggestedBox}>
          <Box className={styles.textBox}>
            {/* Replace with your thunder icon */}
            <Ai />
            <Typography className={styles.messageTypo}>
              AI Suggested Message
            </Typography>
          </Box>

          <CustomTextField
            value={editMessageValue}
            onChange={(e) => setEditMessageValue(e.target.value)}
            fullWidth
            multiline
            minRows={1}
            variant="outlined"
          />
        </Box>

        {/* Save Button */}
        <Box className={styles.saveBtn}>
          <CustomButton
            onClick={handleSaveChanges}
            variant="contained"
            background="#6B39F4"
          >
            Save Changes
          </CustomButton>
        </Box>
      </Dialog>
    </>
  );
};

export default CardComponent;
