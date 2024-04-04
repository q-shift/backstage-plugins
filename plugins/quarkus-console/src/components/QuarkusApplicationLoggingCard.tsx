import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import {  ApplicationPageProps } from '../types';
import { ContainerScope, PodLogs } from '@backstage/plugin-kubernetes-react';

import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import TabPanel from './ui/TabPanel';

interface Logger {
  name: string;
  level: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  pageSection: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
  },
  cardTitle: {
    fontSize: '1.25rem',
  },
  inputIcon: {
    marginRight: theme.spacing(1),
  },
}));

export const QuarkusApplicationLoggingCard: React.FC<ApplicationPageProps> = ({ application }) => {

  const classes = useStyles();
  const [activeTabKey, setActiveTabKey] = useState<number>(0);
  const [container, setContainer] = useState<ContainerScope>();


  const logLevels = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
  const [selected, setSelected] = useState<string>('INFO');
  const [loggers, _] = useState<Logger[]>([{name: 'root', level: 'INFO'}]);

  useEffect(() => {
    if (!application) {
      return;
    }

    let podName = application?.metadata?.name;
    let podNamespace = application?.metadata?.namespace;
    let clusterName = application?.clusterName;
    let containerName = application?.spec?.containers[0].name;
    if (podName && podNamespace && clusterName && containerName) {
      let newContainerScope: ContainerScope = {
        cluster: {
          name: clusterName,
        },
        podName: podName,
        podNamespace: podNamespace,
        containerName: containerName,
      };
      setContainer(newContainerScope);
    }
  }, [application]);

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTabKey(newValue);
  };

  return (
    <Card>
      <CardHeader title="Logging" titleTypographyProps={{ className: classes.cardTitle }} />
      <CardContent>
        <Tabs value={activeTabKey} onChange={handleTabChange} aria-label="log tabs">
          <Tab label="Logs" />
          <Tab label="Loggers" />
        </Tabs>

        <TabPanel value={activeTabKey} index={0}>
          {application && application.metadata && container && (
            <PodLogs containerScope={container}/>
          )}
        </TabPanel>
        <TabPanel value={activeTabKey} index={1}>
          <Table className="mock">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loggers.map((logger) => (
                <TableRow key={logger.name}>
                  <TableCell>{logger.name}</TableCell>
                  <TableCell>
                    <ToggleButtonGroup
                      value={selected}
                      exclusive
                      onChange={(_, newLevel) => setSelected(newLevel)}
                      aria-label="Log levels"
                    >
                      {logLevels.map((level) => (
                        <ToggleButton key={level} value={level}>
                          {level}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
      </CardContent>
    </Card>
  );
}

export default QuarkusApplicationLoggingCard;
