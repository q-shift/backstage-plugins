import React from 'react';

import CheckCircle from '@material-ui/icons/CheckCircle';
import AccessTime from '@material-ui/icons/AccessTime';
import HighlightOff from '@material-ui/icons/HighlightOff';

interface StatusProps {
  title?: string;
  status?: string;
}

const Status: React.FC<StatusProps> = ({ title, status }) => {
  const renderIcon = () => {
    switch (status) {
      case 'Succeeded':
        return <CheckCircle style={{ color: 'green' }} />;
      case 'Failed':
        return <HighlightOff style={{ color: 'red' }} />;
      case 'Pending':
        return <AccessTime style={{ color: 'gray' }} />;
      default:
        return null;
    }
  };

  return (
    <>
      {title}
      {renderIcon()}
    </>
  );
};

export default Status;
