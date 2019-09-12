module.exports = {
  repositoryUrl: 'https://github.com/PolymathNetwork/polymath-contract-wrappers.git',
  branches: [
    'master',
    {
      channel: 'beta',
      type: 'prerelease',
      name: 'develop',
      prerelease: 'beta',
    },
  ],
  /**
   * In this order the **prepare** step of @semantic-release/npm will run first
   * followed by @semantic-release/git:
   *  - Update the package.json version and create the npm package tarball
   *  - Push a release commit and tag, including configurable files
   *
   * See:
   *  - https://github.com/semantic-release/semantic-release/blob/beta/docs/usage/plugins.md#plugin-ordering
   *  - https://github.com/semantic-release/semantic-release/blob/beta/docs/extending/plugins-list.md
   */
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        tarballDir: 'npm-package/',
      },
    ],
    '@semantic-release/git',
    '@semantic-release/github',
  ],
};
