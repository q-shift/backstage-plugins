import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import { V1Container, V1Pod } from '@kubernetes/client-node';
import Status from './ui/Status';
import { usePods } from '../services/useK8sObjectsResponse';
import { ApplicationPageProps } from '../types';

const ApplicationInitContainerHealthCard: React.FC<ApplicationPageProps> = ({ application }) => {

  const allPods = usePods();
  const [pods, setPods] = useState<V1Pod[]>([]);

  useEffect(() => {
    if (application && application.metadata) {
      setPods(allPods.filter((pod: V1Pod) => pod.metadata?.labels?.['app.kubernetes.io/name'] === application.metadata?.name));
    }
  }, [application]);

  const trimImage = (image: string | undefined) => {
    if (!image) {
      return image;
    }
    if (image.includes('@sha256')) {
      const parts = image.split('@sha256:');
      return parts[0] + '@sha256:' + parts[1].substring(0, 7);
    }
    return image;
  };

  const initContainerStatus = (pods: V1Pod[], initContainerName: string) => {
    const states = pods.flatMap(p => p.status?.initContainerStatuses?.filter(s => s.name === initContainerName).map(s => s.state));
    if (states.some(s => s?.running)) {
      return 'Pending';
    }
    if (states.every(s => s?.terminated?.reason === 'Completed')) {
      return 'Succeeded';
    }
    if (states.some(s => s?.terminated?.reason === 'Failed')) {
      return 'Failed';
    }
    return 'Unknown';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Init Containers
        </Typography>
        <List>
          {application && application.spec && application.spec.initContainers && application.spec.initContainers.map((container: V1Container, index: number) => (
            <ListItem key={index}>
              <Typography variant="h6">{container.name}</Typography>
              <div>
                <Typography><strong>Name:</strong> {container.name}</Typography>
                <Typography><strong>Image:</strong> {trimImage(container.image)}</Typography>
                <Typography><strong>Command:</strong> {container.command}</Typography>
                <Typography><strong>Args:</strong> {container.args}</Typography>
              </div>
              <Typography>
                Status:{' '}
                <Status title={initContainerStatus(pods, container.name)} status={initContainerStatus(pods, container.name)} />
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ApplicationInitContainerHealthCard;
