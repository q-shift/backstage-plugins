export const mockKubernetesQuarkusApplicationResponse = {
  pods: [
    {
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
        "annotations": {
          "k8s.ovn.org/pod-networks": "{\"default\":{\"ip_addresses\":[\"10.128.2.46/23\"],\"mac_address\":\"0a:58:0a:80:02:2e\",\"gateway_ips\":[\"10.128.2.1\"],\"routes\":[{\"dest\":\"10.128.0.0/14\",\"nextHop\":\"10.128.2.1\"},{\"dest\":\"172.30.0.0/16\",\"nextHop\":\"10.128.2.1\"},{\"dest\":\"100.64.0.0/16\",\"nextHop\":\"10.128.2.1\"}],\"ip_address\":\"10.128.2.46/23\",\"gateway_ip\":\"10.128.2.1\"}}",
          "k8s.v1.cni.cncf.io/network-status": "[{\n    \"name\": \"ovn-kubernetes\",\n    \"interface\": \"eth0\",\n    \"ips\": [\n        \"10.128.2.46\"\n    ],\n    \"mac\": \"0a:58:0a:80:02:2e\",\n    \"default\": true,\n    \"dns\": {}\n}]",
          "openshift.io/scc": "restricted-v2",
          "seccomp.security.alpha.kubernetes.io/pod": "runtime/default"
        },
        "creationTimestamp": "2024-03-11T16:20:11Z",
        "generateName": "my-quarkus-app-7c775ff65d-",
        "labels": {
          "app.kubernetes.io/instance": "my-quarkus-app-deploy",
          "app.kubernetes.io/name": "my-quarkus-app",
          "backstage.io/kubernetes-id": "my-quarkus-app",
          "pod-template-hash": "7c775ff65d"
        },
        "name": "my-quarkus-app-7c775ff65d-gkm9c",
        "namespace": "cmoullia",
        "ownerReferences": [
          {
            "apiVersion": "apps/v1",
            "blockOwnerDeletion": true,
            "controller": true,
            "kind": "ReplicaSet",
            "name": "my-quarkus-app-7c775ff65d",
            "uid": "212fea0e-bcab-4ee3-9754-6b91c71474af"
          }
        ],
        "resourceVersion": "189832875",
        "uid": "baf73433-7304-46ea-bee7-b6343a5ecd4a"
      },
      "spec": {
        "containers": [
          {
            "env": [
              {
                "name": "QUARKUS_DATASOURCE_PASSWORD",
                "valueFrom": {
                  "secretKeyRef": {
                    "key": "postgres-password",
                    "name": "my-quarkus-app-db-postgresql"
                  }
                }
              }
            ],
            "image": "quay.io/ch007m/my-quarkus-app",
            "imagePullPolicy": "Always",
            "name": "my-quarkus-app",
            "ports": [
              {
                "containerPort": 8080,
                "name": "http",
                "protocol": "TCP"
              }
            ],
            "resources": {},
            "securityContext": {
              "allowPrivilegeEscalation": false,
              "capabilities": {
                "drop": [
                  "ALL"
                ]
              },
              "runAsNonRoot": true,
              "runAsUser": 1000820000
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "volumeMounts": [
              {
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount",
                "name": "kube-api-access-8hg9d",
                "readOnly": true
              }
            ]
          }
        ],
        "dnsPolicy": "ClusterFirst",
        "enableServiceLinks": true,
        "imagePullSecrets": [
          {
            "name": "my-quarkus-app-deploy-dockercfg-wlxzm"
          }
        ],
        "nodeName": "qshift-drp2b-worker-0-pk7dr",
        "preemptionPolicy": "PreemptLowerPriority",
        "priority": 0,
        "restartPolicy": "Always",
        "schedulerName": "default-scheduler",
        "securityContext": {
          "fsGroup": 1000820000,
          "seLinuxOptions": {
            "level": "s0:c29,c4"
          },
          "seccompProfile": {
            "type": "RuntimeDefault"
          }
        },
        "serviceAccount": "my-quarkus-app-deploy",
        "serviceAccountName": "my-quarkus-app-deploy",
        "terminationGracePeriodSeconds": 30,
        "tolerations": [
          {
            "effect": "NoExecute",
            "key": "node.kubernetes.io/not-ready",
            "operator": "Exists",
            "tolerationSeconds": 300
          },
          {
            "effect": "NoExecute",
            "key": "node.kubernetes.io/unreachable",
            "operator": "Exists",
            "tolerationSeconds": 300
          }
        ],
        "volumes": [
          {
            "name": "kube-api-access-8hg9d",
            "projected": {
              "defaultMode": 420,
              "sources": [
                {
                  "serviceAccountToken": {
                    "expirationSeconds": 3607,
                    "path": "token"
                  }
                },
                {
                  "configMap": {
                    "items": [
                      {
                        "key": "ca.crt",
                        "path": "ca.crt"
                      }
                    ],
                    "name": "kube-root-ca.crt"
                  }
                },
                {
                  "downwardAPI": {
                    "items": [
                      {
                        "fieldRef": {
                          "apiVersion": "v1",
                          "fieldPath": "metadata.namespace"
                        },
                        "path": "namespace"
                      }
                    ]
                  }
                },
                {
                  "configMap": {
                    "items": [
                      {
                        "key": "service-ca.crt",
                        "path": "service-ca.crt"
                      }
                    ],
                    "name": "openshift-service-ca.crt"
                  }
                }
              ]
            }
          }
        ]
      },
      "status": {
        "conditions": [
          {
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-11T16:20:36Z",
            "status": "True",
            "type": "Initialized"
          },
          {
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-11T16:20:58Z",
            "status": "True",
            "type": "Ready"
          },
          {
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-11T16:20:58Z",
            "status": "True",
            "type": "ContainersReady"
          },
          {
            "lastProbeTime": null,
            "lastTransitionTime": "2024-03-11T16:20:11Z",
            "status": "True",
            "type": "PodScheduled"
          }
        ],
        "containerStatuses": [
          {
            "containerID": "cri-o://fca91e4801b41a92a032de3b21530fa9b7a153925a90924b5b0fbbc7de329422",
            "image": "quay.io/ch007m/my-quarkus-app:latest",
            "imageID": "quay.io/ch007m/my-quarkus-app@sha256:60ac298fb640037dd867c1380574eacff86bdf4514b1b1cf241451ab4c1a150e",
            "lastState": {
              "terminated": {
                "containerID": "cri-o://0883de8a87b4eb51e88088aa024ff33b020fa68aa90bc0b1ec3535eff6324c14",
                "exitCode": 1,
                "finishedAt": "2024-03-11T16:20:43Z",
                "reason": "Error",
                "startedAt": "2024-03-11T16:20:42Z"
              }
            },
            "name": "my-quarkus-app",
            "ready": true,
            "restartCount": 2,
            "started": true,
            "state": {
              "running": {
                "startedAt": "2024-03-11T16:20:58Z"
              }
            }
          }
        ],
        "hostIP": "172.208.3.224",
        "phase": "Running",
        "podIP": "10.128.2.46",
        "podIPs": [
          {
            "ip": "10.128.2.46"
          }
        ],
        "qosClass": "BestEffort",
        "startTime": "2024-03-11T16:20:36Z"
      }
    }
  ],
  deployments: [
    {
      "apiVersion": "apps/v1",
      "kind": "Deployment",
      "metadata": {
        "annotations": {
          "app.openshift.io/vcs-uri": "https://github.com/ch007m/my-quarkus-app.git",
          "app.quarkus.io/quarkus-version": "3.7.1",
          "deployment.kubernetes.io/revision": "1",
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"apps/v1\",\"kind\":\"Deployment\",\"metadata\":{\"annotations\":{\"app.openshift.io/vcs-uri\":\"https://github.com/ch007m/my-quarkus-app.git\",\"app.quarkus.io/quarkus-version\":\"3.7.1\"},\"labels\":{\"app.kubernetes.io/instance\":\"cmoullia_my-quarkus-app-deploy\",\"app.kubernetes.io/name\":\"my-quarkus-app\",\"app.kubernetes.io/version\":\"1.0.0\",\"app.openshift.io/runtime\":\"quarkus\",\"backstage.io/kubernetes-id\":\"my-quarkus-app\",\"helm.sh/chart\":\"my-quarkus-app-0.1.0\"},\"name\":\"my-quarkus-app\",\"namespace\":\"cmoullia\"},\"spec\":{\"replicas\":1,\"selector\":{\"matchLabels\":{\"app.kubernetes.io/instance\":\"my-quarkus-app-deploy\",\"app.kubernetes.io/name\":\"my-quarkus-app\"}},\"template\":{\"metadata\":{\"labels\":{\"app.kubernetes.io/instance\":\"my-quarkus-app-deploy\",\"app.kubernetes.io/name\":\"my-quarkus-app\",\"backstage.io/kubernetes-id\":\"my-quarkus-app\"}},\"spec\":{\"containers\":[{\"env\":[{\"name\":\"QUARKUS_DATASOURCE_PASSWORD\",\"valueFrom\":{\"secretKeyRef\":{\"key\":\"postgres-password\",\"name\":\"my-quarkus-app-db-postgresql\"}}}],\"image\":\"quay.io/ch007m/my-quarkus-app\",\"imagePullPolicy\":\"Always\",\"name\":\"my-quarkus-app\",\"ports\":[{\"containerPort\":8080,\"name\":\"http\",\"protocol\":\"TCP\"}],\"resources\":{},\"securityContext\":{}}],\"securityContext\":{},\"serviceAccountName\":\"my-quarkus-app-deploy\"}}}}\n"
        },
        "creationTimestamp": "2024-03-11T16:20:11Z",
        "generation": 1,
        "labels": {
          "app.kubernetes.io/instance": "cmoullia_my-quarkus-app-deploy",
          "app.kubernetes.io/name": "my-quarkus-app",
          "app.kubernetes.io/version": "1.0.0",
          "app.openshift.io/runtime": "quarkus",
          "backstage.io/kubernetes-id": "my-quarkus-app",
          "helm.sh/chart": "my-quarkus-app-0.1.0"
        },
        "name": "my-quarkus-app",
        "namespace": "cmoullia",
        "resourceVersion": "189832880",
        "uid": "215d915f-019d-4ebb-82a3-a1da88f7c61b"
      },
      "spec": {
        "progressDeadlineSeconds": 600,
        "replicas": 1,
        "revisionHistoryLimit": 10,
        "selector": {
          "matchLabels": {
            "app.kubernetes.io/instance": "my-quarkus-app-deploy",
            "app.kubernetes.io/name": "my-quarkus-app"
          }
        },
        "strategy": {
          "rollingUpdate": {
            "maxSurge": "25%",
            "maxUnavailable": "25%"
          },
          "type": "RollingUpdate"
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
                "env": [
                  {
                    "name": "QUARKUS_DATASOURCE_PASSWORD",
                    "valueFrom": {
                      "secretKeyRef": {
                        "key": "postgres-password",
                        "name": "my-quarkus-app-db-postgresql"
                      }
                    }
                  }
                ],
                "image": "quay.io/ch007m/my-quarkus-app",
                "imagePullPolicy": "Always",
                "name": "my-quarkus-app",
                "ports": [
                  {
                    "containerPort": 8080,
                    "name": "http",
                    "protocol": "TCP"
                  }
                ],
                "resources": {},
                "securityContext": {},
                "terminationMessagePath": "/dev/termination-log",
                "terminationMessagePolicy": "File"
              }
            ],
            "dnsPolicy": "ClusterFirst",
            "restartPolicy": "Always",
            "schedulerName": "default-scheduler",
            "securityContext": {},
            "serviceAccount": "my-quarkus-app-deploy",
            "serviceAccountName": "my-quarkus-app-deploy",
            "terminationGracePeriodSeconds": 30
          }
        }
      },
      "status": {
        "availableReplicas": 1,
        "conditions": [
          {
            "lastTransitionTime": "2024-03-11T16:20:11Z",
            "lastUpdateTime": "2024-03-11T16:20:13Z",
            "message": "ReplicaSet \"my-quarkus-app-7c775ff65d\" has successfully progressed.",
            "reason": "NewReplicaSetAvailable",
            "status": "True",
            "type": "Progressing"
          },
          {
            "lastTransitionTime": "2024-03-11T16:20:33Z",
            "lastUpdateTime": "2024-03-11T16:20:33Z",
            "message": "Deployment has minimum availability.",
            "reason": "MinimumReplicasAvailable",
            "status": "True",
            "type": "Available"
          }
        ],
        "observedGeneration": 1,
        "readyReplicas": 1,
        "replicas": 1,
        "updatedReplicas": 1
      }
    }
  ]
};
