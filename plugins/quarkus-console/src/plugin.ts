import {createPlugin, createRoutableExtension} from '@backstage/core-plugin-api';
import {rootRouteRef} from './routes';
import {QuarkusComponentPodsTable} from "./components";

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
            import('./components/QuarkusComponentPodsTable').then(m => m.QuarkusComponentPodsTable),
        mountPoint: rootRouteRef,
    }),
);
