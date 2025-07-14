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
import EditIcon from "@mui/icons-material/Edit";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import React from "react";
import { CardData } from "./data";
import styles from "./styles.module.scss";
import { EditPurple, ThumbsDown, ThumbsUp } from "@/src/assests/icons";
import { Dialog } from "@mui/material";
import CardsRow from "./CardsRow";

interface Props {
  type: "conversation" | "message";
  data: CardData[];
}

const CardComponent: React.FC<Props> = ({ type, data }) => {
  const [editableIndex, setEditableIndex] = React.useState<number | null>(null);
  const [localData, setLocalData] = React.useState<CardData[]>(data);

  const handleEditClick = (index: number) => {
    setEditableIndex(index);
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
  const handleOpen = () => setOpenPopup(true);
  const handleClose = () => setOpenPopup(false);

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
                <Box>
                  <Typography className={styles.name}>{item.name}</Typography>

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
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "text.primary",
                          },
                        }}
                        variant="standard"
                        value={item.message}
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
                    onClick={handleOpen}
                    sx={{ cursor: "pointer" }}
                  >
                    <NorthEastIcon className={styles.arrowIcon} />
                  </Box>

                  <Dialog
                    open={openPopup}
                    onClose={handleClose}
                    maxWidth="sm"
                    fullWidth
                    hideBackdrop
                  >
                    {/* <CardsRow onClose={handleClose} /> */}
                  </Dialog>
                </Box>
              ) : (
                <Box display="flex" gap={0.5} ml={2.5}>
                  <IconButton size="small">
                    <ThumbsDown />
                  </IconButton>
                  <IconButton size="small">
                    <ThumbsUp />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Divider between entries (except after last) */}
            {index !== localData.length - 1 && (
              <Divider className={styles.insideDivider} />
            )}
          </React.Fragment>
        ))}
      </CardContent>
    </>
  );
};

export default CardComponent;
