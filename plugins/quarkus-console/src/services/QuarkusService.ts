import { Application, deploymentConfigToApplication, deploymentToApplication } from '../types';
import { sprintf } from 'sprintf-js';

const OPENSHIFT_RUNTIME = 'app.openshift.io/runtime';

export async function fetchDeployments(ns: string): Promise<Application[]>  {
  let deploymentsUri = ns ? '/api/kubernetes/apis/apps/v1/namespaces/' + ns + '/deployments' : '/api/kubernetes/apis/apps/v1/deployments';
  return consoleFetchJSON(deploymentsUri).then(res => {
    return res.items
      .filter((d: DeploymentKind) => (d.metadata.labels && d.metadata.labels[OPENSHIFT_RUNTIME] && d.metadata.labels[OPENSHIFT_RUNTIME] === 'quarkus'))
      .map((d: DeploymentKind) => deploymentToApplication(d));
  });
}

async function fetchDeployment(ns: string, name: string): Promise<Application>  {
  return consoleFetchJSON('/api/kubernetes/apis/apps/v1/namespaces/' + ns + '/deployments/' + name).then(res => {
       if (res.metadata.labels?.['app.openshift.io/runtime'] === 'quarkus') {
           return deploymentToApplication(res);
       }
       return null;
  }).catch(_ => {
    return null;
  });
}

async function deleteDeployment(ns: string, name: string): Promise<boolean>  {
  return consoleFetchJSON.delete('/api/kubernetes/apis/apps/v1/namespaces/' + ns + '/deployments/' + name).then(res => {
       return true;
  }).catch(_ => {
    return false;
  });
}

export async function fetchDeploymentConfigs(ns: string): Promise<Application[]> {
  let deploymentConfigUri = ns ? '/api/kubernetes/apis/apps.openshift.io/v1/namespaces/' + ns + '/deploymentconfigs' : '/api/kubernetes/apis/apps.openshift.io/v1/deploymentconfigs';
  return consoleFetchJSON(deploymentConfigUri).then(res => {
    return res.items
      .filter((d: DeploymentConfigKind) => (d.metadata.labels && d.metadata.labels[OPENSHIFT_RUNTIME] && d.metadata.labels[OPENSHIFT_RUNTIME] === 'quarkus'))
      .map((d: DeploymentConfigKind) => deploymentConfigToApplication(d));
  }).catch(_ => {
      return null;
  });
}

async function fetchDeploymentConfig(ns: string, name: string): Promise<Application>  {
  return consoleFetchJSON('/api/kubernetes/apis/apps.openshift.io/v1/namespaces/' + ns + '/deploymentconfigs/'+ name).then(res => {
       if (res.metadata.labels?.['app.openshift.io/runtime'] === 'quarkus') {
           return deploymentConfigToApplication(res);
       }
       return null;
  });
}

async function deleteDeploymentConfig(ns: string, name: string): Promise<boolean>  {
  return consoleFetchJSON('/api/kubernetes/apis/apps.openshift.io/v1/namespaces/' + ns + '/deploymentconfigs/'+ name).then(res => {
       return true;
  }).catch(_ => {
    return false;
  });
}

export async function fetchSecret(ns: string, name: string): Promise<V1Secret>  {
  return consoleFetchJSON('/api/kubernetes/api/v1/namespaces/' + ns + '/secrets/' + name).then(res => {
     return res.data;
  }).catch(_ => {
    return null;
  });
}

export async function fetchConfigMap(ns: string, name: string): Promise<V1ConfigMap>  {
  return consoleFetchJSON('/api/kubernetes/api/v1/namespaces/' + ns + '/configmaps/' + name).then(res => {
     return res.data;
  }).catch(_ => {
    return null;
  });
}

export async function fetchPvc(ns: string, name: string): Promise<V1PersistenceVolumeClaim>  {
  return consoleFetchJSON('/api/kubernetes/api/v1/namespaces/' + ns + '/persistentvolumeclaims/' + name).then(res => {
     return res.data;
  }).catch(_ => {
    return null;
  });
}

