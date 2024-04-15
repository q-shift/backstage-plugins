## Quarkus Console

Before to use the quarkus console, it is needed to install and configure the kubernetes plugin as [documented](https://backstage.io/docs/features/kubernetes/installation).

Import first the following package within an existing backstage application:
```bash
yarn add --cwd packages/app "@qshift/plugin-quarkus-console"
```
Next, customize the `packages/app/src/components/catalog/EntityPage.tsx` to include a new `<EntityLayout.Route...>`:
```typescript jsx
import {
    QuarkusPage,
} from "@qshift/plugin-quarkus-console";
...
const serviceEntityPage = (
  <EntityLayout>
  ...
    <EntityLayout.Route path="/quarkus" title="Quarkus">
      <QuarkusPage />
    </EntityLayout.Route>
```
Start backstage, register a quarkus component including the following annotations

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-quarkus-app
  description: A cool quarkus app
  annotations:
    app.kubernetes.io/name: quarkus
    app.quarkus.io/quarkus-version: "3.9"
```

and open the Quarkus view using the software catalog.