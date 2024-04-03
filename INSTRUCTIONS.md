## Run Quarkus plugins with RHDH

To use the Quarkus plugins with RHDH >=1.x, execute the following commands

- Create new project on the target cluster: `oc new-project rhdh`
- Create a service account and grant it with the `cluster-admin` role to allow the `kubernetes/quarkus/topology` plugins to access the resources on the cluster
```bash
kubectl create sa my-backstage

cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: rhdh-default-cluster-access
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: my-backstage
    namespace: rhdh
EOF

kubectl get secret $(kubectl get secret | grep my-backstage-token | cut -f1 -d " ") -o go-template='{{.data.token | base64decode}}' 
```
- Set the host name of the backstage application on the cluster
```bash
export RHDH_HOST="rhdh.apps.qshift.snowdrop.dev"
```
- Create a backstage `app-config-rhdh.yaml` packaged as configMap :
```bash
cat <<\EOF | kubectl apply -f -
kind: ConfigMap
apiVersion: v1
metadata:
  name: app-config-rhdh
data:
  app-config-rhdh.yaml: >-
    app:
      baseUrl: https://$RHDH_HOST/
    backend:
      auth:
        keys:
        - secret: ${BACKEND_SECRET}
      baseUrl: https://$RHDH_HOST/
      csp:
        connect-src: ['self', 'http:', 'https:']
      cors:
        origin: https://$RHDH_HOST/
        methods: [GET, HEAD, PATCH, POST, PUT, DELETE]
        credentials: true
      database:
        connection:
          password: ${POSTGRESQL_ADMIN_PASSWORD}
          user: postgres
    catalog:
      import:
        entityFilename: catalog-info.yaml
      rules:
        - allow: [Template,Location,Component,System,Resource,User,Group]
      locations:
        - type: url
          target: https://github.com/q-shift/qshift-templates/blob/main/qshift/all.yaml
          rules:
          - allow: [Template,Location,Component,System,Resource,User,Group]  
    argocd:
      baseUrl: https://openshift-gitops-server-openshift-gitops.apps.qshift.snowdrop.dev
      username: admin
      password: hU5k...bz7BGQDEX
      appLocatorMethods:
        - type: config
          instances:
            - name: argocdQShift
              url: https://openshift-gitops-server-openshift-gitops.apps.qshift.snowdrop.dev
    kubernetes:
      serviceLocatorMethod:
        type: 'multiTenant'
      clusterLocatorMethods:
        - type: 'config'
          clusters:
            - url: https://kubernetes.default.svc
              name: ocp-qshift
              authProvider: 'serviceAccount'
              skipTLSVerify: true
              skipMetricsLookup: true
              serviceAccountToken: eyJhbGciOiJSU...8ucTkQw2vnBm20  
    dynamicPlugins:
      frontend:
        qshift.plugin-quarkus-console:
          mountPoints:
          - mountPoint: entity.page.quarkus/cards
            importName: QuarkusConsolePage
            config:
              layout:
                gridColumn: '1 / -1'
              if:
                anyOf:
                - hasAnnotation: backstage.io/kubernetes-id
                - hasAnnotation: app.kubernetes.io/name        
EOF
```
- Deploy the `rhdh` helm chart using the following values

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add backstage https://backstage.github.io/charts
helm repo add redhat-developer https://redhat-developer.github.io/rhdh-chart
```
Create a helm values file including the cluster host name, plugins to be loaded dynamic, the reference of the configMap, etc
```bash
cat <<EOF > temp/rhdh-values.yml
global:
  host: rhdh.apps.qshift.snowdrop.dev
  dynamic:
    plugins:
    - disabled: false
      package: http://plugin-registry:8080/qshift-plugin-quarkus-backend-dynamic-0.1.28.tgz
    - disabled: false
      package: http://plugin-registry:8080/qshift-plugin-quarkus-0.1.28.tgz
    - disabled: false
      package: http://plugin-registry:8080/qshift-plugin-quarkus-console-0.1.28.tgz
    - disabled: false
      package: ./dynamic-plugins/dist/janus-idp-backstage-plugin-rbac
    - disabled: false
      package: ./dynamic-plugins/dist/roadiehq-scaffolder-backend-argocd-dynamic
    - disabled: false
      package: ./dynamic-plugins/dist/roadiehq-backstage-plugin-argo-cd-backend-dynamic
    - disabled: false
      package: ./dynamic-plugins/dist/roadiehq-backstage-plugin-argo-cd
    - disabled: false
      package: ./dynamic-plugins/dist/janus-idp-backstage-plugin-tekton
    - disabled: false
      package: ./dynamic-plugins/dist/backstage-plugin-kubernetes-backend-dynamic
    - disabled: false
      package: ./dynamic-plugins/dist/backstage-plugin-kubernetes
    - disabled: false
      package: ./dynamic-plugins/dist/janus-idp-backstage-plugin-topology
upstream:
  backstage:
    extraAppConfig:
    - filename: app-config-rhdh.yaml
      configMapRef: app-config-rhdh
EOF
helm upgrade -i rhdh redhat-developer/backstage -n rhdh -f temp/rhdh-values.yml
```

**Warning**: To skip the integrity check of the SHA SUM (needed for local development when you create your tarball) it is needed to patch the `initContainer` as the helm chart (2.15.1) do not allow to set this env variable:
```bash
kubectl set env deployment/rhdh-backstage -c install-dynamic-plugins -e SKIP_INTEGRITY_CHECK="true"
```

To remove the helm chart:
```bash
helm uninstall rhdh
```

## For local development

```bash
SOURCE_FOLDER=~/temp/dynamic-plugins-root
TARGET_FOLDER=~/code/janus-idp/fork-backstage-showcase/dynamic-plugins-root

for file in "$SOURCE_FOLDER"/*.tgz
do 
  file_without_extension="${file%.tgz}"
  echo "$file_without_extension"
  
  dir=$TARGET_FOLDER/$file_without_extension; mkdir -p $dir
  
  tar -C $dir -xzf $SOURCE_FOLDER/${file}
  
  mv $TARGET_FOLDER/$file_without_extension/package/* $TARGET_FOLDER/$file_without_extension
  rm -rf $TARGET_FOLDER/$file_without_extension/package
done
```