import * as React from 'react';
import { ApplicationPageProps } from '../types';
import ApplicationVolumeHealthCard from './ApplicationVolumeHealthCard';
import ApplicationJobHealthCard from './ApplicationJobHealthCard';
import ApplicationInitContainerHealthCard from './ApplicationInitContainerHealthCard';
import ApplicationProbeHealthCard from './ApplicationProbeHealthCard';
import { Card, CardContent, Typography } from '@material-ui/core';

const QuarkusApplicationHealthCard: React.FC<ApplicationPageProps> = ({ application }) => {


  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Configuration</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* First Row */}
          <div style={{ display: 'flex', flexDirection: 'row', flex: '1', height: '50%' }}>
            <div style={{ flex: '1', padding: '8px' }}>
              <ApplicationProbeHealthCard application={application} />
            </div>
            <div style={{ flex: '1', padding: '8px' }}>
              <ApplicationVolumeHealthCard application={application} />
            </div>
          </div>
          {/* Second Row */}
          <div style={{ display: 'flex', flexDirection: 'row', flex: '1', height: '50%' }}>
            <div style={{ flex: '1', padding: '8px', height: '100%' }}>
              <ApplicationInitContainerHealthCard application={application} />
            </div>
            <div style={{ flex: '1', padding: '8px' }}>
              <ApplicationJobHealthCard application={application} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuarkusApplicationHealthCard;
