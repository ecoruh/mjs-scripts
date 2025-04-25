import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

/**
 * Given a folder returns a list of files tagged by a Finder tag.
 * @param {string} folderPath - The folder to scan files
 * @param {string} tag - A Finder tag to search (g. 'Green')
 * @returns {[string]} A list of tagged files
 */
export function getTaggedFiles(folderPath, tag) {
  const files = fs.readdirSync(folderPath);
  return files.filter((file) => {
      const filePath = path.join(folderPath, file);
      try {
          const escapedPath = escapeShellArg(filePath);
          const result = execSync(`mdls -name kMDItemUserTags ${escapedPath}`, { encoding: 'utf8' });
          return result.includes(tag);
      } catch (error) {
          console.error(error);
          // Skip files that cause errors (e.g., not valid for mdls)
          return false;
      }
  });
}
