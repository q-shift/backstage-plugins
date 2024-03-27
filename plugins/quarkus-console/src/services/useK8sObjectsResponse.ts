import { useState } from 'react';

import { useEntity } from '@backstage/plugin-catalog-react';
import { useKubernetesObjects } from '@backstage/plugin-kubernetes';

import { K8sResourcesContextData } from '../types';
import { useAllWatchResources } from './useAllWatchResources';
import { useK8sResourcesClusters } from './useK8sResourcesClusters';
import { ModelsPlural } from '../models';

import {
  V1Deployment,
  V1Job,
  V1Pod,
  V1Secret,
  V1ConfigMap,
  V1PersistentVolumeClaim,
} from '@kubernetes/client-node';

export const useK8sObjectsResponse = (
    watchedResource: string[],
): K8sResourcesContextData => {
    const { entity } = useEntity();
    const { kubernetesObjects, loading, error } = useKubernetesObjects(entity);
    const [selectedCluster, setSelectedCluster] = useState<number>(0);
    const watchResourcesData = useAllWatchResources(
        watchedResource,
        { kubernetesObjects, loading, error },
        selectedCluster,
    );
    const { clusters, errors: clusterErrors } = useK8sResourcesClusters({
        kubernetesObjects,
        loading,
        error,
    });
    return {
        watchResourcesData,
        loading,
        responseError: error,
        selectedClusterErrors: clusterErrors?.[selectedCluster] ?? [],
        clusters,
        setSelectedCluster,
        selectedCluster,
    };
};

export const useDeployments = (componentName: string) : V1Deployment[] => {
  const { watchResourcesData } = useK8sObjectsResponse([ModelsPlural.deployments]);
    const deployments: V1Deployment[] = ((watchResourcesData?.deployments?.data ??  []) as V1Deployment[])
      .filter((item: V1Deployment) => item && item.metadata && item.metadata.labels && 
      item.metadata.labels['backstage.io/kubernetes-id'] === componentName && 
      item.metadata.name && item.metadata.name.startsWith(componentName));
      return deployments;
};

export const usePods = () : V1Pod[] => {
  const { watchResourcesData } = useK8sObjectsResponse([ModelsPlural.pods]);
  return ((watchResourcesData?.pods?.data ??  []) as V1Pod[]);
};

export const useJobs = () : V1Job[] => {
  const { watchResourcesData } = useK8sObjectsResponse([ModelsPlural.jobs]);
  return ((watchResourcesData?.jobs?.data ??  []) as V1Job[]);
};

export const useAllSecrets = () : V1Secret[] => {
  const { watchResourcesData } = useK8sObjectsResponse([ModelsPlural.secrets]);
  return ((watchResourcesData?.secrets?.data ??  []) as V1Secret[]);
};

export const useSecret = (namespace: string|undefined, name: string) : V1Secret => {
  return useAllSecrets().filter((item: V1Secret) => item && item.metadata && item.metadata.namespace === namespace && item.metadata.name === name)[0];
};


export const useAllConfigMaps = () : V1ConfigMap[] => {
  const { watchResourcesData } = useK8sObjectsResponse([ModelsPlural.configmaps]);
  return ((watchResourcesData?.configmaps?.data ??  []) as V1ConfigMap[]);
};

export const useConfigMap = (namespace: string|undefined, name: string) : V1ConfigMap => {
  return useAllConfigMaps().filter((item: V1ConfigMap) => item && item.metadata && item.metadata.namespace === namespace && item.metadata.name === name)[0];
};

export const useAllPersistentVolumeClaims = () : V1PersistentVolumeClaim[] => {
  const { watchResourcesData } = useK8sObjectsResponse([ModelsPlural.persistentvolumeclaims]);
  return ((watchResourcesData?.persistentvolumeclaims?.data ??  []) as V1PersistentVolumeClaim[]);
};

export const usePersistentVolumeClaim = (namespace: string|undefined, name: string) : V1PersistentVolumeClaim => {
  return useAllPersistentVolumeClaims().filter((item: V1PersistentVolumeClaim) => item && item.metadata && item.metadata.namespace === namespace && item.metadata.name === name)[0];
};
