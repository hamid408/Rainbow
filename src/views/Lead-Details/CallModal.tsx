"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { initTwilioDevice } from "@/src/utils/Twilio";
import {
  Call,
  CallEnd,
  CallMade,
  CallRounded,
  MaleOutlined,
  Person2Outlined,
  PersonOutline,
  VerifiedUserSharp,
} from "@mui/icons-material";
import { useCreateBotCallMutation } from "@/src/redux/services/twilio/twilioApi";
import { toast } from "react-toastify";
import { useGetCurrentUserQuery } from "@/src/redux/services/users/usersApi";
import styles from "./style.module.scss";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

export default function CallModal({
  open,
  onClose,
  leadId,
  phone,
}: {
  open: boolean;
  onClose: () => void;
  leadId?: any;
  phone?: string;
}) {
  const [error, setError] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [conn, setConn] = useState<any>(null);
  const [callStarted, setCallStarted] = useState(false);

  const [createBotCall, { isLoading, isError, data }] =
    useCreateBotCallMutation();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch,
  } = useGetCurrentUserQuery();

  if (userLoading)
    return (
      // <div>
      //   <CircularProgress />
      // </div>
      null
    );
  const user = userData?.data?.[0];
  // const handleBotCall = async () => {
  //   try {
  //     const res = await createBotCall({ lead_id: leadId }).unwrap();
  //     console.log("Bot Call Started:", res);
  //     toast.success(res.message || "Call Successfully Initiated");
  //     onClose();
  //   } catch (err) {
  //     console.error(" Bot Call Failed:", err);
  //     toast.error(" Bot Call Failed ");
  //     onClose();
  //   }
  // };

  function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === "object" && error !== null && "status" in error;
  }

  const handleBotCall = async () => {
    try {
      const response = await createBotCall({ lead_id: leadId });

      if ("error" in response) {
        const error = response.error;

        if (isFetchBaseQueryError(error)) {
          const status = error.status;
          const message = (error.data as any)?.message;

          if (status === 501) {
            toast.warning(message || "Call already in progress.");
            onClose();
          } else if (status === 404) {
            toast.error(message || "Lead not found.");
            onClose();
          } else {
            toast.error(
              `Error ${status || "unknown"}: ${message || "Call failed."}`
            );
            onClose();
          }
        } else {
          toast.error("Unexpected client-side error.");
        }

        return; 
      }

      const message = "Call successfully initiated.";

      toast.success(message);
      onClose();
    } catch (err) {
      console.error("Unexpected JS error:", err);
      toast.error("Something went wrong while initiating the call.");
      onClose();
    }
  };

  const handleCall = async () => {
    try {
      setIsCalling(true);
      const device = await initTwilioDevice(leadId);
      const connection = await device.connect({
        params: {
          lead_id: leadId,
          user_id: user.id,
        },
      });
      console.log("to number-----", phone);
      setConn(connection);
      setCallStarted(true);
      connection.on("accept", () => {
        console.log("Call accepted");
      });

      connection.on("disconnect", () => {
        console.log("Call ended");
        if (typeof window !== "undefined") {
          const event = new CustomEvent("twilio-call-rejected");
          window.dispatchEvent(event);
        }
        setIsCalling(false);
        setCallStarted(false);
        setConn(null);
      });

      connection.on("cancel", () => {
        console.log("Call was canceled by the other user");
        if (typeof window !== "undefined") {
          const event = new CustomEvent("twilio-call-rejected");
          window.dispatchEvent(event);
        }
        setIsCalling(false);
        setCallStarted(false);
        setConn(null);
        onClose();
      });

      connection.on("reject", () => {
        console.log("Call was rejected");
        if (typeof window !== "undefined") {
          const event = new CustomEvent("twilio-call-rejected");
          window.dispatchEvent(event);
        }
        setIsCalling(false);
        setCallStarted(false);
        setConn(null);
        onClose();
      });

      connection.on("error", (err) => {
        console.error("Twilio Call Error:", err);
        if (
          err.code === 31003 ||
          err.code === 31000 ||
          err.message.includes("busy")
        ) {
          console.log("Call was rejected or unreachable.");
          window.dispatchEvent(new Event("twilio-call-rejected"));
        }
        setError("Call error: " + err.message);
        setIsCalling(false);
        setCallStarted(false);
        setConn(null);
        onClose();
      });
    } catch (err) {
      console.error("Error starting call:", err);
      setError("Could not start call.");
      setIsCalling(false);
      setCallStarted(false);
    }
  };

  const handleEndCall = () => {
    if (conn) {
      conn.disconnect();
    }
    setIsCalling(false);
    setCallStarted(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      // onClose={onClose}
      //  open={open}
      onClose={(event, reason) => {
        if (
          callStarted &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        ) {
          return;
        }
        onClose();
      }}
      aria-labelledby="twilio-call-modal"
      aria-describedby="twilio-call-description"
    >
      <Box className={styles.callModalBox}>
        {callStarted ? (
          <Stack className={styles.callingBox}>
            <Typography variant="h6" mb={3}>
              Ringing {phone}...
              {/* {callConnected ? "Connected" : `Ringing ${phone}...`} */}
            </Typography>
            <Box>
              <PersonOutline className={styles.callLogOutline} />
            </Box>
            <Stack className={styles.ringingStack}>
              <Button
                variant="contained"
                color="error"
                onClick={handleEndCall}
                className={styles.ringingBtn}
              >
                <CallEnd />
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography variant="h6" className={styles.callModalTypo}>
              Start a call{" "}
            </Typography>
            <Stack spacing={4} mt={2}>
              <Box sx={{ display: "flex", justifyContent: "end", gap: "24px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCall}
                  disabled={isCalling}
                  startIcon={<CallRounded />}
                  className={styles.callModalSelfCall}
                >
                  Self Call
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBotCall}
                  disabled={isCalling}
                  startIcon={<CallRounded />}
                  className={styles.callModalBotCall}
                >
                  Call via Bot
                </Button>
              </Box>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
}
