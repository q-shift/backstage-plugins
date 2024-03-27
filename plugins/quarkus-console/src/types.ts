import {
  V1ObjectMeta,
  V1CronJob,
  V1DaemonSet,
  V1Deployment,
  V1DeploymentCondition,
  V1Job,
  V1Pod,
  V1PodSpec,
  V1ReplicaSet,
  V1Service,
  V1StatefulSet,
  V1Secret,
  V1ConfigMap,
  V1PersistentVolumeClaim,
} from '@kubernetes/client-node';

export type GroupVersionKind = {
  kind: string;
  apiVersion: string;
  apiGroup?: string;
};

export type Model = GroupVersionKind & {
  abbr: string;
  labelPlural: string;
  color?: string;
  plural?: string;
};

export type K8sWorkloadResource =
  | V1Deployment
  | V1Pod
  | V1Service
  | V1ReplicaSet
  | V1CronJob
  | V1DaemonSet
  | V1Job
  | V1StatefulSet;

export type K8sVolumeResource =
  | V1Secret
  | V1ConfigMap
  | V1PersistentVolumeClaim

export type K8sResource = K8sWorkloadResource | K8sVolumeResource;


export type K8sResponseData = {
  [key: string]: { data: K8sResource[] };
};

export type ClusterError = {
  errorType?: string;
  message?: string;
  resourcePath?: string;
  statusCode?: number;
};

export type ClusterErrors = ClusterError[];

export type K8sResourcesContextData = {
  watchResourcesData?: K8sResponseData;
  loading?: boolean;
  responseError?: string;
  selectedClusterErrors?: ClusterErrors;
  clusters: string[];
  setSelectedCluster: React.Dispatch<React.SetStateAction<number>>;
  selectedCluster?: number;
};



//
// Application
//

export declare type K8sResourceCommon = {
};

export type Snapshot = {
 name: string;
 x: string; 
 y: number;
}

export type Metrics = {
  cpu?: Snapshot[];
  memory?: Snapshot[];
  gcPause?: Snapshot[];
  gcOverhead?: Snapshot[];
};

export type Application = {
  apiVersion?: string;
  kind?: string;
  metadata?: V1ObjectMeta;
  cpu?: string;
  memory?: string;
  url?: string;
  metrics?: Metrics;
  spec?: V1PodSpec;
  status?: {
    availableReplicas?: number;
    collisionCount?: number;
    conditions?: V1DeploymentCondition[];
    observedGeneration?: number;
    readyReplicas?: number;
    replicas?: number;
    unavailableReplicas?: number;
    updatedReplicas?: number;
  };
};

export interface ApplicationPageProps {
  application: Application;
}

export function deploymentToApplication(deployment: V1Deployment): Application {
  return {
    kind: 'Deployment',
    metadata: deployment?.metadata,
    spec: deployment?.spec?.template?.spec,
    metrics: {
      cpu: [],
      memory: [],
      gcPause: [],
      gcOverhead: [],
    },
    status: deployment?.status,
  };
};

export class Version {
  version: string;
  major: number;
  minor: number;
  patch: number;

  constructor(version: string, major: number, minor: number, patch: number) {
    this.version = version;
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }

  // Static method to parse a version string
  static parseVersion(version: string): Version | null {
    const versionParts = version ? version.replace(/[^0-9.]/g, '').split('.') : [];
    let major = 0;
    let minor = 0;
    let patch = 0;

    if (versionParts.length >= 3) {
      major = parseInt(versionParts[0], 10);
      minor = parseInt(versionParts[1], 10);
      patch = parseInt(versionParts[2], 10);
    } else if (versionParts.length === 2) {
      major = parseInt(versionParts[0], 10);
      minor = parseInt(versionParts[1], 10);
      // patch defaults to 0
    } else if (versionParts.length === 1) {
      major = parseInt(versionParts[0], 10);
      // minor and patch default to 0
    } else {
      // Return null if the input is not valid
      return null;
    }

    return new Version(version, major, minor, patch);
  }
}
