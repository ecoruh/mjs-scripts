# mjs-scripts

Author: Ergun Çoruh

## Summary

This repository is organised as an [npm workspace](https://docs.npmjs.com/cli/v8/using-npm/workspaces) for efficient resource management of multiple NodeJS scripts. These scrıpts are meant for MacOS Terminal app to facilitate everyday tasks in homegrown projects, for example photography workflow automation.

## Constraints

* All scripts must use NodeJS runtime.
* They are designed for MacOS and tested on MacOS.
* Node.js will treat `.cjs` files as CommonJS modules and `.mjs` files as ECMAScript modules.
* All scripts must conform to [ECMAScript module system](https://nodejs.org/docs/latest/api/esm.html) Therefore they must all have `.mjs` file extension.
  * They must be small, concise and meant to run as a Terminal command.
  * They must have `#!/usr/bin/env node` as the 1st line of main module.
  * They must begin with `script-` prefix.
  * They must be stored under the `scripts` folder.
  * They must use `commander` command line parser for consistency. This package is installed at root which is shared across all scripts.

## Build

### Install all Dependencies

```bash
# At the root
npm install
```

* npm will read the root package.json and the package.json inside each directory listed in the workspaces array (`scripts/script-a`, `scripts/script-b`, etc.).
* It will install all dependencies, hoisting shared ones to the root `node_modules` directory and placing package-specific ones inside the respective `scripts/package-name/node_modules` directory only if necessary (e.g., due to version conflicts).

### Running Scripts Accross Workspaces

#### From the root directory:

* To run the lint script defined in all workspace packages that have it:

```bash
npm run lint --workspaces --if-present
```

(`--if-present` prevents errors if a workspace doesn't have the script).

* To run an arbitrary command in a specific workspace (e.g., test just script-a):

```bash
npm test -w script-a
# OR
npm test --workspace=script-a
```

* To run an arbitrary command in all workspaces

```bash
npm exec --ws -- <command>
# Example: Check node version used in each workspace context
npm exec --ws -- node -v
```

### Symlinking for Execution

`npm Workspaces` manages the dependencies within your repository. For having direct commands like `script-a-cmd` create symlinks manually.

`npm Workspaces` manages the dependencies within your repository. For your goal of having direct commands like `script-a-cmd`, create the symlinks from a directory in your $PATH (like /usr/local/bin) to the actual executable .mjs files.

For this repository production scripts are kept at `~/Scripts/mjs-scripts`.

```bash
# From the root folder
npm install

# Update target with latest node_modules
rm -rf ~/Scripts/mjs-scripts/node_modules
mkdir ~/Scripts/mjs-scripts/node_modules
cp -r node_modules/*  ~/Scripts/mjs-scripts/node_modules

# Copy the script and make it executable
cp scripts/script-culler/script-culler.mjs ~/Scripts/mjs-scripts
chmod + ~/Scripts/mjs-scripts/script-culler.mjs

# Create a symbolic link
sudo ln -s "~/Scripts/mjs-scripts/script-culler.mjs" /usr/local/bin/script-culler

# Test
script-culler --help
Usage: script-culler [options] <folder>
...
```
