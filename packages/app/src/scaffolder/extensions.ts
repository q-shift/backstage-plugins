import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { QuarkusExtensionList, quarkusExtensionValidation as validateQuarkusExtension } from './QuarkusExtensionList/QuarkusExtensionListExtension';

export const QuarkusExtensionListFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'QuarkusExtensionList',
    component: QuarkusExtensionList,
  }),
);
