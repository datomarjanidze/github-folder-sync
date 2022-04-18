const { watch } = require('fs')
const { exec } = require('child_process')

class GitHubFolderSync {
  constructor(
    folderPath /*: string */,
    syncInterval /*: number */,
    gitHubRepoName /*: string */,
    gitHubToken /*: string */,
    gitHubUsername /*: string */,
    branchName /*: string */
  ) {
    this.folderPath = folderPath
    this.syncInterval = syncInterval
    this.git = new Git(folderPath, gitHubRepoName, gitHubToken, gitHubUsername, branchName)
    this.readyForSync = false
    this.intervalId = null
    this.watcher = null
  }
  
  start() /*: void */ {
    if (!this.intervalId) {
      this.git.initRepo()
      this._watch()
      this.intervalId = setInterval(() => this.sync(), this.syncInterval)
    }
  }

  stop() /*: void */ {
    clearInterval(this.intervalId)
    this.intervalId = null

    this.watcher.close()
    this.watcher = null
  }
  
  async sync() /*: Promise<void> */ {
    await this.git.pullFromGitHub()

    if (this.readyForSync) {
      await this.git.commitEverythingInSyncFolder()
      await this.git.pushToGitHub()
      this.readyForSync = false
    }
  }

  _watch() {
    if (!this.watcher)
      this.watcher = watch(
        this.folderPath,
        () => this.readyForSync = true
      )
  }
}

class Git {
  constructor(
    folderPath /*: string */,
    gitHubRepoName /*: string */,
    gitHubToken /*: string */,
    gitHubUsername /*: string */,
    branchName /*: string */,
  ) {
    this.folderPath = folderPath
    this.gitHubRepoName = gitHubRepoName
    this.gitHubToken = gitHubToken
    this.gitHubUsername = gitHubUsername
    this.branchName = branchName
  }

  run(command /*: string */) {
    return new Promise((resolve, reject) =>
      exec(
        `git ${command}`,
        { cwd: this.folderPath },
        (error, stdout, stderr) =>
          error || stderr ? reject(error || stderr) : resolve(stdout)
      )
    )
  }

  async initRepo() /*: Promise<void> */ {
    if (!(await this.repoExists()))
      await this.run('init').then((r) => console.log(r))
  }

  async repoExists() /*: Promise<boolean> */ {
    return new Promise((resolve) => {
      this.run('add').catch(error => {
        if(error.toString().includes('not a git repository')) resolve(false)
        if(error.toString().includes('Nothing specified, nothing added')) resolve(true)
      })
    }) 
  }

  async nothingToCommit() /*: Promise<boolean> */ {
    return new Promise((resolve) => {
      this.run('status').then(
        (status /*: string */) => resolve(
          status.includes('nothing to commit')
        )
      )
    })
  }

  async commitEverythingInSyncFolder() {
    if (!(await this.nothingToCommit()))
      await this.run('add -A').then(async (r) => 
        await this.run(`commit -m "github-folder-sync: ${new Date().toISOString()}"`)
      )
  }

  async pullFromGitHub() /*: Promise<void> */ {
    await this.run(`branch -M ${this.branchName}`)
    await this.run(
      `pull https://${this.gitHubUsername}:${this.gitHubToken}@github.com/${this.gitHubUsername}/${this.gitHubRepoName}.git`
    ).catch(e => e)
  }

  async pushToGitHub() /*: Promise<void> */ {
    await this.run(`branch -M ${this.branchName}`)
    await this.run(
      `push https://${this.gitHubUsername}:${this.gitHubToken}@github.com/${this.gitHubUsername}/${this.gitHubRepoName}.git`
    ).catch(e => e)
  }
}

module.exports = { GitHubFolderSync }