export async function fetchJobs(ns: string): Promise<V1Job[]>  {
  return consoleFetchJSON('/api/kubernetes/apis/batch/v1/namespaces/' + ns + '/jobs/').then(res => {
     return res.items;
  }).catch(_ => {
    return null;
  });
}

export async function fetchJob(ns: string, name: string): Promise<V1Job>  {
  return consoleFetchJSON('/api/kubernetes/apis/batch/v1/namespaces/' + ns + '/jobs/' + name).then(res => {
     return res.data;
  }).catch(_ => {
    return null;
  });
}

export async function populateAdddionalInfo(app: Application): Promise<Application>  {
  return populateCpu(app).then(populateCpuMetrics).then(populateMem).then(populateMemMetrics).then(populateRoute);
}

async function populateCpu (app: Application): Promise<Application> {
  return consoleFetchJSON('/api/prometheus/api/v1/query?query=avg_over_time(process_cpu_usage{service="' + app.metadata.name + '", namespace="' + app.metadata.namespace + '"}[1m]) * 100 / avg_over_time(system_cpu_usage[1m])').then((res) => {
    let newApp: Application = {...app};
    if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
      newApp.cpu=sprintf('%.2f', res.data.result[0].value[1]);
    }
    return newApp;
  });
}

async function populateCpuMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=avg_over_time(process_cpu_usage{service="${app.metadata.name}", namespace="${app.metadata.namespace}"}[1m]) * 100 / avg_over_time(system_cpu_usage[1m])&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp
      newApp.metrics = newApp.metrics || {};
      newApp.metrics.cpu = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }
    return newApp;
  }).catch(error => {
    console.error('Error fetching CPU metrics:', error);
    return app; // Return the original app object in case of error
  });
}

async function populateMem (app: Application): Promise<Application>  {
  return consoleFetchJSON('/api/prometheus/api/v1/query?query=sum(jvm_memory_used_bytes{namespace="' + app.metadata.namespace + '", service="' +  app.metadata.name + '"} / (1024 * 1024))').then((res) => {
    let newApp: Application = {...app};
    if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
      newApp.memory=sprintf('%.2f MB', res.data.result[0].value[1]);
    }
    return newApp;
  });
}

async function populateMemMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=sum(jvm_memory_used_bytes{namespace="${app.metadata.namespace}", service="${app.metadata.name}"} / (1024 * 1024))&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp

      newApp.metrics = newApp.metrics || {};
      newApp.metrics.memory = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }

    return newApp;
  }).catch(error => {
    console.error('Error fetching memory metrics:', error);
    return app; // Return the original app object in case of error
  });
}

export async function populateGCPauseMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=avg_over_time(jvm_gc_pause_seconds_count{namespace="${app.metadata.namespace}", service="${app.metadata.name}"} / (1024 * 1024))&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp

      newApp.metrics = newApp.metrics || {};
      newApp.metrics.gcPause = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }

    return newApp;
  }).catch(error => {
    console.error('Error fetching memory metrics:', error);
    return app; // Return the original app object in case of error
  });
}

export async function populateGCOverheadMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=avg_over_time(jvm_gc_overhead_percent{service="${app.metadata.name}", namespace="${app.metadata.namespace}"}[1m]) * 100 / avg_over_time(system_cpu_usage[1m])&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp

      newApp.metrics = newApp.metrics || {};
      newApp.metrics.gcOverhead = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }

    return newApp;
  }).catch(error => {
    console.error('Error fetching memory metrics:', error);
    return app; // Return the original app object in case of error
  });
}

export async function populateRoute(app: Application): Promise<Application>  {
  return consoleFetchJSON('/api/kubernetes/apis/route.openshift.io/v1/namespaces/' + app.metadata.namespace + '/routes/'+ app.metadata.name).then((route: RouteKind) => {
    let newApp: Application = {...app};
    const protocol = route.spec.tls ? 'https' : 'http';
    newApp.url=  protocol + "://" + route.spec.host;
    return newApp;
  }).catch(_ => {
    return app;
  });
}

