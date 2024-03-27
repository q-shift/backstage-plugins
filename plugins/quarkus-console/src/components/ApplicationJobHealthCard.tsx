import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import { useJobs } from '../services/useK8sObjectsResponse';

import {
  V1Job,
} from '@kubernetes/client-node';
import Status from './ui/Status';
import { ApplicationPageProps } from '../types';

const ApplicationJobHealthCard: React.FC<ApplicationPageProps> = ({ application }) => {

  const allJobs = useJobs();
  const [jobs, setJobs] = useState<V1Job[]>([]);

  useEffect(() => {
    const newJobs: V1Job[] = [];
    const name = application?.metadata?.name;
    if (name) {
      allJobs.filter((job: V1Job) => 
        job.metadata?.name?.startsWith(name) && job.metadata?.name.endsWith('-init'))
        .forEach((job: V1Job) => {
        newJobs.push(job);
      })
        setJobs(newJobs);
    }
  }, [application]);

  const trimImage = (image: string|undefined) => {
    if (!image) {
      return image;
    }

    if (image.includes('@sha256')) {
      const parts = image.split('@sha256:');
      return parts[0] + '@sha256:' + parts[1].substring(0, 7);
    }
    return image;
  };

  const jobStatus = (job: V1Job) => {
    if (job.status?.succeeded) {
      return 'Succeeded';
    }
    if (job.status?.failed) {
      return 'Failed';
    }
    if (job.status?.active) {
      return 'Running';
    }
    return 'Unknown';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Jobs
        </Typography>
        <List>
          {jobs &&
            jobs.map((job, index) => (
              <ListItem key={index}>
                {job.metadata?.name}
                {job.spec?.template?.spec?.containers.map((container, idx) => (
                  <div key={idx}>
                    <Typography>
                      <strong>Name:</strong> {container.name}
                    </Typography>
                    <Typography>
                      <strong>Image:</strong> {trimImage(container.image)}
                    </Typography>
                    <Typography>
                      <strong>Command:</strong> {container.command}
                    </Typography>
                    <Typography>
                      <strong>Args:</strong> {container.args}
                    </Typography>
                  </div>
                ))}
                <Typography>
                  Status:{' '}
                  <Status title={jobStatus(job)} status={jobStatus(job)} />
                </Typography>
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ApplicationJobHealthCard;
