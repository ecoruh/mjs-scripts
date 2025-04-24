// my-utility-scripts/vitest.workspace.js
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'scripts/*', // Tells Vitest to treat each directory in 'scripts/' as a separate project
  // You could add other projects here if needed, e.g., 'packages/*'
]);