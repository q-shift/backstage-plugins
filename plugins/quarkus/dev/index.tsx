import { catalogPlugin } from '@backstage/plugin-catalog';
import { createDevApp } from '@backstage/dev-utils';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import React from 'react';
import { ScaffolderClient, ScaffolderPage } from '@backstage/plugin-scaffolder';
import { scaffolderApiRef, ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import {
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { CatalogEntityPage } from '@backstage/plugin-catalog';
import {QuarkusExtensionListField, QuarkusVersionListField} from "../src";

createDevApp()
  .registerPlugin(catalogPlugin)
  .registerApi({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApi: fetchApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
      identityApi: identityApiRef,
    },

    factory: ({ discoveryApi, fetchApi, scmIntegrationsApi, identityApi }) =>
      new ScaffolderClient({
        discoveryApi,
        fetchApi,
        // @ts-ignore
        scmIntegrationsApi,
        identityApi,
      }),
  })
  .addPage({
    path: '/create',
    title: 'Create',
    element: <ScaffolderPage />,
    children: (
        <ScaffolderFieldExtensions>
            <QuarkusExtensionListField />
            <QuarkusVersionListField />
        </ScaffolderFieldExtensions>
    )
  })
  .addPage({
    element: <CatalogEntityPage />,
  })
  .render();
