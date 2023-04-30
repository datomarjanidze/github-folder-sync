## GitHub Folder Sync v1.2.0 Documentation

<p align="center">
  <a href="https://www.npmjs.com/package/github-folder-sync" target="_blank"><img src="https://img.shields.io/npm/v/github-folder-sync.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/github-folder-sync" target="_blank"><img src="https://img.shields.io/npm/l/github-folder-sync.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/github-folder-sync" target="_blank"><img src="https://img.shields.io/npm/dm/github-folder-sync.svg" alt="NPM Downloads" /></a>
</p>

### Table of contents

- [Description](#Description)
- [Installation](#Installation)
- [Usage example](#Usage-example)
- [API](#API)

### Description

This library can be used to sync a folder from your device to GitHub.
This is a fun project, and I do not recommend pushing the large files.

### Installation

```console
npm i github-folder-sync
```

### Usage example

```ts
import { homedir } from 'os'
import { join } from 'path'
import { GitHubFolderSync } from 'github-folder-sync'

const gitHubFolderSync = new GitHubFolderSync(
  join(homedir(), 'Desktop', 'my-folder'),
  60_000 * 5, // Sync in every 5 minutes.
  'some-repo',
  'ghp_c23sd2lMESl5nZsDs4Szzsj5Na2SiS1Yu62k',
  'datomarjanidze',
  'main'
)

gitHubFolderSync.start()
```

### API

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
