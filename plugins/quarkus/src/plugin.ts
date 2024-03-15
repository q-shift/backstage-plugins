import {scaffolderPlugin} from '@backstage/plugin-scaffolder';
import {createScaffolderFieldExtension, FieldExtensionComponent} from '@backstage/plugin-scaffolder-react';
import {QuarkusVersionList} from './scaffolder/QuarkusVersionList';
import {QuarkusExtensionList} from './scaffolder/QuarkusExtensionList';
import {QuarkusQuickstartPicker, validateQuarkusQuickstart} from './scaffolder/QuarkusQuickstartPicker';

export const QuarkusExtensionListField: FieldExtensionComponent<string, string> = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
        name: 'QuarkusExtensionList',
        component: QuarkusExtensionList,
    }),
), QuarkusVersionListField: FieldExtensionComponent<string, string> = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
        name: 'QuarkusVersionList',
        component: QuarkusVersionList,
    }),
), QuarkusQuickstartPickerField: FieldExtensionComponent<string, string> = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
        name: 'QuarkusQuickstartPicker',
        component: QuarkusQuickstartPicker,
        validation: validateQuarkusQuickstart,
    }),
);
