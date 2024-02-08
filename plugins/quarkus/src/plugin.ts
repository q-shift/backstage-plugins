import {scaffolderPlugin} from '@backstage/plugin-scaffolder';
import {createScaffolderFieldExtension, FieldExtensionComponent} from '@backstage/plugin-scaffolder-react';
import {QuarkusExtensionList} from './scaffolder/QuarkusExtensionList';
import {QuarkusQuickstartPicker, validateQuarkusQuickstart} from './scaffolder/QuarkusQuickstartPicker';
import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import {rootRouteRef} from './routes';

export const QuarkusExtensionListField: FieldExtensionComponent<string, string> = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
        name: 'QuarkusExtensionList',
        component: QuarkusExtensionList,
    }),
), QuarkusQuickstartPickerField: FieldExtensionComponent<string, string> = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
        name: 'QuarkusQuickstartPicker',
        component: QuarkusQuickstartPicker,
        validation: validateQuarkusQuickstart,
    }),
);

export const QuarkusConsolePlugin = createPlugin({
    id: 'quarkus-console',
    routes: {
        root: rootRouteRef,
    },
});

export const QuarkusConsolePage = QuarkusConsolePlugin.provide(
    createRoutableExtension({
        name: 'QuarkusConsolePage',
        component: () =>
            import('./components/QuarkusConsoleFetch').then(m => m.QuarkusConsoleFetch),
        mountPoint: rootRouteRef,
    }),
);
