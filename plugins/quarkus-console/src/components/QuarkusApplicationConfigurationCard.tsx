import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Tooltip,
} from '@mui/material';
import { ApplicationPageProps } from '../types';
import { extractEnvironmentVariables, extractMountedConfigMaps, extractMountedSecrets } from '../utils';

export const QuarkusApplicationConfigurationCard: React.FC<ApplicationPageProps> = ({ application }) => {

  type Description = {
    [key: string]: string
  };

  const [envVars, setEnvVars] = useState<{ [key: string]: string }>({});
  const [secrets, setSecrets] = useState<string[]>([]);
  const [configMaps, setConfigMaps] = useState<string[]>([]);

  const [descriptions, setDescriptions] = useState<Description>({});

  useEffect(() => {
    Object.entries(envVars).forEach(([key, _]) => {
      fetchQuarkusConfigInfo(envVarToProperty(key)).then((description) => {
        setDescriptions(prevDescriptions => ({
          ...prevDescriptions,
          [key]: description
        }));       
      });
    });
  }, [envVars]);

  useEffect(() => {
    if (application && application.spec) {
      setEnvVars(extractEnvironmentVariables(application));
      setSecrets(extractMountedSecrets(application));
      setConfigMaps(extractMountedConfigMaps(application));
    }
  }, [application]);


  function descriptionSafe(key: string): string {
    return descriptions && descriptions[key] ? descriptions[key] : key;
  }

  function envVarToProperty(envVar: string): string {
    return envVar.toLowerCase().replace(/_/g, '.');
  }

  /*
  function propertyToEnvVar(property: string): string {
    return property.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  }
  */


  async function fetchQuarkusConfigInfo(propertyName: string): Promise<string> {
    // Split the property to find the last segment which is usually the actual property name
   // const envVarName = propertyToEnvVar(propertyName);

    // Fetch the Quarkus configuration guide page
    const response = await fetch('https://quarkus.io/guides/all-config');
    const html = await response.text();

    // Use DOMParser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find the table element - adjust the selector as needed
    const tables = doc.querySelectorAll('table');

    let info = "";

    // Iterate through all tables (if there are multiple tables for config properties)
    tables.forEach((table) => {
      // Iterate through each row in the table
      table.querySelectorAll('tbody tr').forEach((row) => {
        // Get the first cell (config key) and second cell (description)
        const keyCell = row.querySelector('td:first-child');
        const descriptionCell = row.querySelector('td:nth-child(1)');
        const typeCell = row.querySelector('td:nth-child(2)');
        const defaultCell = row.querySelector('td:nth-child(3)');

        if (keyCell && descriptionCell && keyCell.textContent?.includes(propertyName)) {
          // If the config key matches the property name, get the description
          info = descriptionCell.textContent?.split('\n')
              .filter((line) => !line.startsWith(propertyName))
              .filter((line) => !line.startsWith('Environment Variable'))
              .filter((line) => !line.startsWith('Show more'))
              .join('\n') + ' \n'
              'Defaults to (' + typeCell?.textContent?.trim() + '): ' + defaultCell?.textContent?.trim();
               
        }
      });
    });
    return info;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Configuration</Typography>
        {application &&
          <>
            <Typography component="p">Name: {application.metadata?.name}</Typography>
            <Typography component="p">Environment Variables:</Typography>
            <ul>
              {Object.entries(envVars).map(([key, value]) => (
                <li key={key}>
                  <Tooltip title={descriptionSafe(key)}>
                    <Typography component="p"><strong>{key}:</strong>{value}</Typography>
                  </Tooltip>
                </li>
              ))}
            </ul>
            <Typography component="p">Secrets:</Typography>
            <ul>
              {secrets.map((secret) => (
                <li key={secret}>
                  {secret}
                </li>
              ))}
            </ul>
            <Typography component="p">Config Maps:</Typography>
            <ul>
              {configMaps.map((configMap) => (
                <li key={configMap}>
                    configMap
                </li>
              ))}
            </ul>
          </>
        }
      </CardContent>
    </Card>
  );
};

export default QuarkusApplicationConfigurationCard;
