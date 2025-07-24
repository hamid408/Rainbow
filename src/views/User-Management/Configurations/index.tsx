import React from "react";
import { Box, Divider } from "@mui/material";
import TemplateSetting from "../TemplateSetting";
import OrganizationConfig from "./OrganizationConfig";
const AgentConfiguration = ({ data,editable }: any) => {
  return (
    <Box mb={4}>
      <TemplateSetting />
      <Divider />
      <OrganizationConfig organizationData={data} editable/>
    </Box>
  );
};

export default AgentConfiguration;
