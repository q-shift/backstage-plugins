import {createDevApp} from '@backstage/dev-utils';
import {QuarkusApplicationInfo, QuarkusConsolePlugin} from '../src';
import React from 'react';
import {TestApiProvider} from "@backstage/test-utils";
import {EntityProvider} from '@backstage/plugin-catalog-react';
import {KubernetesApi, kubernetesApiRef} from "@backstage/plugin-kubernetes";
import {Entity} from '@backstage/catalog-model';
import {mockKubernetesQuarkusApplicationResponse} from '../src/__fixtures__/data-1';
//import {kubernetesAuthProvidersApiRef} from "@backstage/plugin-kubernetes-react";

const mockEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
        name: 'quarkus-app',
        description: 'quarkus app',
        annotations: {
            'backstage.io/kubernetes-id': 'backstage',
            'janus-idp.io/tekton': 'app',
        },
    },
    spec: {
        lifecycle: 'production',
        type: 'service',
        owner: 'user:guest',
    },
};

class MockKubernetesClient implements KubernetesApi {
    readonly resources;

    constructor(fixtureData: { [resourceType: string]: any[] }) {
        this.resources = Object.entries(fixtureData).flatMap(
            ([type, resources]) => {
                if (type === 'pipelineruns' && resources[0]?.kind === 'PipelineRun') {
                    return {
                        type: 'customresources',
                        resources,
                    };
                } else if (type === 'taskruns' && resources[0]?.kind === 'TaskRun') {
                    return {
                        type: 'customresources',
                        resources,
                    };
                }
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
    .registerPlugin(QuarkusConsolePlugin)
    .addPage({
        title: "Quarkus application info",
        path: "/quarkus",
        element: (
            <TestApiProvider
                apis={[
                    [kubernetesApiRef, new MockKubernetesClient(mockKubernetesQuarkusApplicationResponse)],
                ]}
            >
                <EntityProvider entity={mockEntity}>
                    <QuarkusApplicationInfo />
                </EntityProvider>
            </TestApiProvider>
        )
    })
    .render();