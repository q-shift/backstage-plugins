import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

import {
    createQuarkusApp,
    cloneQuarkusQuickstart
} from './scaffolder/actions/quarkus';

export const scaffolderModuleQuarkusActions = createBackendModule({
    moduleId: 'scaffolder-backend-quarkus',
    pluginId: 'scaffolder',
    register(env) {
        env.registerInit({
            deps: {
                scaffolder: scaffolderActionsExtensionPoint,
            },
            async init({ scaffolder }) {
                scaffolder.addActions(createQuarkusApp());
                scaffolder.addActions(cloneQuarkusQuickstart());
            },
        });
    },
});
