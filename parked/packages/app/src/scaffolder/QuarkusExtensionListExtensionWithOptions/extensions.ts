import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { QuarkusExtensionListExtensionWithOptions, QuarkusExtensionListExtensionWithOptionsSchema } from './QuarkusExtensionListExtensionWithOptions';

export const QuarkusExtensionListFieldWithOptionsExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'QuarkusExtensionListExtensionWithOptions',
    component: QuarkusExtensionListExtensionWithOptions,
    schema: QuarkusExtensionListExtensionWithOptionsSchema,
  }),
);
