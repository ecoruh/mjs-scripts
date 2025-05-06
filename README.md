# mjs-scripts

Author: Ergun Çoruh, 2025

## Summary

The scripts provided in this repository are meant to facilitate everyday tasks in homegrown projects, for example photography workflow automation, archiving, and so on.

This repository is organised as [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) for efficient resource management of multiple scripts.

## Platform Notes

* Platform: MacOS
* Runtime: NodeJS

## Constraints & Conventions

* All scripts must use NodeJS runtime.
* Each script can optionally be converted to a MacOS command and run from anywhere.
* All scripts must conform to [ECMAScript module system](https://nodejs.org/docs/latest/api/esm.html). Therefore they all must have `.mjs` file extension.
  * They must be small and confined to a single main module.
  * They must have `#!/usr/bin/env node` as the 1st line of the script.
  * The script must have a all lowercase name (eg. 'culler', 'sdimport', ..)
  * They must be stored under the `scripts` folder.
  * They must use `commander` command line parser for consistency. For conveneince this package is installed at root which is shared across all scripts.

## Build

### Install all Dependencies

```bash
# At the root
npm install
```

* `npm` will read the root `package.json` and the `package.json` inside each directory listed in the workspaces array (`scripts/script-a`, `scripts/script-b`, etc.).
* It will install all dependencies, hoisting shared ones to the root `node_modules` directory and placing package-specific ones inside the respective `scripts/package-name/node_modules` directory only if necessary (e.g., due to version conflicts).

## Folder Structure

### Development

```text
mjs-scripts/
├── node_modules/
├── package.json
├── scripts/
    ├── .mjs-config/
        └── [script-a.json]
    ├── mjs-lib/
    ├── script-a/
        └── package.json
        └── script-a.mjs
        └── script-a.test.mjs
    ├── script-b/
    ...

```

Notes:

1. Test modules (eg. `script-a.test.mjs`) are optional. To test, run `npm test`.
2. Configurations are optional. They can be useful when cli options are tedious to type. When present configurations must be stored like `.mjs-config/script-a.json`. Each key in a configuration file corresponds to a profile name that can be specified through `--profile` cli option. Configurations must be validated in code using `zod` package. When present cli options will override configuration ones. See `script-sd-import` as an example use of configurations and profiles.

### Production

Using the shell script `deploy.sh` each tested script can be copied to a production area. Deploy script assumes the production root folder is `~/scripts`, ie. you should manually create it if it doesn't exist. Via `deploy.sh` symbolic links to copied scripts are created in `/usr/local/bin` so that they can be invoked as stand-alone Terminal commands from anywhere.

```text
~scripts/
├── mjs-scripts/
    ├── node_modules/
    ├── scripts/
        ├── .mjs-config/
        └── [script-a.json]
        ├── mjs-lib/
        ├── script-a/
            └── script-a.mjs
        ├── script-b/
        ...
 ```

## Run

### Running Scripts Accross Workspaces

#### From the root directory

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

### Converting Scripts to Commands

`npm Workspaces` manages the dependencies within your repository.

For  having direct commands like `script-a`, create the symlinks from a directory in your `$PATH` (like `/usr/local/bin`) to the actual executable `.mjs` file.

Production quality scripts must be deployed to `~/Scripts/mjs-scripts`. This is done through the use of command `npm deploy`.

```bash
# From the root folder refresh node_modules
npm install

# Deploy script to target
npm run deploy script-a

# Test your script command
script-a --help
```

## Documentation

This README file and the sample script `adder` is all you need to study and create similar scripts.

Happy scripting!
