import { Card } from "@material-ui/core";
import React from "react";

type TabPanelProps = {
  children?: React.ReactNode;
  index: any;
  value: any;
  [key: string]: any;
};

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Card>
          {children}
        </Card>
      )}
    </div>
  );
};

export default TabPanel;
