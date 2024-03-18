export const mockKubernetesQuarkusApplicationResponse = {
  pods: [
    {
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "generateName": "my-quarkus-app-7c775ff65d-",
        "annotations": {
          "openshift.io/scc": "restricted-v2",
          "seccomp.security.alpha.kubernetes.io/pod": "runtime/default"
        },
        "resourceVersion": "202088685",
        "name": "my-quarkus-app-7c775ff65d-tqs77",
        "uid": "a85b2ed8-a92e-4ea6-a8f6-82fe4a6b5a07",
        "creationTimestamp": "2024-03-18T15:04:46Z",
        "namespace": "cmoullia",
        "ownerReferences": [
          {
            "apiVersion": "apps/v1",
            "kind": "ReplicaSet",
            "name": "my-quarkus-app-7c775ff65d",
            "uid": "212fea0e-bcab-4ee3-9754-6b91c71474af",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ],
        "labels": {
          "app.kubernetes.io/instance": "my-quarkus-app-deploy",
          "app.kubernetes.io/name": "my-quarkus-app",
          "backstage.io/kubernetes-id": "my-quarkus-app",
          "pod-template-hash": "7c775ff65d"
        }
      },
      "spec": {
        "restartPolicy": "Always",
        "serviceAccountName": "my-quarkus-app-deploy",
        "imagePullSecrets": [
          {
            "name": "my-quarkus-app-deploy-dockercfg-wlxzm"
          }
        ],
        "priority": 0,
        "schedulerName": "default-scheduler",
        "enableServiceLinks": true,
        "terminationGracePeriodSeconds": 30,
        "preemptionPolicy": "PreemptLowerPriority",
        "nodeName": "qshift-drp2b-worker-0-pk7dr",
        "securityContext": {
          "seLinuxOptions": {
            "level": "s0:c29,c4"
          },
          "fsGroup": 1000820000,
          "seccompProfile": {
            "type": "RuntimeDefault"
          }
        },
        "containers": [
          {
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "name": "my-quarkus-app",
            "env": [
              {
                "name": "QUARKUS_DATASOURCE_PASSWORD",
                "valueFrom": {
                  "secretKeyRef": {
                    "name": "my-quarkus-app-db-postgresql",
                    "key": "postgres-password"
                  }
                }
              }
            ],
            "securityContext": {
              "capabilities": {
                "drop": [
                  "ALL"
                ]
              },
              "runAsUser": 1000820000,
              "runAsNonRoot": true,
              "allowPrivilegeEscalation": false
            },
            "ports": [
              {
                "name": "http",
                "containerPort": 8080,
                "protocol": "TCP"
              }
            ],
            "imagePullPolicy": "Always",
            "volumeMounts": [
              {
                "name": "kube-api-access-ng2jv",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "terminationMessagePolicy": "File",
            "image": "quay.io/ch007m/my-quarkus-app"
          }
        ],
        "serviceAccount": "my-quarkus-app-deploy",
        "volumes": [
          {
            "name": "kube-api-access-ng2jv",
            "projected": {
              "sources": [
                {
                  "serviceAccountToken": {
                    "expirationSeconds": 3607,
                    "path": "token"
                  }
                },
                {
                  "configMap": {
                    "name": "kube-root-ca.crt",
                    "items": [
                      {
                        "key": "ca.crt",
                        "path": "ca.crt"
                      }
                    ]
                  }
                },
                {
                  "downwardAPI": {
                    "items": [
                      {
                        "path": "namespace",
                        "fieldRef": {
                          "apiVersion": "v1",
                          "fieldPath": "metadata.namespace"
                        }
                      }
                    ]
                  }
                },
                {
                  "configMap": {
                    "name": "openshift-service-ca.crt",
                    "items": [
                      {
                        "key": "service-ca.crt",
                        "path": "service-ca.crt"
                      }
                    ]
                  }
                }
              ],
              "defaultMode": 420
            }
          }
        ],
        "dnsPolicy": "ClusterFirst",
        "tolerations": [
          {
            "key": "node.kubernetes.io/not-ready",
            "operator": "Exists",
            "effect": "NoExecute",
            "tolerationSeconds": 300
          },
          {
            "key": "node.kubernetes.io/unreachable",
            "operator": "Exists",
            "effect": "NoExecute",
            "tolerationSeconds": 300
          }
        ]
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-18T15:04:51Z"
          },
          {
            "type": "Ready",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-18T15:04:56Z"
          },
          {
            "type": "ContainersReady",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-18T15:04:56Z"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-18T15:04:22Z"
          }
        ],
        "hostIP": "172.208.3.224",
        "podIP": "10.128.2.233",
        "podIPs": [
          {
            "ip": "10.128.2.233"
          }
        ],
        "startTime": "2024-03-18T15:04:51Z",
        "containerStatuses": [
          {
            "restartCount": 0,
            "started": true,
            "ready": true,
            "name": "my-quarkus-app",
            "state": {
              "running": {
                "startedAt": "2024-03-18T15:04:55Z"
              }
            },
            "imageID": "quay.io/ch007m/my-quarkus-app@sha256:cbea1ee9f14aeb61fe9c5d25f473838890e17e463801093a86ad8fd6c2c72b04",
            "image": "quay.io/ch007m/my-quarkus-app:latest",
            "lastState": {},
            "containerID": "cri-o://2748ca2b62f4a30c780b1619a4cc48c444fc27a22b26c8f9c5098cf432a0071c"
          }
        ],
        "qosClass": "BestEffort"
      }
    }
  ],
  replicasets: [
    {
      "kind": "ReplicaSet",
      "apiVersion": "apps/v1",
      "metadata": {
        "annotations": {
          "app.openshift.io/vcs-uri": "https://github.com/ch007m/my-quarkus-app.git",
          "app.quarkus.io/quarkus-version": "3.7.1",
          "deployment.kubernetes.io/desired-replicas": "1",
          "deployment.kubernetes.io/max-replicas": "2",
          "deployment.kubernetes.io/revision": "1"
        },
        "resourceVersion": "202088688",
        "name": "my-quarkus-app-7c775ff65d",
        "uid": "212fea0e-bcab-4ee3-9754-6b91c71474af",
        "creationTimestamp": "2024-03-11T16:20:11Z",
        "generation": 1,
        "namespace": "cmoullia",
        "ownerReferences": [
          {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "name": "my-quarkus-app",
            "uid": "215d915f-019d-4ebb-82a3-a1da88f7c61b",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ],
        "labels": {
          "app.kubernetes.io/instance": "my-quarkus-app-deploy",
          "app.kubernetes.io/name": "my-quarkus-app",
          "backstage.io/kubernetes-id": "my-quarkus-app",
          "pod-template-hash": "7c775ff65d"
        }
      },
      "spec": {
        "replicas": 1,
        "selector": {
          "matchLabels": {
            "app.kubernetes.io/instance": "my-quarkus-app-deploy",
            "app.kubernetes.io/name": "my-quarkus-app",
            "pod-template-hash": "7c775ff65d"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "app.kubernetes.io/instance": "my-quarkus-app-deploy",
              "app.kubernetes.io/name": "my-quarkus-app",
              "backstage.io/kubernetes-id": "my-quarkus-app",
              "pod-template-hash": "7c775ff65d"
            }
          },
          "spec": {
            "containers": [
              {
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "name": "my-quarkus-app",
                "env": [
                  {
                    "name": "QUARKUS_DATASOURCE_PASSWORD",
                    "valueFrom": {
                      "secretKeyRef": {
                        "name": "my-quarkus-app-db-postgresql",
                        "key": "postgres-password"
                      }
                    }
                  }
                ],
                "securityContext": {},
                "ports": [
                  {
                    "name": "http",
                    "containerPort": 8080,
                    "protocol": "TCP"
                  }
                ],
                "imagePullPolicy": "Always",
                "terminationMessagePolicy": "File",
                "image": "quay.io/ch007m/my-quarkus-app"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "serviceAccountName": "my-quarkus-app-deploy",
            "serviceAccount": "my-quarkus-app-deploy",
            "securityContext": {},
            "schedulerName": "default-scheduler"
          }
        }
      },
      "status": {
        "replicas": 1,
        "fullyLabeledReplicas": 1,
        "readyReplicas": 1,
        "availableReplicas": 1,
        "observedGeneration": 1
      }
    }
  ],
  deployments: [
    {
      "kind": "Deployment",
      "apiVersion": "apps/v1",
      "metadata": {
        "annotations": {
          "app.openshift.io/vcs-uri": "https://github.com/ch007m/my-quarkus-app.git",
          "app.quarkus.io/quarkus-version": "3.7.1",
          "deployment.kubernetes.io/revision": "1",
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"apps/v1\",\"kind\":\"Deployment\",\"metadata\":{\"annotations\":{\"app.openshift.io/vcs-uri\":\"https://github.com/ch007m/my-quarkus-app.git\",\"app.quarkus.io/quarkus-version\":\"3.7.1\"},\"labels\":{\"app.kubernetes.io/instance\":\"cmoullia_my-quarkus-app-deploy\",\"app.kubernetes.io/name\":\"my-quarkus-app\",\"app.kubernetes.io/version\":\"1.0.0\",\"app.openshift.io/runtime\":\"quarkus\",\"backstage.io/kubernetes-id\":\"my-quarkus-app\",\"helm.sh/chart\":\"my-quarkus-app-0.1.0\"},\"name\":\"my-quarkus-app\",\"namespace\":\"cmoullia\"},\"spec\":{\"replicas\":1,\"selector\":{\"matchLabels\":{\"app.kubernetes.io/instance\":\"my-quarkus-app-deploy\",\"app.kubernetes.io/name\":\"my-quarkus-app\"}},\"template\":{\"metadata\":{\"labels\":{\"app.kubernetes.io/instance\":\"my-quarkus-app-deploy\",\"app.kubernetes.io/name\":\"my-quarkus-app\",\"backstage.io/kubernetes-id\":\"my-quarkus-app\"}},\"spec\":{\"containers\":[{\"env\":[{\"name\":\"QUARKUS_DATASOURCE_PASSWORD\",\"valueFrom\":{\"secretKeyRef\":{\"key\":\"postgres-password\",\"name\":\"my-quarkus-app-db-postgresql\"}}}],\"image\":\"quay.io/ch007m/my-quarkus-app\",\"imagePullPolicy\":\"Always\",\"name\":\"my-quarkus-app\",\"ports\":[{\"containerPort\":8080,\"name\":\"http\",\"protocol\":\"TCP\"}],\"resources\":{},\"securityContext\":{}}],\"securityContext\":{},\"serviceAccountName\":\"my-quarkus-app-deploy\"}}}}\n"
        },
        "resourceVersion": "202088689",
        "name": "my-quarkus-app",
        "uid": "215d915f-019d-4ebb-82a3-a1da88f7c61b",
        "creationTimestamp": "2024-03-11T16:20:11Z",
        "generation": 1,
        "namespace": "cmoullia",
        "labels": {
          "app.kubernetes.io/instance": "cmoullia_my-quarkus-app-deploy",
          "app.kubernetes.io/name": "my-quarkus-app",
          "app.kubernetes.io/version": "1.0.0",
          "app.openshift.io/runtime": "quarkus",
          "backstage.io/kubernetes-id": "my-quarkus-app",
          "helm.sh/chart": "my-quarkus-app-0.1.0"
        }
      },
      "spec": {
        "replicas": 1,
        "selector": {
          "matchLabels": {
            "app.kubernetes.io/instance": "my-quarkus-app-deploy",
            "app.kubernetes.io/name": "my-quarkus-app"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "app.kubernetes.io/instance": "my-quarkus-app-deploy",
              "app.kubernetes.io/name": "my-quarkus-app",
              "backstage.io/kubernetes-id": "my-quarkus-app"
            }
          },
          "spec": {
            "containers": [
              {
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "name": "my-quarkus-app",
                "env": [
                  {
                    "name": "QUARKUS_DATASOURCE_PASSWORD",
                    "valueFrom": {
                      "secretKeyRef": {
                        "name": "my-quarkus-app-db-postgresql",
                        "key": "postgres-password"
                      }
                    }
                  }
                ],
                "securityContext": {},
                "ports": [
                  {
                    "name": "http",
                    "containerPort": 8080,
                    "protocol": "TCP"
                  }
                ],
                "imagePullPolicy": "Always",
                "terminationMessagePolicy": "File",
                "image": "quay.io/ch007m/my-quarkus-app"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "serviceAccountName": "my-quarkus-app-deploy",
            "serviceAccount": "my-quarkus-app-deploy",
            "securityContext": {},
            "schedulerName": "default-scheduler"
          }
        },
        "strategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": "25%",
            "maxSurge": "25%"
          }
        },
        "revisionHistoryLimit": 10,
        "progressDeadlineSeconds": 600
      },
      "status": {
        "observedGeneration": 1,
        "replicas": 1,
        "updatedReplicas": 1,
        "readyReplicas": 1,
        "availableReplicas": 1,
        "conditions": [
          {
            "type": "Progressing",
            "status": "True",
            "lastUpdateTime": "2024-03-11T16:20:13Z",
            "lastTransitionTime": "2024-03-11T16:20:11Z",
            "reason": "NewReplicaSetAvailable",
            "message": "ReplicaSet \"my-quarkus-app-7c775ff65d\" has successfully progressed."
          },
          {
            "type": "Available",
            "status": "True",
            "lastUpdateTime": "2024-03-18T15:04:51Z",
            "lastTransitionTime": "2024-03-18T15:04:51Z",
            "reason": "MinimumReplicasAvailable",
            "message": "Deployment has minimum availability."
          }
        ]
      }
    }
  ]
};
