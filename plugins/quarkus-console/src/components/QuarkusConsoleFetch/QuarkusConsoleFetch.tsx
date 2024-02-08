import React from 'react';
import { Table, TableColumn, Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { Apps } from './data';
import { App } from "./type";

type DenseTableProps = {
  apps: App[];
};

export const DenseTable = ({ apps }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Kind', field: 'kind' },
    { title: 'Namespace', field: 'namespace' },
    { title: 'Status', field: 'status' },
    { title: 'CPU', field: 'cpu' },
    { title: 'Memory', field: 'memory' },
    { title: 'Created', field: 'created' },
  ];

  const data = apps.map(app => {
    return {
      name: app.Name,
      kind: app.Kind,
      namespace: app.Namespace,
      status: app.Status,
      cpu: app.CPU,
      memory: app.Memory,
      created: app.Created,
    };
  });

  return (
    <Table
      title="Quarkus Applications"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const QuarkusConsoleFetch = () => {

  const { value, loading, error } = useAsync(async (): Promise<App[]> => {
    // Would use fetch in a real world example
    return Apps;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable apps={value || []} />;
};