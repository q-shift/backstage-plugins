# Release

Instructions to release and publish the project artifacts to the _npmjs.org_ 
 registry.

## GitHub workflows

The release process is implemented by 3 GitHub workflows.

* [Update version and create Release PR](#update-version-and-create-release-pr): 
 Build packages, bump the node package version to the next version and create 
 a release PR - [`./.github/workflows/pr-for-release.yaml`](./.github/workflows/pr-for-release.yaml).
* [Tag and create Release](#tag-and-create-release): 
 Tag the git repository and release it - [`./.github/workflows/tag-and-create-release.yaml`](./.github/workflows/tag-and-create-release.yaml).
* [Publish packages to Node.js](#publish-packages-to-nodejs): 
 Publish the packages on npmjs.org - [`./.github/workflows/npm-publish.yaml`](./.github/workflows/npm-publish.yaml).


### Update version and create Release PR

Manual workflow that generates a PR with the version that will be released.
 This workflow will 
 [require as input](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs) 
 the type of version to be generated and will generate a new plugin version value 
 using the [`npm version` command](https://docs.npmjs.com/cli/v10/commands/npm-version).
 
The available choices for the `version_type` input are the following:

* `major`
* `minor`
* `patch`

These are some examples of the changes on the version number depending on the selected input.

```bash
$ npm pkg get version
"1.0.0"
$ npm version patch --no-git-tag-version
v1.0.1
$ npm version patch --no-git-tag-version
v1.0.2
$ npm version minor --no-git-tag-version
v1.1.0
$ npm version major --no-git-tag-version
v2.0.0
```


### Tag and create Release

This automatic workflow will:

* tag the repository with the release version
* generate a GitHub release
  * _The GitHub release will trigger the "Publish packages to Node.js" workflow._

> [!NOTE] 
> This workflow will be automatically triggered upon the merge of the release PR.


### Publish packages to Node.js

Automatic workflow that publishes the packages to the _npmjs.org_ registry.

> [!NOTE] 
> This workflow will be automatically triggered upon the creation of a GitHub release. 

> [!WARNING] 
> Although this workflow can be executed manually it hasn't been 
> prepared for it yet.


# Dynamic plugins

This section is a WIP and detail the steps to be done to release a dynamic plugin

Prior to publish a `dinamic-plugin` it is needed to compile, build and generate the dynamic stuffs:
```bash
yarn tsc
yarn build
yarn export-dynamic
```

## Generate a local tarball and publish it to a http registry on ocp

Create a temporary folder where you will publish the tarballs:

```bash
mkdir ~/temp/dynamic-plugins-root/
```

Move to the plugin project that you want to `pack`

```bash
NPM_CONFIG_IGNORE_SCRIPTS='true' npm pack ./dist-dynamic --pack-destination ~/temp/dynamic-plugins-root/
```

**Note**: To get the sha sum integrity, execute this command: `NPM_CONFIG_IGNORE_SCRIPTS='true' npm pack ./dist-dynamic --json | jq -r '.[0].integrity'`

**Important**: For testing purpose, you can add the `SKIP_INTEGRITY_CHECK` env variable to "true" to the `install-dynamic-plugins` initContainer !

When the tarball(s) has(have) been generated, it is time to publish them on a HTTP registry
```bash
cd ~/temp
oc login --token=sha256~... --server=https://api.qshift.snowdrop.dev:6443

oc project OR oc new-project rhdh
oc new-build httpd --name=plugin-registry --binary
oc start-build plugin-registry --from-dir=dynamic-plugins-root --wait
oc new-app --image-stream=plugin-registry
```

To update the http registry as documented here https://issues.redhat.com/browse/RHIDP-1624
```bash
oc start-build plugin-registry --from-dir=dynamic-plugins-root --wait
```

Update next the helm values of the RHDH helm chart using the ocp's developer view.

- Click on the `upgrade` action from the helm chart deployed
- If you use the `Form view` of the `developer-hub` chart installed, then click on `root schema/dynamic plugins configuration/list of dynamic plugins ...`
- Add the plugin(s)

Example
```yaml
global:
  dynamic:
    includes:
      - dynamic-plugins.default.yaml
    plugins:
      - package: http://plugin-registry:8080/qshift-plugin-quarkus-backend-dynamic-dynamic-0.1.0.tgz
        integrity: sha512-wKDRm+tyJwCdDbAGYakXGV1Q7JNjikrERaUYYHqce5mki7yP2fAWJ4rFxKXgj/t1oRg0sZDIWeMS3MtvxuR5SA==
        disabled: false
```

## Publish on npmjs the node_modules (NOT RECOMMENDED)

If it is not possible to publish the `dynamic` plugin to a local registry, then you can still publish it with the node_modules on npmjs
by executing the following commands.

**Important**: This is not recommended !
```bash
cd <plugin_project> 
cd ./dist-dynamic; NPM_CONFIG_IGNORE_SCRIPTS='true' npm publish --access public
```

Next, get the tarball URL and integrity sha
```bash
NPM_ACCOUNT=<YOUR_NPMJS_ACCOUNT>
npm info @$NPM_ACCOUNT/plugin-quarkus-backend --json | jq -r '.dist.integrity'
npm info @$NPM_ACCOUNT/plugin-quarkus-backend --json | jq -r '.dist.tarball'
```