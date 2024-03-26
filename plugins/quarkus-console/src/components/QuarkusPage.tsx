import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  V1Deployment,
} from '@kubernetes/client-node';

import { match as RMatch, useLocation } from 'react-router-dom';
import { Application, K8sWorkloadResource, deploymentToApplication } from '../types';

import QuarkusApplicationDetailsCard from './QuarkusApplicationDetailsCard';
import QuarkusApplicationHealthCard from './QuarkusApplicationHealthCard';
import QuarkusApplicationMetricsCard from './QuarkusApplicationMetricsCard';
import QuarkusApplicationConfigurationCard from './QuarkusApplicationConfigurationCard';
import QuarkusApplicationLoggingCard from './QuarkusApplicationLoggingCard';
import { ModelsPlural } from '../models';
import { useK8sObjectsResponse } from '../services/useK8sObjectsResponse';
import { K8sResourcesContext } from '../services/K8sResourcesContext';
import { QuarkusApplicationContext } from '../services/QuarkusApplicationContext';

const QuarkusPage: React.FC<ApplicationPageProps> = ({ match }) => {
  const watchedResources = [
    ModelsPlural.deployments,
    ModelsPlural.secrets,
    ModelsPlural.configmaps,
    ModelsPlural.persistentvolumeclaims,
  ];

  const k8sResourcesContextData = useK8sObjectsResponse(watchedResources);

  const { ns, kind, name } = match?.params || {};
  const [selectedNamespace] = useState<string>(ns || 'all-namespaces');
  const [selectedName] = useState<string>(name || '');
  const [selectedKind] = useState<string>(kind || 'Deployment');
  const [application, setApplication] = useState<Application>();
  const [activeTabKey, setActiveTabKey] = useState<number>(0);

  const currentPageLocation = useLocation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabKey(newValue);
  };

  useEffect(() => {
    if (!k8sResourcesContextData) {
      return;
    } 
    const componentName = currentPageLocation.pathname.split("/")[4];
    const k8sResources: K8sWorkloadResource[] | undefined = k8sResourcesContextData?.watchResourcesData?.deployments?.data;
    const deployments: V1Deployment[] = (k8sResources ? k8sResources as V1Deployment[]: [])
    .filter((item: V1Deployment) => item && item.metadata && item.metadata.labels && 
      item.metadata.labels['backstage.io/kubernetes-id'] === componentName && 
      item.metadata.name && item.metadata.name.startsWith(componentName));
    if (deployments.length === 0) {
      return;
    }
    console.log('deployments:', deployments[0]);
    setApplication(deploymentToApplication(deployments[0])); 
  }, [currentPageLocation, k8sResourcesContextData]);


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
