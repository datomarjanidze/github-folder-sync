## github-folder-sync

[![NPM Downloads][npm-downloads-image]][npm-downloads-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Version][npm-version-image]][npm-url]

### Description
This library can be used to sync a folder from your device to GitHub.
This is a fun project and I do not recommend to push large files.

### Usage example
```javascript
const { homedir } = require('os')
const { join } = require('path')
const { GitHubFolderSync } = require('github-folder-sync')
const gitHubFolderSync = new GitHubFolderSync(
  join(homedir(), 'Desktop', 'my-folder'),
  60_000 * 5, // Sync in every 5 minutes.
  'some-repo',
  'ghp_c23sd2lMESl5nZsDs4Szzsj5Na2SiS1Yu62k',
  'datomarjanidze',
  'main',
)

gitHubFolderSync.start()
```

### Specs
- `GitHubFolderSync` class constructor parameters:
  - `folderPath {string}`: Absolute path of a folder to sync
  - `syncInterval {number}`: Frequency of sync in milliseconds
  - `gitHubRepoName {string}`: Repository name on GitHub
  - `gitHubToken {string}`: Personal access token generated on GitHub
  - `gitHubUsername {string}`: GitHub username/organization
  - `branchName {string}`: The name of the branch you want to sync
- `GitHubFolderSync` class methods:
  - `start`: Starts syncing. Return value void
  - `stop`: Stops syncing. Return value void
  - `sync (async)`: In case it is needed to manually execute sync and
  not wait until next sync tick. Return value void