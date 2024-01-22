## Quarkus Frontend

This plugin proposes different features to:

- Filter, select your Quarkus extensions using the `Quarkus Extension List` field.
- Select using the `Quarkus QuickStart Picker` one of the quickstarts available: https://github.com/quarkusio/quarkus-quickstarts

**NOTE**: Such frontend feature(s) should be used with the quarkus scaffolder backend plugin (described hereafter) in order to get the generated project from https://code.quarkus.io/ as zip file !

### Frontend plugin

To use the frontend components, import the needed package under the following path within an existing backstage application:
```
cd packages/app
yarn add "@qshift/plugin-quarkus"
```

Next, customize the `packages/app/src/App.tsx` file according to the field that you plan to use

#### Quarkus extensions field

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusExtensionListField />`
within the tag `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusExtensionListField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusExtensionListField />
      </ScaffolderFieldExtensions>
...
```

Update the existing `examples/template/template.yaml` file locally to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-wizzard
  title: Create a Quarkus Application Wizzard
  description: Create a Quarkus App using a wizzard
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Customize the Quarkus application features
    properties:
      extensions:
        title: Quarkus Extensions
        type: array
        description: The list of the quarkus extensions
        ui:field: QuarkusExtensionList
  steps:
  ...
```

**NOTE**: A real example is available [here](./examples/templates/quarkus-extensions/template.yaml)

When done, you will be able to select your extension(s) when you scaffold a new project.

Quarkus Extension List - default (field):
![extensions-1.png](plugins%2Fquarkus%2Fdoc%2Fextensions-1.png)

Quarkus Extension List - Select (field):
![extensions-2.png](plugins%2Fquarkus%2Fdoc%2Fextensions-2.png)

Quarkus Extension List - Added (field):
![extensions-3.png](plugins%2Fquarkus%2Fdoc%2Fextensions-3.png)

#### Quarkus Quickstart picker field

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusQuickstartPickerField />`
within the `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusQuickstartPickerField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusQuickstartPickerField />
      </ScaffolderFieldExtensions>
...
```

Update the existing `examples/template/template.yaml` file locally to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-wizzard
  title: Create a Quarkus Application Wizzard
  description: Create a Quarkus App using a wizzard
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Select the Quarkus Quickstart
    properties:
      quickstartName:
        title: Quickstart Name
        type: string
        description: The name of the quickstart to clone
        default: 'hibernate-orm-panache'
        ui:field: QuarkusQuickstartPicker
  steps:
  ...
```

**NOTE**: A real example is available [here](./examples/templates/quarkus-quickstart-picker/template.yaml)

When done, you will be able to create a new Quarkus project from the quickstart selected.

Quarkus Quickstart Picker - default (field):
![quickstart-1.png](plugins/quarkus/doc/quickstart-1.png)

Quarkus Quickstart Picker - select (field):
![quickstart-2.png](plugins/quarkus/doc/quickstart-2.png)

