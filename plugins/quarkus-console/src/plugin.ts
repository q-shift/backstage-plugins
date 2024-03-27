import {createPlugin, createRoutableExtension} from '@backstage/core-plugin-api';
import {rootRouteRef} from './routes';

export const QuarkusConsolePlugin = createPlugin({
    id: 'quarkus-console',
    routes: {
        root: rootRouteRef,
    },
});

export const QuarkusConsolePage = QuarkusConsolePlugin.provide(
    createRoutableExtension({
        name: 'QuarkusPage',
        component: () => import('./components/QuarkusPage').then(m => m.default),
        mountPoint: rootRouteRef,
    }),
);
