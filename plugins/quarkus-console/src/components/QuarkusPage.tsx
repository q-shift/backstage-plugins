import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { match as RMatch } from 'react-router-dom';
import { Application } from '../types/types';

import QuarkusApplicationDetailsCard from './QuarkusApplicationDetailsCard';
import QuarkusApplicationHealthCard from './QuarkusApplicationHealthCard';
import QuarkusApplicationMetricsCard from './QuarkusApplicationMetricsCard';
import QuarkusApplicationConfigurationCard from './QuarkusApplicationConfigurationCard';
import QuarkusApplicationLoggingCard from './QuarkusApplicationLoggingCard';

const QuarkusPage: React.FC<ApplicationPageProps> = ({ match }) => {
  const { ns, kind, name } = match?.params || {};
  const [selectedNamespace] = useState<string>(ns || 'all-namespaces');
  const [selectedName] = useState<string>(name || '');
  const [selectedKind] = useState<string>(kind || 'Deployment');
  const [application, setApplication] = useState<Application>();
  const [activeTabKey, setActiveTabKey] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabKey(newValue);
  };

  useEffect(() => {
    /*
    fetchApplicationWithMetrics(selectedKind, selectedNamespace, selectedName)
      .then((app: Application) => {
        setApplication(app);
      });
    */
  }, [selectedNamespace, selectedKind, selectedName]);


  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{selectedNamespace} - {selectedName}</title>
      </Helmet>
        <Tabs value={activeTabKey} onChange={handleTabChange}>
          <Tab label="Details" />
          <Tab label="Metrics" />
          <Tab label="Health" />
          <Tab label="Configuration" />
          <Tab label="Logging" />
        </Tabs>
      {activeTabKey === 0 && (
        <QuarkusApplicationDetailsCard application={application} />
      )}
      {activeTabKey === 1 && (
        <QuarkusApplicationMetricsCard application={application} />
      )}
      {activeTabKey === 2 && (
        <QuarkusApplicationHealthCard application={application} />
      )}
      {activeTabKey === 3 && (
        <QuarkusApplicationConfigurationCard application={application} />
      )}
      {activeTabKey === 4 && (
        <QuarkusApplicationLoggingCard application={application} />
      )}
    </>
  );
};

type ApplicationPageProps = {
  match: RMatch<{
    ns?: string;
    kind?: string;
    name?: string;
  }>;
};

export default QuarkusPage
