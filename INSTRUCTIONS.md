## Run Quarkus plugins on RHDH

To use our plugins on RHDH >=1.x, execute the following commands

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
- Create a configMap to configure `app-config.yaml` for your rhdh instance
```bash
cat <<EOF | kubectl apply -f -
kind: ConfigMap
apiVersion: v1
metadata:
  name: app-config-rhdh
data:
  app-config-rhdh.yaml: >-
    app:
      baseUrl: https://rhdh.apps.qshift.snowdrop.dev/
    backend:
      auth:
        keys:
        - secret: ${BACKEND_SECRET}
      baseUrl: https://rhdh.apps.qshift.snowdrop.dev/
      csp:
        connect-src: ["'self'", 'http:', 'https:']
      cors:
        origin: https://rhdh.apps.qshift.snowdrop.dev/
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
              serviceAccountToken: eyJhbGciOiJSUzI1NiIsImtpZCI6Ik1tbGtkcWpzNGNBcTRLS2ktU2I3ZVRaWlBMSFZYTHNQU0xHYWdObGtMdFEifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJyaGRoIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6Im15LWJhY2tzdGFnZS10b2tlbi03c254bCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJteS1iYWNrc3RhZ2UiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI2ZDUxNjRiMS0wYjgxLTQ5YjctOGFmOS04MWRiMTIwMDIxYzkiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6cmhkaDpteS1iYWNrc3RhZ2UifQ.JAoX3dLuWJ0eo_Pyeogh8eu78iFkiwD48tR6yV9VUwXwkp0bljGMYlnit6lOKoS61GvdEdkz9eKaTk4wr741rKv85jaJJdMoB8MbA0GBXlAEq3hKAJBTXPzmqEN4QqOv-x6_DJsPZF0HX8eS343LTyKuFg3Qy11YS3JehVYNkNMCWNoXIHepMV4PaiMTFdAxw5y6epfbUWtk3Hdc56VSe8e5VlIyMY_NJabX6QBKCfJiyZS-AywmA1pTVAEz7qAYkxs-xOiSjhV5kOuKQ-ydAARxqrV_bFaHQRD7mHECivbVYUgR4VUphKWhvcYlv9coMfA5icHxmeL_0uYMlp8oNu9aAMUz0I9iBmBxzdxV2GujmKxqfiOOSBkmy2rVp6-E5597u6hJD3tQWQouBuasP9vJtQWllCWpjiFFPtTtHtD6ro0Vb2V8Jx2vwv2-kxG7JSaBDwnmvyuJ_8pXu9Ubh5Jfm3MGeWfonKz3R4tOsn9MTyKD-pMTJysYZjMhBV1s7_fo6MreYt0vAmMTrPYkfZCgoON6gcWeOTllxtJeS4I8O1nZGXgF1hknEof_zLohe0K27i6iaongsPZiTnpNg85Xx26Gw51Q_F-jrjhqLA7We0DUcCjb_Ucqvp2mao8DcqnJZ0JU3GHV00--Eqp0xNi6Xv9Ih8ucTkQw2vnBm20  
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
TODO: Review the values to only set the needed !!
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add backstage https://backstage.github.io/charts
helm repo add redhat-developer https://redhat-developer.github.io/rhdh-chart
```
Create our own values file
```bash
cat <<EOF > rhdh-values.yml
global:
  # clusterRouterBase: apps.qshift.snowdrop.dev
  host: rhdh.qshift.snowdrop.dev
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
    - filename: app-config.rhdh.yaml
      configMapRef: app-config-rhdh       
EOF

helm upgrade -i rhdh redhat-developer/backstage -n rhdh -f rhdh-values.yml
```

## To be reviewed

