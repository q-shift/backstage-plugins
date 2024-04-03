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
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', /* This will create two columns with the same width */
          gridTemplateRows: '1fr 1fr', /* This will create two rows with the same height */
          height: '85vh', /* This will make the grid take the full height of the viewport */
          width: '100%', /* This will make the grid take the full width of its parent element */
          padding: '8px' 
        }}>
          <div style={{ padding: '8px' }}>
            <ApplicationProbeHealthCard application={application} />
          </div>
          <div style={{ padding: '8px' }}>
            <ApplicationVolumeHealthCard application={application} />
          </div>
          <div style={{ padding: '8px' }}>
            <ApplicationInitContainerHealthCard application={application} />
          </div>
          <div style={{ padding: '8px' }}>
            <ApplicationJobHealthCard application={application} />
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default QuarkusApplicationHealthCard;
