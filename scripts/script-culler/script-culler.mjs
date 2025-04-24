#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import trash from 'trash';
import { program } from 'commander';
import { getTaggedFiles } from '../mjs-lib/finder-util.mjs';

function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase());
        });
    });
}

export function trasher(folderPath, greenFiles, jpegExt = 'JPG', rawExt = 'DNG') {
    const filesToKeep = greenFiles.flatMap((file) => [
      file,
      file.replace( jpegExt, rawExt),
      file.replace( rawExt, jpegExt)
     ]);

    const allFiles = fs.readdirSync(folderPath);
    const extensions = [`${jpegExt}`, `${rawExt}`];
    const pattern = `\\.(${extensions.join('|')})$`;
    const extensionRegex = new RegExp(pattern, 'i');

    const filesToTrash = allFiles.filter((file) =>
        !filesToKeep.includes(file) && extensionRegex.test(file)
    ).map((file) => path.join(folderPath, file));

    return filesToTrash;
  }


const description =
`Script to cull image files imported from a camera based on a Mac Finder tag.
This allows large number of poor image files culled after previewing on Finder.

When a jpeg or a raw file is tagged, other similar files will be put to
Mac's Bin. Other file types will be unaffacted.

Default jpeg and raw file extensions are set to 'JPG' and 'DNG' respectively.
But that can be changed via command line options (see --help)
`;


let params = {};
async function processOptions() {
    program
        .name('script-culler')
        .description(`${description}`)
        .version('1.0.0')
        .argument('<folder>', 'Path to the image folder')
        .option('-d, --dryrun', 'Non-destructive run, listing files only')
        .option('-j, --jpeg <string>', 'JPEG file extension, case sensitive', 'JPG')
        .option('-r, --raw <string>', 'RAW file extension, case sensitive', 'DNG')
        .option('-t, --tag <string>', 'One of Green (default), Blue, Orange, Red, Purple, Grey, Yellow', 'Green')
        .action((folder, options) => {
            console.log('folder: ', folder);
            console.log('dry-run: ', options.dryrun);
            params = {folder, ...options};
        });

    program.parse();
}

async function main() {

    await processOptions();
    console.log('Captured: ', params);

    const folderPath = params.folder;

    if (!folderPath) {
        console.error('Error: Please provide a folder as an argument.');
        process.exit(1);
    }

    if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
        console.error('Error: The provided folder argument is not a valid folder.');
        process.exit(1);
    }

    const pattern = `^Green|Blue|Orange|Red|Purple,Grey,Yellow$`;
    const tagRegex = new RegExp(pattern);

    if (!params.tag || !tagRegex.test(params.tag)) {
        console.error(`Error: --tag must be set to of 'Green, Blue, Orange, Red, Purple, Grey, Yellow'`);
        process.exit(1);
    }
    const greenFiles = getTaggedFiles(folderPath, params.tag);

    if (greenFiles.length === 0) {
        console.error(`No files with the ${params.tag} tag were found. Aborting.`);
        process.exit(1);
    }

    console.log('Files with Green tag:');
    greenFiles.forEach((file) => console.log(`- ${file}`));

    const proceed = await promptUser('Do you want to proceed and clean up non-Green files? (y/n): ');
    if (proceed !== 'y') {
        console.log('Aborting operation.');
        process.exit(0);
    }

    const filesToTrash = trasher(folderPath, greenFiles);

    if (filesToTrash.length > 0) {
        if (!params.dryrun) {
            await trash(filesToTrash);
        }
        console.log('Moved to Trash:', filesToTrash);
    }

    console.log('Cleanup complete.');
}

if (process.env.VITEST === undefined) {
    main().catch((error) => {
        console.error('An error occurred:', error.message);
        process.exit(1);
    });
}

