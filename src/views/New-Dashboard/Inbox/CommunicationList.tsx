import React, { useState } from "react";
import CommunicationRow from "./CommunicationRow";
import CustomSearchField from "@/src/components/common/CustomSearch";
import { Add, Search } from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import IconChip from "@/src/components/common/CustomChip";
import { Plus } from "@/src/assests/icons";

const initialData = [
  {
    name: "James Carter",
    status: "AI attempted live transfer, but your office did not answer.",
    actionItem: "Please return call or reschedule transfer.",
  },
  {
    name: "Maria Lopez",
    status: "AI successfully connected live call. Conversation held on 09/27.",
    actionItem: "Review notes and follow up with family as needed.",
  },
  {
    name: "Danielle Patel",
    status:
      "Family asked if Catholic and Buddhist traditions can be combined. AI paused outreach pending your input.",
    actionItem: "Review AI draft reply or respond directly to family.",
  },
  {
    name: "Homie Lopez",
    status: "AI successfully connected live call. Conversation held on 09/27.",
    actionItem: "Review notes and follow up with family as needed.",
  },
];

const CommunicationList = () => {
  const [search, setSearch] = useState("");
  const [checkedItems, setCheckedItems] = useState<any>({});

  const handleCheck = (name: any) => {
    setCheckedItems((prev: any) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const filteredData = initialData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box style={styles.container}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <CustomSearchField
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
          startIcon={<Search />}
        />
        <Typography
          variant="subtitle1"
          fontWeight={400}
          fontSize={14}
          color="#818181"
          marginRight={2.5}
        >
          Showing 3 results
        </Typography>
      </Box>
      <Divider />
      <Box
        display={"flex"}
        gap={1.5}
        alignItems={"center"}
        marginLeft={2.3}
        marginBottom={2.3}
        marginTop={2.3}
      >
        <IconChip
          label="Creation Date"
          icon={<Plus />}
          onClick={() => alert("Home clicked!")}
          color="#656565"
        />
        <IconChip
          label="Last Response Date"
          icon={<Plus />}
          onClick={() => alert("Home clicked!")}
          color="#656565"
        />
        <IconChip
          label="Tag"
          icon={<Plus />}
          onClick={() => alert("Home clicked!")}
          color="#656565"
        />
        <IconChip
          label="Source"
          icon={<Plus />}
          onClick={() => alert("Home clicked!")}
          color="#656565"
        />
      </Box>

      {filteredData.map((item) => (
        <CommunicationRow
          key={item.name}
          name={item.name}
          status={item.status}
          actionItem={item.actionItem}
          checked={!!checkedItems[item.name]}
          onCheck={() => handleCheck(item.name)}
        />
      ))}
    </Box>
  );
};

const styles = {
  container: {
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    borderRadius: "12px",
    borderColor: "#160707ff",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  search: {
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
    marginTop: "12px",
    marginLeft: "12px",
  },
};

export default CommunicationList;
