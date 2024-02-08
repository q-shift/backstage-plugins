import {useK8sObjectsResponse} from '../services/useK8sObjectsResponse';
import {K8sResourcesContext} from '../services/K8sResourcesContext';
import {ModelsPlural} from "../models";
import {
    V1Pod,
} from '@kubernetes/client-node';
import React from 'react';
import {
    Content,
    Page,
} from '@backstage/core-components';
import {K8sWorkloadResource} from "../types/types";

export const QuarkusComponent = () => {
    const watchedResources = [
        ModelsPlural.pods,
    ];
    const k8sResourcesContextData = useK8sObjectsResponse(watchedResources);

    return (
        <K8sResourcesContext.Provider value={k8sResourcesContextData}>
            <Pod/>
        </K8sResourcesContext.Provider>
    );
};

const Pod = () => {
    const { watchResourcesData } = React.useContext(K8sResourcesContext);
    const k8sResources: K8sWorkloadResource[] | undefined = watchResourcesData?.pods?.data;
    const pods = k8sResources as V1Pod[];
    /* console.log("Pods :",pods); */

    return (
        <Page themeId="tool">
            <Content>
                <div>
                {pods.length > 0 && pods.map((item, i) => {
                    return (
                        <div key={i}>Pod name: {item.metadata?.name}</div>
                    );
                })}
                </div>
            </Content>
        </Page>
    );
};