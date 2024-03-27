import React, { useEffect, useState } from 'react';
import {Application, ApplicationPageProps, Version } from "../types";
import { Box, Card, CardContent, CardHeader, CircularProgress, Typography } from '@material-ui/core';
import Status from './ui/Status';

export const QuarkusApplicationDetailsCard: React.FC<ApplicationPageProps> = ({ application }) => {

  const [name, setName] = useState<string>();
  const [namespace, setNamespace] = useState<string>();
  const [kind, setKind] = useState<string>();
  const [version, setVersion] = useState<string|null>();
  const [buildTimestamp, setBuildTimestamp] = useState<string|null>();
  const [vcsUri, setVcsUri] = useState<string|null>();
  const [location, setLocation] = useState<string>();
  const [healthEndpoint, setHealthEndpoint] = useState<string>();
  const [healthEndpointStatus, setHealthEndpointStatus] = useState<string>('Pending');
  const [metricsEndpoint, setMetricsEndpoint] = useState<string>();
  const [metricsEndpointStatus, setMetricsEndpointStatus] = useState<string>('Pending');
  const [infoEndpoint, setInfoEndpoint] = useState<string>();
  const [infoEndpointStatus, setInfoEndpointStatus] = useState<string>('Pending');
  const [produiEndpoint, setProduiEndpoint] = useState<string>();
  const [produiEndpointStatus, setProduiEndpointStatus] = useState<string>('Pending');
  const [framework, setFramework] = useState<string>();
  const [frameworkUrl, setFrameworkUrl] = useState<string>();
  const [frameworkVersion, setFrameworkVersion] = useState<Version|null>();
  const [releaseNotesUrl, setReleaseNotesUrl] = useState<string>();

  useEffect(() => {
    if (application && application.metadata) {
      const quarkusVersion = getQuarkusVersion(application);
      setKind(application.kind);
      setName(application.metadata.name);
      setNamespace(application.metadata.namespace);
      setVersion(getApplicationVersion(application));
      setBuildTimestamp(getBuildTimestamp(application));
      setVcsUri(getVcsUri(application));
      setLocation(application.url);
      setHealthEndpoint(getHealthCheckEndpoint(application));
      setHealthEndpointStatus(getHealthStatus(application));
      setMetricsEndpoint("/q/metrics");
      checkMetricsEndpointStatus(application);
      setInfoEndpoint("/q/info");
      checkInfoEndpointStatus(application);
      setProduiEndpoint("/q/dev");
      checkProduiEndpointStatus(application);
      setFramework("quarkus");
      setFrameworkVersion(quarkusVersion);
    }
  }, [application]);

  useEffect(() => {
    switch (framework) {
      case "quarkus":
        setFrameworkUrl("https://quarkus.io/");
        break;
      default:
      setFrameworkUrl("");
      break;
    } 
  }, [framework])

  useEffect(() => {
    if (frameworkVersion && frameworkVersion.version) {
      const releaseUrl = `https://github.com/quarkusio/quarkus/releases/tag/${frameworkVersion.version}`; 
      if (!frameworkVersion.version.endsWith('-SNAPSHOT')) {
        setReleaseNotesUrl(releaseUrl); 
      }
    }
  }, [frameworkVersion]);


  function getHealthCheckEndpoint(application: Application): string {
    if (application && application.spec && application.spec.containers) {
      for (const container of application.spec.containers) {
        if (container.readinessProbe?.httpGet?.path) {
          return container.readinessProbe.httpGet.path;
        }
      }
    }
    return '';
  }

  function getVcsUri(application: Application): string | null {
    if (application && application.metadata && application.metadata.annotations) {
      return application.metadata.annotations["app.openshift.io/vcs-uri"];
    }
    return null;
  }

  function convertGitUrlToHttp(gitUrl: string): string {
    if (!gitUrl) {

    }
    // Regular expressions to match SSH and other non-HTTP Git URLs for GitHub and GitLab
    const githubSshRegex = /^(git@github\.com:)([^#]+)/;
    const gitlabSshRegex = /^(git@gitlab\.com:)([^#]+)/;

    // Check if the URL is a GitHub SSH URL
    if (githubSshRegex.test(gitUrl)) {
      return gitUrl.replace(githubSshRegex, 'https://github.com/$2');
    }

    // Check if the URL is a GitLab SSH URL
    if (gitlabSshRegex.test(gitUrl)) {
      return gitUrl.replace(gitlabSshRegex, 'https://gitlab.com/$2');
    }

    // If it's already an HTTP URL or another form, return as is
    return gitUrl;
  }

  function getBuildTimestamp(application: Application): string | null {
    if (application && application.metadata && application.metadata.annotations) {
      return application.metadata.annotations["app.quarkus.io/build-timestamp"];
    }
    return null;
  }

  function getApplicationVersion(application: Application): string | null {
    if (application && application.metadata && application.metadata.annotations) {
      return application.metadata.annotations["app.kubernetes.io/version"];
    }
    return null;
  }

  function getQuarkusVersion(application: Application): Version | null {
    if (application && application.metadata && application.metadata.annotations) {
      return Version.parseVersion(application.metadata.annotations["app.quarkus.io/quarkus-version"]);
    }
    return null;
  }

  function getHealthStatus(application: Application): string {
    return application.status && application.status.replicas === application.status.availableReplicas ? "Succeeded" : "Failed";
  }


  function checkMetricsEndpointStatus(application: Application) {
    if (application) {
      setMetricsEndpointStatus("Succeeded");
    } else {
      setMetricsEndpointStatus("Failed");
    }
  }

  function checkInfoEndpointStatus(application: Application) {
    if (application) {
      setInfoEndpointStatus("Succeeded");
    } else {
      setInfoEndpointStatus("Failed");
    }
  }

  function checkProduiEndpointStatus(application: Application) {
    if (application) {
      setProduiEndpointStatus("Succeeded");
    } else {
      setProduiEndpointStatus("Failed");
    }
  }

  return (
    <Card>
      <CardHeader title="Application" />
      <CardContent>
        {application ? (
          <Box>
            <Card>
              <CardHeader title="Details" />
              <CardContent>
                <Typography variant="body1"><strong>Kind:</strong> {kind}</Typography>
                <Typography variant="body1"><strong>Name:</strong> {name}</Typography>
                <Typography variant="body1"><strong>Namespace:</strong> {namespace}</Typography>
                <Typography variant="body1"><strong>Version:</strong> {version}</Typography>
                <Typography variant="body1"><strong>Build Timestamp:</strong> {buildTimestamp}</Typography>
                {vcsUri && (
                  <Typography variant="body1">
                    <strong>Version Control:</strong>
                    <a href={convertGitUrlToHttp(vcsUri)} target="_blank" rel="noopener noreferrer">
                      {vcsUri}
                    </a>
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Location:</strong>
                  <a href={location} target="_blank" rel="noopener noreferrer">
                    {location}
                  </a>
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Endpoints" />
              <CardContent>
                <Typography variant="body1"><strong>Health Endpoint:</strong> <Status title={healthEndpoint} status={healthEndpointStatus} /></Typography>
                <Typography variant="body1"><strong>Metrics Endpoint:</strong> <Status title={metricsEndpoint} status={metricsEndpointStatus} /></Typography>
                <Typography variant="body1"><strong>Info Endpoint:</strong> <Status title={infoEndpoint} status={infoEndpointStatus} /></Typography>
                <Typography variant="body1"><strong>Prod UI Endpoint:</strong> <Status title={produiEndpoint} status={produiEndpointStatus} /></Typography>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Framework" />
              <CardContent>
                <Typography variant="body1">
                  <strong>Framework:</strong>
                  {frameworkUrl ? (
                    <a href={frameworkUrl} target="_blank" rel="noopener noreferrer">
                      {framework}
                    </a>
                  ) : (
                      framework
                    )}
                </Typography>
                {frameworkVersion && (
                  <>
                    <Typography variant="body1">
                      <strong>Version:</strong>
                      {releaseNotesUrl ? (
                        <a href={releaseNotesUrl} target="_blank" rel="noopener noreferrer">
                          {frameworkVersion.version}
                        </a>
                      ) : (
                          frameworkVersion.version
                        )}
                    </Typography>
                    <Typography variant="body1"><strong>Major Version:</strong> {frameworkVersion.major}</Typography>
                    <Typography variant="body1"><strong>Minor Version:</strong> {frameworkVersion.minor}</Typography>
                    <Typography variant="body1"><strong>Patch Version:</strong> {frameworkVersion.patch}</Typography>
                    </>
                )}
              </CardContent>
            </Card>
          </Box>
        ) : (
            <CircularProgress />
          )}
      </CardContent>
    </Card>
  );
};

export default QuarkusApplicationDetailsCard;
