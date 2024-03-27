import React, { useState, useEffect } from 'react';
import {
  Tab,
  Tabs,
} from '@mui/material';
import {
  V1Deployment,
} from '@kubernetes/client-node';

import { useLocation } from 'react-router-dom';
import { Application, K8sResource, deploymentToApplication } from '../types';

import QuarkusApplicationDetailsCard from './QuarkusApplicationDetailsCard';
import QuarkusApplicationHealthCard from './QuarkusApplicationHealthCard';
import QuarkusApplicationMetricsCard from './QuarkusApplicationMetricsCard';
import QuarkusApplicationConfigurationCard from './QuarkusApplicationConfigurationCard';
import QuarkusApplicationLoggingCard from './QuarkusApplicationLoggingCard';
import { ModelsPlural } from '../models';
import { useK8sObjectsResponse } from '../services/useK8sObjectsResponse';

const QuarkusPage = () => {
  const watchedResources = [
    ModelsPlural.deployments,
    ModelsPlural.secrets,
    ModelsPlural.configmaps,
    ModelsPlural.persistentvolumeclaims,
  ];

  const k8sResourcesContextData = useK8sObjectsResponse(watchedResources);
  const [application, setApplication] = useState<Application>();
  const [activeTabKey, setActiveTabKey] = useState<number>(0);

  const currentPageLocation = useLocation();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabKey(newValue);
  };

  useEffect(() => {
    if (!k8sResourcesContextData) {
      return;
    } 
    const componentName = currentPageLocation.pathname.split("/")[4];
    const k8sResources: K8sResource[] | undefined = k8sResourcesContextData?.watchResourcesData?.deployments?.data;
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

  return (
    <>
      {application && application.metadata && <>
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
      </>}
      </>
  );
};

export default QuarkusPage;
