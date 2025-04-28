// mjs-lib/configLoader.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZodSchema } from 'zod'; // Import ZodSchema type for better hinting

// --- Configuration ---
const CONFIG_DIR_NAME = '.mjs-config'; // Hidden directory name

// --- Helper Function ---
// Finds the root 'scripts' directory based on the calling script's location
function findScriptsDir(scriptUrl) {
  let currentDir = path.dirname(fileURLToPath(scriptUrl));
  // Traverse up until we find a directory containing 'mjs-lib' (or other marker)
  // Adjust this logic based on your reliable project structure identifiers
  while (currentDir !== path.parse(currentDir).root) {
    // A simple check: does 'scripts' exist at this level?
    if (path.basename(currentDir) === 'scripts') {
        return currentDir;
    }
    // Or check if parent contains 'scripts' and 'mjs-lib'? Adapt as needed.
    currentDir = path.dirname(currentDir);
  }
  throw new Error("Could not reliably determine the 'scripts' directory. Adjust findScriptsDir logic.");
}

/**
 * Loads configuration for a script, merging file profiles and CLI options.
 * CLI options supersedes profiles if -p is provided.
 *
 * @param {string} scriptName - The base name of the script (e.g., 'script-a').
 * @param {string} callingScriptUrl - The import.meta.url of the script calling this function.
 * @param {object} program - The commander program object
 * @param {ZodSchema} configSchema - The Zod schema defining the expected config structure.
 * @returns {Promise<object>} - A promise resolving to the validated, merged configuration object.
 * @throws {Error} - Throws if validation fails or critical errors occur.
 */
async function loadConfig(scriptName, callingScriptUrl, program, configSchema) {
  if (!scriptName || !callingScriptUrl || !program || !configSchema) {
      throw new Error("loadConfig requires scriptName, callingScriptUrl, commanderOptions, and configSchema.");
  }

  const scriptsDir = findScriptsDir(callingScriptUrl); // Find the base 'scripts' directory
  const configDir = path.join(scriptsDir, CONFIG_DIR_NAME);
  const configFileName = `${scriptName}.json`;
  const configFilePath = path.join(configDir, configFileName);

  let rawConfigFromFile = {};
  let profileConfig = {};

  // 1. Read and parse config file if it exists
  try {
    const fileContent = await fs.readFile(configFilePath, 'utf-8');
    rawConfigFromFile = JSON.parse(fileContent);
    console.debug(`Loaded config file: ${configFilePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.debug(`Optional config file not found: ${configFilePath}`);
    } else {
      // Log warning for other errors (permissions, malformed JSON) but continue
      console.warn(`Warning: Could not read or parse config file ${configFilePath}. ${error.message}`);
    }
  }

  const commanderOptions = program.opts(); // Still useful for the raw values

  // 2. Select profile if specified via CLI option '-p' or '--profile'
  const profileName = commanderOptions.profile; // Assumes commander option is named 'profile'
  if (profileName) {
    if (rawConfigFromFile[profileName]) {
      profileConfig = rawConfigFromFile[profileName];
      console.debug(`Using profile "${profileName}" from config file.`);
    } else if (Object.keys(rawConfigFromFile).length > 0) {
      // Only warn if the file existed but the profile didn't
      console.warn(`Warning: Profile "${profileName}" not found in ${configFilePath}.`);
    }
  }

  // 3. Merge: CLI options override profile options
  const mergedConfig = {};

  if (configSchema && typeof configSchema.shape === 'object' && configSchema.shape !== null) {
      const schemaKeys = Object.keys(configSchema.shape);

      for (const key of schemaKeys) {
          const cliSource = program.getOptionValueSource(key);
          const cliValue = commanderOptions[key];
          const profileValue = profileConfig[key];

          if (cliSource === 'cli') {
              // Explicit CLI value always wins
              mergedConfig[key] = cliValue;
              if (profileValue !== undefined) {
                  console.debug(`CLI option --${key} (explicitly set) overrides profile value.`);
              }
          } else if (profileValue !== undefined) {
              // Profile value wins if no explicit CLI arg
              mergedConfig[key] = profileValue;
          } else if (cliValue !== undefined) {
               // Use Commander default only if no explicit CLI and no profile value
               mergedConfig[key] = cliValue;
               console.debug(`Using default value for ${key} from Commander.`);
          }
          // If none of the above, the key remains undefined in mergedConfig (unless handled by Zod default later)
      }
  } else {
      // Handle schema shape issue
      console.warn("Warning: configSchema shape not available for precise merging.");
      // Fallback: basic merge (original problematic behavior)
      Object.assign(mergedConfig, profileConfig, commanderOptions);
      delete mergedConfig.profile; // Ensure profile key isn't included
  }

  console.debug("Merged Configuration (before validation):", mergedConfig);

  // 4. Validate the *merged* configuration against the Zod schema
  const validationResult = configSchema.safeParse(mergedConfig);

  if (!validationResult.success) {
    console.error(`\nError: Configuration validation failed for script "${scriptName}":`);
    validationResult.error.errors.forEach(err => {
      const path = err.path.join('.');
      console.error(`  - Option "${path}": ${err.message}`);
    });
    console.error("\nPlease check your command line options and/or the config file profile.");
    process.exit(1); // Exit on validation failure
  }

  console.debug("Validated Configuration:", validationResult.data);
  return validationResult.data; // Return the validated (and potentially transformed) config data  
}

export { loadConfig };