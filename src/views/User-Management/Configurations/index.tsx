import React from "react";
import { Box, Divider } from "@mui/material";
import TemplateSetting from "../TemplateSetting";
import OrganizationConfig from "./OrganizationConfig";
import styles from "../styles.module.scss";
const AgentConfiguration = ({ data, editable }: any) => {
  return (
    <Box mb={4} className={styles.agentMain}>
      <TemplateSetting />
      <Divider />
      <OrganizationConfig organizationData={data} editable />
    </Box>
  );
};

export default AgentConfiguration;
