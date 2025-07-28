import CustomTabs from "@/src/components/common/CustomTabs";

import { Box } from "@mui/material";
import React, { useState } from "react";
import Badge from "./Badge";
import CampaignTable from "./Campagin-Table";

const Campagins = () => {
  const [activeTab, setActiveTab] = useState("Badges");
  return (
    <>
      <>
        <Box>
          <CustomTabs
            tabs={[{ label: "Badges" }, { label: "Campaigns" }]}
            activeColor="#8647F5"
            onTabChange={(label: any) => setActiveTab(label)}
          />

          <Box mt={3}>
            {activeTab === "Badges" && <Badge />}

            {activeTab === "Campaigns" && <CampaignTable />}
          </Box>
        </Box>
      </>
    </>
  );
};

export default Campagins;
