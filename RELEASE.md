# Release

Instructions to release and publish the project artifacts to the _npmjs.org_ 
 registry.

## GitHub workflows

The release process is implemented by 3 GitHub workflows.

* [Update version and create Release PR](./.github/workflows/pr-for-release.yaml): 
 Build packages, bump the node package version to the next version and create 
 a release PR.
* [Tag and create Release](./.github/workflows/tag-and-create-release.yaml): 
 Tag the git repository and release it.
* [Publish packages to Node.js](./.github/workflows/npm-publish.yaml): 
 Publish the packages on npmjs.org.


**Update version and create Release PR**

Manual workflow that generates a PR with the version that will be released.
 This workflow will 
 [require as input](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs) 
 the type of version that will be generated. The available choices are the following:

* `major`
* `minor`
* `patch`

The selected value will be parsed by the 
 [`npm version` command](https://docs.npmjs.com/cli/v10/commands/npm-version) 
 which will calculate the version number.

Example:

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

**Tag and create Release**

Upon on the merge of the release PR this workflow will be triggered which will:

* tag the repository with the release version
* generate a GitHub release
* trigger the publish workflow

**Publish packages to Node.js**

Automatic workflow, triggered by the GitHub release, that publishes the 
 artifacts to the _npmjs.org_ registry.
