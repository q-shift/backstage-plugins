import {useK8sObjectsResponse} from '../services/useK8sObjectsResponse';
import {K8sResourcesContext} from '../services/K8sResourcesContext';
import {ModelsPlural} from "../models";
import {
    V1Pod,
} from '@kubernetes/client-node';
import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    PodsTable,
} from '@backstage/plugin-kubernetes-react';
import {K8sWorkloadResource} from "../types/types";

export type PodColumns = 'READY' | 'RESOURCE';
export const READY_COLUMNS: PodColumns = 'READY';
export const RESOURCE_COLUMNS: PodColumns = 'RESOURCE';

export const QuarkusComponentPodsTable = () => {
    const watchedResources = [
        ModelsPlural.pods,
    ];
    const k8sResourcesContextData = useK8sObjectsResponse(watchedResources);

    return (
        <K8sResourcesContext.Provider value={k8sResourcesContextData}>
            <Pods/>
        </K8sResourcesContext.Provider>
    );
};

const Pods = () => {
    const { watchResourcesData } = React.useContext(K8sResourcesContext);
    const k8sResources: K8sWorkloadResource[] | undefined = watchResourcesData?.pods?.data;
    const pods: V1Pod[] = k8sResources ? k8sResources as V1Pod[]: [];
    console.log("Pods :",pods);

    return (
        <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            </AccordionSummary>
            <AccordionDetails>
                <PodsTable
                    pods={pods}
                    extraColumns={[READY_COLUMNS, RESOURCE_COLUMNS]}
                />
            </AccordionDetails>
        </Accordion>
    );
};