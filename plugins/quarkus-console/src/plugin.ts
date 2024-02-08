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
        name: 'QuarkusConsolePage',
        component: () =>
            import('./components/QuarkusConsoleFetch').then(m => m.QuarkusConsoleFetch),
        mountPoint: rootRouteRef,
    }),
);
