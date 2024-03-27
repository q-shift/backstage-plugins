import React, { useEffect } from 'react';

import {  ApplicationPageProps } from '../types';

export const QuarkusApplicationLoggingCard: React.FC<ApplicationPageProps> = ({ application }) => {

    useEffect(() => {
      console.log('QuarkusApplicationLoggingCard: application:', application);
    }, [application]);

    return (
    <>
    </>
    );
};

export default QuarkusApplicationLoggingCard;
