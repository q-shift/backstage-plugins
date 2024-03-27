import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ApplicationPageProps } from '../types';
import Status from './ui/Status';

const ApplicationProbeHealthCard: React.FC<ApplicationPageProps> = ({ application }) => {

  const [probes, setProbes] = useState<ProbeInfo>({
    readinessProbe: null,
    livenessProbe: null,
    startupProbe: null,
  });

  useEffect(() => {
    if (application && application.spec && application.spec.containers && application.spec.containers.length > 0) {
      const container = application.spec.containers[0]; // Assuming the first container
      setProbes({
        readinessProbe: container.readinessProbe ? container.readinessProbe.httpGet?.path || null : null,
        livenessProbe: container.livenessProbe ? container.livenessProbe.httpGet?.path || null : null,
        startupProbe: container.startupProbe ? container.startupProbe.httpGet?.path || null : null,
      });
    }
  }, [application]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Probes
        </Typography>
        <Typography component="div">
          <p><strong>Startup Probe:</strong> <Status title={probes.startupProbe || 'N/A'} status={probes.startupProbe && application.status?.availableReplicas === application.status?.replicas ? "Succeeded" : "Failed"}/></p>
          <p><strong>Readiness Probe:</strong> <Status title={probes.readinessProbe || 'N/A'} status={probes.readinessProbe && application.status?.availableReplicas === application.status?.replicas ? "Succeeded" : "Failed"}/></p>
          <p><strong>Liveness Probe:</strong> <Status title={probes.livenessProbe || 'N/A'} status={probes.livenessProbe && application.status?.availableReplicas === application.status?.replicas ? "Succeeded" : "Failed"}/></p>
        </Typography>
      </CardContent>
    </Card>
  );
};

type ProbeInfo = {
  readinessProbe: string | null;
  livenessProbe: string | null;
  startupProbe: string | null;
};

export default ApplicationProbeHealthCard;
