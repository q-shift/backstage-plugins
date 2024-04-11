changequote("""", """)
# @qshift/quarkus-plugins

This project contains different [Backstage](https://backstage.io/) plugins to work with [Quarkus](https://quarkus.io/) which is a Kubernetes-native Java framework tailored for GraalVM and HotSpot, crafted from best-of-breed Java libraries and standards.

This repository contains the following Backstage plugins:

- [Quarkus Frontend](#quarkus-frontend)
- [Quarkus Scaffolder Backend](#quarkus-scaffolder-backend)

## Prerequisites

- [Node.js](https://nodejs.org/en) (18 or 20)
- [nvm](https://github.com/nvm-sh/nvm), npm and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) installed

## Getting started

To play with one of our plugins, create first a [Backstage](https://backstage.io/docs/getting-started/) application locally using this command:
```
npx @backstage/create-app@latest
```

To fix the React issue https://github.com/backstage/backstage/issues/22142 which has been reported using the client `0.25` and backstage (> 1.21),
then edit the `package.json` to add the following dependency:
```json
  "resolutions": {
...
    "swagger-ui-react": "5.10.5"
  },
```

Verify if the newly application created is working fine: `yarn dev`


include(""""./plugins/quarkus/README.md""")
include(""""./plugins/quarkus-backend/README.md""")
include(""""./plugins/quarkus-console/README.md""")

changequote()
