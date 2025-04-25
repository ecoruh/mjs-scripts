# mjs-scripts

Author: Ergun Çoruh

## Summary

The scripts provided in this repository are meant to facilitate everyday tasks in homegrown projects, for example photography workflow automation.

This repository is organised as [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) for efficient resource management of multiple scripts.

## Platform Notes

* Platform: MacOS
* Runtime: NodeJS

## Constraints & Conventions

* All scripts must use NodeJS runtime.
* Each script can optionally be converted to a MacOS command and run from anywhere.
* All scripts must conform to [ECMAScript module system](https://nodejs.org/docs/latest/api/esm.html). Therefore they all must have `.mjs` file extension.
  * They must be small and confined to a single script.
  * They must have `#!/usr/bin/env node` as the 1st line of the script.
  * The script must begin with `script-` prefix.
  * They must be stored under the `scripts` folder.
  * They must use `commander` command line parser for consistency. This package is installed at root which is shared across all scripts.

## Build

### Install all Dependencies

```bash
# At the root
npm install
```

* npm will read the root `package.json` and the `package.json` inside each directory listed in the workspaces array (`scripts/script-a`, `scripts/script-b`, etc.).
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

### Converting script to a command

`npm Workspaces` manages the dependencies within your repository.

For  having direct commands like `script-a`, create the symlinks from a directory in your `$PATH` (like `/usr/local/bin`) to the actual executable `.mjs` file.

Production quality scripts must be deployed to `~/Scripts/mjs-scripts`. This is done through the use of command `npm deploy`.

### To create an executable command from a script

```bash
# From the root folder refresh node_modules
npm install

# Deploy script to target
npm run deploy script-a

# Test your script command
script-a --help
```
