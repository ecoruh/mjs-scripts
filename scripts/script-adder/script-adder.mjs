#!/usr/bin/env node

////////////////////////////////////////////////////////////
// DO NOT EDIT, MEANT TO BE EXAMPLE, SIMPLY COPY AND EDIT //
////////////////////////////////////////////////////////////

import { program } from 'commander';

/**
 * Simple calculator that adds two numbers and return the result
 * @param {*} a - Operand one
 * @param {*} b - Operand two
 * @returns {number} Result of addition
 */
export function add(a, b) {
    return Number(a + b);
}

async function processOptions() {
    let _options;
    program
        .name('script-adder')
        .description(`Boiler plate calculator app to add two numbers`)
        .version('1.0.0')
        .argument('<salutation>', 'A mandatory salutation argument')
        .option('-v, --verbose', 'Verbose mode, try it')
        .option('-n, --name <string>', 'Your name', 'there')
        .requiredOption('-o, --one <number>', 'The first operand', parseInt)
        .requiredOption('-t, --two <number>', 'The second operand', parseInt)
        .action((salutation, options) => {
            if (options.verbose) {
                console.log('Salutation: ', salutation);
                console.log('Name: ', options.name);
                console.log('Operand 1: ', options.one);
                console.log('Operand 2: ', options.two);
            }
            _options = {salutation, ...options};
        });

    program.parse();
    return _options;
}

async function main() {

    const options = await processOptions();
    console.log(`${options.salutation} ${options.name}`);
    const result = add (options.one, options.two);
    if (options.verbose) {
        console.log('Calculated adding numbers as follows:');
        if (options.verbose) {
            process.stdout.write(`${options.one} + ${options.two} = `);
        }
    }
    console.log(result);
}

if (process.env.VITEST === undefined) {
  main().catch((error) => {
      console.error('An error occurred:', error.message);
      process.exit(1);
  });
}
