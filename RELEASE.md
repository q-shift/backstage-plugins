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
