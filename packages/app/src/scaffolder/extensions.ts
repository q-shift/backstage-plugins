import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { QuarkusExtensionList, validateQuarkusExtension } from './QuarkusExtensionList/QuarkusExtensionListExtension';
import { QuarkusQuickstartPicker, validateQuarkusQuickstart } from './QuarkusQuickstarPicker/QuarkusQuickstartPickerExtension';

export const QuarkusExtensionListFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'QuarkusExtensionList',
    component: QuarkusExtensionList,
    validation: validateQuarkusExtension,
  }),
);

export const QuarkusQuickstartPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'QuarkusQuickstartPicker',
    component: QuarkusQuickstartPicker,
    validation: validateQuarkusQuickstart,
  }),
);
