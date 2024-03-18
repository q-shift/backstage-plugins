# Release

Instructions to release and publish the project artifacts to the _npmjs.org_ 
 registry.

## GitHub workflows

The release process is implemented on 3 GitHub actions.

* [Update version and create Release PR](..github/workflows/tag-for-release.yaml): create release PR with artifact updated versions.
* [Tag and create Release](..github/workflows/`release.yaml): create release 
* [Publish packages to Node.js](..github/workflows/`npm-publish.yaml): publish artifacts to npmjs.org


**tag-for-release.yaml**

Manual workflow that generates a PR with the versions that will be released.

**release.yaml**

Upon on the merge of the release PR this workflow will be treiggered which will:

* tag the repository with the release version
* generate a GitHub release
* trigger the publish workflow

**npm-publish.yaml**

Automatic workflow, triggered by the GitHub release, that publishes the 
 artifacts to the _npmjs.org_ registry.
