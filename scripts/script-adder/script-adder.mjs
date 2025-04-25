#!/usr/bin/env node
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

let params = {};
async function processOptions() {
    program
        .name('script-adder')
        .description(`Boiler plate calculator app to add two numbers`)
        .version('1.0.0')
        .argument('<salutation>', 'An argument')
        .option('-v, --verbose', 'Verbose mode')
        .option('-n, --name <string>', 'Your name', 'Fred')
        .requiredOption('-o, --one <number>', 'The first operand', parseInt)
        .requiredOption('-t, --two <number>', 'The second operand', parseInt)
        .action((salutation, options) => {
            if (options.verbose) {
                console.log('Salutation: ', salutation);
                console.log('Name: ', options.name);
                console.log('Operand 1: ', options.one);
                console.log('Operand 2: ', options.two);
            }
            params = {salutation, ...options};
        });

    program.parse();
}

async function main() {

    await processOptions();
    const result = add (params.one, params.two);
    if (params.verbose) {
        console.log(`${params.salutation} ${params.name}`);
        console.log('Calculated adding numbers as follows:');
        if (params.verbose) {
            process.stdout.write(`${params.one} + ${params.two} = `);
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
