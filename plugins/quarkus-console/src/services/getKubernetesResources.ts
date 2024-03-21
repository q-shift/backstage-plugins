import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import { ModelsPlural, resourceGVKs, resourceModels } from '../models';
import {
  ClusterErrors,
  K8sResponseData,
  K8sWorkloadResource,
} from '../types';

export const WORKLOAD_TYPES: string[] = [
  ModelsPlural.deployments,
  ModelsPlural.pods,
  ModelsPlural.cronjobs,
  ModelsPlural.jobs,
  ModelsPlural.statefulsets,
  ModelsPlural.daemonsets,
];

const apiVersionForWorkloadType = (type: string) => {
  return resourceGVKs[type]?.apiGroup
    ? `${resourceGVKs[type].apiGroup}/${resourceGVKs[type].apiVersion}`
    : resourceGVKs[type]?.apiVersion;
};

const workloadKind = (type: string) => {
  return resourceGVKs[type].kind;
};

export const getClusters = (k8sObjects: ObjectsByEntityResponse) => {
  const clusters: string[] = k8sObjects.items.map(
    (item: any) => item.cluster.name,
  );
  const errors: ClusterErrors[] = k8sObjects.items.map(
    (item: any) => item.errors,
  );
  return { clusters, errors };
};

export const getCustomResourceKind = (resource: any): string => {
  if (resource.kind) {
    return resource.kind;
  }

  if (resource.spec.host && resource.status.ingress) {
    return 'Route';
  }
  return '';
};

export const getK8sResources = (
  cluster: number,
  k8sObjects: ObjectsByEntityResponse,
) =>
  k8sObjects.items?.[cluster]?.resources?.reduce(
    (acc: K8sResponseData, res: any) => {
      if (res.type === 'customresources' && res.resources.length > 0) {
        const customResKind = getCustomResourceKind(res.resources[0]);
        const customResKnownModel = resourceModels[customResKind];
        return customResKnownModel?.plural
          ? {
              ...acc,
              [customResKnownModel.plural]: {
                data: res.resources.map((rval: K8sWorkloadResource) => ({
                  ...rval,
                  kind: customResKind,
                  apiVersion: apiVersionForWorkloadType(customResKind),
                })),
              },
            }
          : acc;
      }
      return {
        ...acc,
        [res.type]: {
          data:
            (resourceGVKs[res.type] &&
              res.resources.map((rval: K8sWorkloadResource) => ({
                ...rval,
                kind: workloadKind(res.type),
                apiVersion: apiVersionForWorkloadType(res.type),
              }))) ??
            [],
        },
      };
    },
    {},
  );


export const getWorkloadResources = (resources: K8sResponseData) => {
  const workloadTypes = [...WORKLOAD_TYPES];
  const workloadRes = workloadTypes
    .map(resourceKind => {
      return resources[resourceKind]
        ? resources[resourceKind]?.data.map(res => {
            const kind = res.kind;
            const apiVersion = res.apiVersion;
            return {
              kind,
              apiVersion,
              ...res,
            };
          })
        : [];
    })
    .flat();
  return workloadRes;
};
