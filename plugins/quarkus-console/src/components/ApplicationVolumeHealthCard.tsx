import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { fetchConfigMap, fetchPvc, fetchSecret } from '../services/QuarkusService';
import Status from './ui/Status';
import { Application } from '../types';
import { V1Volume, V1Secret, V1ConfigMap, V1PersistentVolumeClaim } from '@kubernetes/client-node';
import { useConfigMap, usePersistentVolumeClaim, useSecret } from '../services/useK8sObjectsResponse';

const ApplicationVolumeHealthCard: React.FC<{ application: Application }> = ({ application }) => {

  const [volumes, setVolumes] = useState(application?.spec?.volumes ?? []);
  const [volumeStatus, setVolumeStatus] = useState({});

  useEffect(() => {
    setVolumes(application?.spec?.volumes ?? []);
  }, [application]);

  useEffect(() => {
    if (application && application.metadata) {
      volumes.forEach((volume: V1Volume) => {
        const kind = volumeKind(volume);
        switch (kind) {
          case 'ConfigMap':
            const configMap = useConfigMap(application.metadata?.namespace, volume.name);
             updateVolumeStatus(volume.name, configMap ?  "Succeeded" : "Pending");
            break;
          case 'Secret':
            const secret = useSecret(application.metadata?.namespace, volume.name);
            updateVolumeStatus(volume.name, secret ?  "Succeeded" : "Pending");
            break;
          case 'PersistentVolumeClaim':
            const pvc = usePersistentVolumeClaim(application.metadata?.namespace, volume.name);
              updateVolumeStatus(volume.name, pvc ?  "Succeeded" : "Pending");
            break;
          default:
            console.log('Unknown volume kind: ' + kind);
        }
      });
    }
  }, [volumes, application.metadata?.namespace]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Volumes</Typography>
        <List>
          {application && application.spec && application.spec.volumes && application.spec.volumes.map(volume => (
            <ListItem key={volume.name}>  
              {volume.name}
              <ListItemText primary={`Kind: ${volumeKind(volume)}`} />
              <ul>
                {application.spec.containers.filter((container) => container.volumeMounts.filter((volumeMount) => volumeMount.name === volume.name).length > 0).map((container) => (
                  <li key={container.name}>
                    Container: {container.name}
                    {container.volumeMounts.filter((volumeMount) => volumeMount.name === volume.name).map((volumeMount) => (
                      <ListItemText key={volumeMount.mountPath} primary={`Path: ${volumeMount.mountPath}`} />
                    ))}
                  </li>
                ))}
              </ul>
              <ListItemText primary={`Status:`} secondary={volumeStatus[volume.name] ?? "Pending"} />
              <Status
                title={volumeStatus[volume.name] ?? "Pending"}
                status={volumeStatus[volume.name] ?? "Pending"} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};


const updateVolumeStatus = (name, status) => {
  setVolumeStatus(prevStatus => ({
    ...prevStatus,
    [name]: status,
  }));
}; 

const volumeKind = (volume) => {
  if (volume.configMap) {
    return 'ConfigMap';
  }
  if (volume.secret) {
    return 'Secret';
  }
  if (volume.emptyDir) {
    return 'EmptyDir';
  }
  if (volume.persistentVolumeClaim) {
    return 'PersistentVolumeClaim';
  }
  if (volume.hostPath) {
    return 'HostPath';
  }
  if (volume.awsElasticBlockStore) {
    return 'AWS Elastic Block Store';
  }
  if (volume.azureDisk) {
    return 'Azure Disk';
  }
  if (volume.azureFile) {
    return 'Azure File';
  }
  if (volume.cinder) {
    return 'Cinder';
  }
  if (volume.downwardAPI) {
    return 'Downward API';
  }
  if (volume.fc) {
    return 'FC';
  }
  if (volume.flexVolume) {
    return 'Flex Volume';
  }
  return 'Unknown';
};

export default ApplicationVolumeHealthCard;
