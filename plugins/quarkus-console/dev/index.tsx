import {createDevApp} from '@backstage/dev-utils';
import {QuarkusApplicationInfo} from '../src';
import React from 'react';
import {TestApiProvider} from "@backstage/test-utils";
import {EntityProvider} from '@backstage/plugin-catalog-react';
import {
    EntityKubernetesContent,
    KubernetesApi,
    kubernetesApiRef,
    KubernetesAuthProvidersApi
} from "@backstage/plugin-kubernetes";
import {Entity} from '@backstage/catalog-model';
import {mockKubernetesQuarkusApplicationResponse} from '../src/__fixtures__/data-1';
import {kubernetesAuthProvidersApiRef} from "@backstage/plugin-kubernetes-react";
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';

const mockEntity: Entity = {
    "apiVersion": "backstage.io/v1alpha1",
    "kind": "Component",
    "metadata": {
        "name": "my-quarkus-app",
        "description": "A cool quarkus app",
        "annotations": {
            "argocd/app-name": "my-quarkus-app-bootstrap",
            "backstage.io/kubernetes-id": "my-quarkus-app",
            "backstage.io/source-location": "url:https://github.com/ch007m/my-quarkus-app",
            "janus-idp.io/tekton": "my-quarkus-app",
            "backstage.io/techdocs-ref": "dir:.",
            "github.com/project-slug": "ch007m/",
            "app.kubernetes.io/name": "quarkus"
        },
        "tags": [
            "java",
            "quarkus"
        ],
        "links": [
            {
                "url": "https://my-quarkus-app-cmoullia.apps.qshift.snowdrop.dev/",
                "title": "Quarkus application url",
                "icon": "web"
            }
        ]
    },
    "spec": {
        "type": "service",
        "lifecycle": "production",
        "owner": "user:guest"
    }
};

class MockKubernetesAuthProvidersApi implements KubernetesAuthProvidersApi {
    decorateRequestBodyForAuth(_authProvider: string, _requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody> {

        throw new Error('Method not implemented.');
    }
    getCredentials(_authProvider: string): Promise<{ token?: string | undefined; }> {
        throw new Error('Method not implemented.');
    }

}

class MockKubernetesClient implements KubernetesApi {
    readonly resources;

    constructor(fixtureData: { [resourceType: string]: any[] }) {
        this.resources = Object.entries(fixtureData).flatMap(
            ([type, resources]) => {
                return {
                    type: type.toLocaleLowerCase('en-US'),
                    resources,
                };
            },
        );
    }

    async getWorkloadsByEntity(_request: any): Promise<any> {
        return {
            items: [
                {
                    cluster: { name: 'mock-cluster' },
                    resources: this.resources,
                    podMetrics: [],
                    errors: [],
                },
            ],
        };
    }
    async getCustomObjectsByEntity(_request: any): Promise<any> {
        return {
            items: [
                {
                    cluster: { name: 'mock-cluster' },
                    resources: this.resources,
                    podMetrics: [],
                    errors: [],
                },
            ],
        };
    }

    async getObjectsByEntity(): Promise<any> {
        return {
            items: [
                {
                    cluster: { name: 'mock-cluster' },
                    resources: this.resources,
                    podMetrics: [],
                    errors: [],
                },
            ],
        };
    }

    async getClusters(): Promise<{ name: string; authProvider: string }[]> {
        return [{ name: 'mock-cluster', authProvider: 'serviceAccount' }];
    }

    async getCluster(_clusterName: string): Promise<
        | {
        name: string;
        authProvider: string;
        oidcTokenProvider?: string;
        dashboardUrl?: string;
    }
        | undefined
    > {
        return { name: 'mock-cluster', authProvider: 'serviceAccount' };
    }

    async proxy(_options: { clusterName: String; path: String }): Promise<any> {
        return {
            kind: 'Namespace',
            apiVersion: 'v1',
            metadata: {
                name: 'mock-ns',
            },
        };
    }
}

createDevApp()
    .addPage({
        title: "Quarkus application info",
        path: "/quarkus",
        element: (
            <TestApiProvider
                apis={[
                    [kubernetesApiRef, new MockKubernetesClient(mockKubernetesQuarkusApplicationResponse)],
                    [kubernetesAuthProvidersApiRef, new MockKubernetesAuthProvidersApi()]
                ]}
            >
                <EntityProvider entity={mockEntity}>
                    <QuarkusApplicationInfo />
                </EntityProvider>
            </TestApiProvider>
        )
    })
    .addPage({
        element: (
            <TestApiProvider
                apis={[
                    [kubernetesApiRef, new MockKubernetesClient(mockKubernetesQuarkusApplicationResponse)],
                ]}
            >
                <EntityProvider entity={mockEntity}>
                    <EntityKubernetesContent />
                </EntityProvider>
            </TestApiProvider>
        ),
        title: 'k8s Page',
        path: '/kubernetes',
    })
    .render();