#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { loadConfig } from '../mjs-lib/config-loader.mjs';
import { z } from 'zod';

function importFiles(config) {
    const folders = fs.readdirSync(config.source);
    const regex = new RegExp(config.regex);

    for (const folder of folders) {
        const folderPath = path.join(config.source, folder);
        const stats = fs.statSync(folderPath);

        // Only process subfolders matching the regex
        if (stats.isDirectory() && regex.test(folder)) {
            const files = fs.readdirSync(folderPath);

            for (const file of files) {
                const filePath = path.join(folderPath, file);
                const fileStats = fs.statSync(filePath);

                if (fileStats.isFile()) {
                    const creationDate = fileStats.birthtime;
                    const year = creationDate.getFullYear();
                    const month = String(creationDate.getMonth() + 1).padStart(2, '0');
                    const day = String(creationDate.getDate()).padStart(2, '0');
                    const yearFolder = path.join(config.target, `${year}`);
                    const dateFolder = path.join(yearFolder, `${year}-${month}-${day}`);

                    // Create the year-based subfolder if it doesn't exist
                    if (!config.dryrun && !fs.existsSync(yearFolder)) {
                        fs.mkdirSync(yearFolder, { recursive: true });
                    }

                    // Create the date-based subfolder if it doesn't exist
                    if (!config.dryrun && !fs.existsSync(dateFolder)) {
                        fs.mkdirSync(dateFolder, { recursive: true });
                    }

                    // Copy the file to the date-based subfolder
                    const targetFilePath = path.join(dateFolder, file);
                    if (!config.dryrun) {
                        fs.copyFileSync(filePath, targetFilePath);
                    }
                    console.log(`Copied ${file} to ${dateFolder}`);
                }
            }
        }
    }
}

const configSchema = z.object({
    source: z.string().min(1, "source cannot be empty"),
    regex: z.string().min(1, "regex cannot be empty"),
    target: z.string().min(1, "target cannot be empty"),
    dryrun: z.boolean().optional()
});

const description =
`Import all photos from an SD card to local storage partitioned by year then date.

For example, consider the command "script-sd-import -p ricoh" with:

    source: "/Volumes/RICOH GR/DCIM"
    target: "/Users/fred/Photos"
    regex:  "\\d+RICOH"

After the copy the copied image file will be placed in a folder partitioned by
the creation time of your image, ordered by its name (usually sequential.)

For example:

    "~/Photos/2025/2025-04-20/R0001234.DNG"

NOTE: Edit "scripts/.mjs-config/script-sd-import.json" to change or extend your 
      profiles.
`;

async function processOptions() {
    program
        .name('sdimport')
        .description(`${description}`)
        .version('1.0.0')
        .option('-d, --dryrun', 'Non-destructive run, listing files only', false)
        .option('-p, --profile <string>', 'Profile key to pull configuration, "leica" or "ricoh"')
        .option('-s, --source <string>', 'Source folder on SD card, eg: "/Volumes/LEICA DSC/DCIM"')
        .option('-r, --regex <string>', 'Image sub-folder regex on SD card, eg: "\\d+LEICA"')
        .option('-t, --target <string', 'Target folder on local storage, eg: "/Volumes/V1/Photos"')
        ;

    program.parse(process.argv);
    const options = program.opts();
    console.log('dryrun: ', options.dryrun);
    console.log('profile: ', options.profile);
    console.log('source: ', options.source);
    console.log('regex: ', options.regex);
    console.log('target: ', options.target);
}
async function main() {
    // process command line options
    await processOptions();

    // Load, Merge, and Validate Configuration file
    const config = await loadConfig('script-sd-import', import.meta.url, program, configSchema);

    importFiles(config);
}

if (process.env.VITEST === undefined) {
    main().catch((error) => {
        console.error('An error occurred:', error.message);
        process.exit(1);
    });
  }
