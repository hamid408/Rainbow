import { Box, Typography } from "@mui/material";
import React from "react";
import Header from "./Header";
import ChatMessage from "./ChatMessage";
import SummaryCard from "./SummaryCard";

const NewLeadDetails = () => {
  return (
    <Box p={3}>
      <Header />
      <Box>
        <Box>
          <SummaryCard
            name="Danielle Patel"
            status="AI is active"
            summary="Danielle asked if it’s possible to combine Catholic and Buddhist traditions for her mother’s service."
            flaggedText="AI paused to flag this as a sensitive question."
          />
        </Box>
        <Box mt={1.5} mb={3.3} textAlign={"center"}>
          <Typography
            fontSize={14}
            fontWeight={700}
            mb={0.1}
            color="#0D0D12"
            variant="subtitle1"
          >
            Danielle Patel started this conversation via website contact form.
          </Typography>
          <Typography fontSize={12} fontWeight={400} color="#666D80" variant="caption">
            Yesterday 2:24PM
          </Typography>
        </Box>

        <Box>
          <ChatMessage
            sender="user"
            text="Hello, I’m looking into arrangements for my mother. She was Catholic, but much of our family is Buddhist. We’d like to know if it’s possible to combine both traditions in her service."
            channel="Website Form"
            time="Today 2:24PM"
          />

          <ChatMessage
            sender="bot"
            text="Thank you for sharing that, Danielle. I’m very sorry for your loss. Many families find comfort in incorporating personal or cultural traditions. Would you like me to connect you with a counselor who can discuss how services can be adapted to reflect both faiths?"
            channel="SMS"
            time="Today 2:24PM"
          />

          <ChatMessage
            sender="user"
            text="Yes, I’d like to know if that’s something you can do, and what it might look like."
            channel="SMS"
            time="Today 2:26PM"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NewLeadDetails;