File from previous helm deployment done directly on ocp
```yaml
global:
  auth:
    backend:
      enabled: true
  dynamic:
    includes:
      - dynamic-plugins.default.yaml
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
route:
  enabled: true
  host: rhdh.apps.qshift.snowdrop.dev
  path: /
  tls:
    enabled: true
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
  wildcardPolicy: None
upstream:
  backstage:
    appConfig:
      app:
        baseUrl: 'https://{{- include "janus-idp.hostname" . }}'
      backend:
        auth:
          keys:
            - secret: '${BACKEND_SECRET}'
        baseUrl: 'https://{{- include "janus-idp.hostname" . }}'
        cors:
          origin: 'https://{{- include "janus-idp.hostname" . }}'
        database:
          connection:
            password: '${POSTGRESQL_ADMIN_PASSWORD}'
            user: postgres
    args:
      - '--config'
      - dynamic-plugins-root/app-config.dynamic-plugins.yaml
    containerPorts:
      backend: 7007
    extraEnvVars:
      - name: BACKEND_SECRET
        valueFrom:
          secretKeyRef:
            key: backend-secret
            name: '{{ include "janus-idp.backend-secret-name" $ }}'
      - name: POSTGRESQL_ADMIN_PASSWORD
        valueFrom:
          secretKeyRef:
            key: postgres-password
            name: '{{- include "janus-idp.postgresql.secretName" . }}'
    extraVolumeMounts:
      - mountPath: /opt/app-root/src/dynamic-plugins-root
        name: dynamic-plugins-root
    extraVolumes:
      - ephemeral:
          volumeClaimTemplate:
            spec:
              accessModes:
                - ReadWriteOnce
              resources:
                requests:
                  storage: 2Gi
        name: dynamic-plugins-root
      - configMap:
          defaultMode: 420
          name: dynamic-plugins
          optional: true
        name: dynamic-plugins
      - name: dynamic-plugins-npmrc
        secret:
          defaultMode: 420
          optional: true
          secretName: dynamic-plugins-npmrc
    image:
      pullPolicy: Always
      pullSecrets:
        - rhdh-pull-secret
      registry: registry.redhat.io
      repository: rhdh/rhdh-hub-rhel9
      tag: 1.1-97
    initContainers:
      - command:
          - ./install-dynamic-plugins.sh
          - /dynamic-plugins-root
        env:
          - name: NPM_CONFIG_USERCONFIG
            value: /opt/app-root/src/.npmrc.dynamic-plugins
        image: '{{ include "backstage.image" . }}'
        imagePullPolicy: Always
        name: install-dynamic-plugins
        volumeMounts:
          - mountPath: /dynamic-plugins-root
            name: dynamic-plugins-root
          - mountPath: /opt/app-root/src/dynamic-plugins.yaml
            name: dynamic-plugins
            readOnly: true
            subPath: dynamic-plugins.yaml
          - mountPath: /opt/app-root/src/.npmrc.dynamic-plugins
            name: dynamic-plugins-npmrc
            readOnly: true
            subPath: .npmrc
        workingDir: /opt/app-root/src
    installDir: /opt/app-root/src
    livenessProbe:
      httpGet:
        path: /healthcheck
        port: 7007
        scheme: HTTP
      failureThreshold: 3
      initialDelaySeconds: 60
      periodSeconds: 10
      successThreshold: 1
      timeoutSeconds: 2
    podAnnotations:
      checksum/dynamic-plugins: >-
        {{- include "common.tplvalues.render" ( dict "value"
        .Values.global.dynamic "context" $) | sha256sum }}
    readinessProbe:
      httpGet:
        path: /healthcheck
        port: 7007
        scheme: HTTP
      failureThreshold: 3
      initialDelaySeconds: 30
      periodSeconds: 10
      successThreshold: 2
      timeoutSeconds: 2
    replicas: 1
    revisionHistoryLimit: 10
  clusterDomain: cluster.local
  diagnosticMode:
    args:
      - infinity
    command:
      - sleep
    enabled: false
  ingress:
    enabled: false
    host: '{{ .Values.global.host }}'
    tls:
      enabled: false
  metrics:
    serviceMonitor:
      enabled: false
      path: /metrics
  nameOverride: developer-hub
  networkPolicy:
    egressRules:
      denyConnectionsToExternal: false
    enabled: false
  postgresql:
    auth:
      secretKeys:
        adminPasswordKey: postgres-password
        userPasswordKey: password
    enabled: true
    image:
      registry: registry.redhat.io
      repository: rhel9/postgresql-15
      tag: latest
    postgresqlDataDir: /var/lib/pgsql/data/userdata
    primary:
      containerSecurityContext:
        enabled: false
      extraEnvVars:
        - name: POSTGRESQL_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              key: postgres-password
              name: '{{- include "postgresql.v1.secretName" . }}'
      persistence:
        enabled: true
        mountPath: /var/lib/pgsql/data
        size: 1Gi
      podSecurityContext:
        enabled: false
  service:
    externalTrafficPolicy: Cluster
    ports:
      backend: 7007
      name: http-backend
      targetPort: backend
    sessionAffinity: None
    type: ClusterIP
  serviceAccount:
    automountServiceAccountToken: true
    create: false
```