export async function fetchApplications(ns: string): Promise<Application[]> {
  return Promise.all([fetchDeployments(ns), fetchDeploymentConfigs(ns)]).then(([deployments, deploymentConfigs]) => {
    return deployments.concat(deploymentConfigs);
  });
}


export async function fetchApplicationsWithMetrics(ns: string): Promise<Application[]> {
  // Fetch applications
  return fetchApplications(ns).then((applications) => {
      const populatePromises = applications.map((app) => populateAdddionalInfo(app));
      return Promise.all(populatePromises);
    }).then((applications) => {
      return applications;
    }).catch((error) => {
      console.error('Error fetching and populating metrics:', error);
      throw error;
    });
}

export async function fetchApplicationPods(ns: string, applicationName: string): Promise<V1Pod[]>  {
  return consoleFetchJSON('/api/kubernetes/api/v1/namespaces/' + ns + '/pods?labelSelector=app.kubernetes.io/name%3D' + applicationName).then(res => {
     return res.items;
  }).catch(_ => {
    return null;
  });
}

export async function fetchPodsLogs(ns: string, podName: string, containerName?: string): Promise<string>  {
  let logUri = '/api/kubernetes/api/v1/namespaces/' + ns + '/pods/' + podName + '/log';
  if (containerName) {
    logUri += '?container=' + containerName;
  }
  return consoleFetchJSON(logUri).then(res => {
     return res;
  }).catch(_ => {
    return null;
  });
}


export async function fetchApplication(kind: string, ns: string, name: string): Promise<Application> {
  let app: Promise<Application>;
  switch (kind) {
    case 'Deployment':
      app = fetchDeployment(ns, name);
      break;
    case 'DeploymentConfig':
      app = fetchDeploymentConfig(ns, name);
      break;
    default:
      throw new Error('Invalid kind: ' + kind);
  }
  return app.then(populateRoute).then(populateCpuMetrics).then(populateMemMetrics);
}

export async function fetchApplicationWithMetrics(kind: string, ns: string, name: string): Promise<Application> {
  let app: Promise<Application>;
  switch (kind) {
    case 'Deployment':
      app = fetchDeployment(ns, name);
      break;
    case 'DeploymentConfig':
      app = fetchDeploymentConfig(ns, name);
      break;
    default:
      throw new Error('Invalid kind: ' + kind);
  }
  return app.then(populateRoute).then(populateCpuMetrics).then(populateMemMetrics);
}

export async function deleteApplication(kind: string, ns: string, name: string): Promise<boolean> {
  switch (kind) {
    case 'Deployment':
      return deleteDeployment(ns, name);
    case 'DeploymentConfig':
      return deleteDeploymentConfig(ns, name);
    default:
      throw new Error('Invalid kind: ' + kind);
  }
}

export async function deleteApplicationPods(ns: string, name: string) {
  fetchApplicationPods(ns, name).then((pods: V1Pod[]) => {
    pods.forEach((pod) => {
      consoleFetchJSON.delete('/api/kubernetes/api/v1/namespaces/' + ns + '/pods/' + pod.metadata.name);
    });
  })
}

const QuarkusService = {
  fetchDeployments,
  fetchDeploymentConfigs,
  fetchApplications,
  fetchApplicationPods,
  fetchApplicationsWithMetrics,
  fetchPodsLogs,
  populateCpuMetrics,
  populateMemMetrics,
  populateGCOverheadMetrics,
  populateGCPauseMetrics,
  populateRoute,
  fetchSecret,
  fetchConfigMap,
  fetchPvc,
  fetchJob,
  fetchJobs,
  deleteDeployment,
  deleteDeploymentConfig,
  deleteApplication,
  deleteApplicationPods,
  populateAdddionalInfo
}
export default QuarkusService;
