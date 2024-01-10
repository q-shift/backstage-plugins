import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {createScaffolderFieldExtension, FieldExtensionComponent} from '@backstage/plugin-scaffolder-react';
import { QuarkusExtensionList } from './scaffolder/QuarkusExtensionList';
import { QuarkusQuickstartPicker, validateQuarkusQuickstart } from './scaffolder/QuarkusQuickstartPicker';

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
