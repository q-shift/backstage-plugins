import { BackendDynamicPluginInstaller } from '@backstage/backend-dynamic-feature-service';
import {
    createQuarkusApp,
    cloneQuarkusQuickstart
} from '../scaffolder/actions/quarkus';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
    kind: 'legacy',
    scaffolder: () => [createQuarkusApp(), cloneQuarkusQuickstart()],
};
