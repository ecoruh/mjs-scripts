// scripts/script-a/script-a.test.mjs
import { describe, it, expect, vi} from 'vitest';

import fs from 'fs';
import {trasher} from './script-culler';

vi.mock('fs');
const mockedFs = fs;
const mockFiles = ['F1.DNG', 'F1.JPG', 'F1.PDF', 'F2.DNG', 'F2.JPG'];

describe('trasher test with Green F2.JPG', () => {
  mockedFs.readdirSync.mockReturnValue(mockFiles);

  const folderPath  = 'fake/folder';
  let result = trasher(folderPath,['F2.JPG'], 'JPG', 'DNG');
  it('Should call readdirSync function', () => {
    expect(mockedFs.readdirSync).toHaveBeenCalledWith(folderPath);
  });
  it('should verify returned list has all F1s', () => {
    expect(result).toEqual(['fake/folder/F1.DNG', 'fake/folder/F1.JPG']);
  });
});

describe('trasher test with Green F2.DNG', () => {
  mockedFs.readdirSync.mockReturnValue(mockFiles);

  const folderPath  = 'fake/folder';
  let result = trasher(folderPath,['F2.JPG'], 'JPG', 'DNG');
  it('Should call readdirSync function', () => {
    expect(mockedFs.readdirSync).toHaveBeenCalledWith(folderPath);
  });
  it('should verify returned list has all F1s', () => {
    expect(result).toEqual(['fake/folder/F1.DNG', 'fake/folder/F1.JPG']);
  });
});

describe('trasher test with Green F1.PDF', () => {
  mockedFs.readdirSync.mockReturnValue(mockFiles);

  const folderPath  = 'fake/folder';
  let result = trasher(folderPath,['F1.PDF'], 'JPG', 'DNG');
  it('Should call readdirSync function', () => {
    expect(mockedFs.readdirSync).toHaveBeenCalledWith(folderPath);
  });
  it('should verify returned list has all image files', () => {
    expect(result).toEqual(['fake/folder/F1.DNG', 'fake/folder/F1.JPG','fake/folder/F2.DNG', 'fake/folder/F2.JPG']);
  });
});

// Assuming script-a.mjs exports a function or has side effects to test
// For command-line scripts, you might test exported functions directly,
// or use tools to spawn the script as a process and check its output/exit code.

// Example 1: Testing an exported function (if you refactor script-a.mjs)
// import { someFunctionFromScriptA } from './script-a.mjs';
// describe('someFunctionFromScriptA', () => {
//   it('should return the correct value', () => {
//     expect(someFunctionFromScriptA('input')).toBe('expected output');
//   });
// });

// Example 2: Placeholder test
// describe('Script A basic tests', () => {
//   it('should pass a simple check', () => {
//     expect(1 + 1).toBe(2);
//   });

//   it('should handle strings', () => {
//     const message = 'hello';
//     expect(message).toEqual('hello');
//   });
// });

// Example 3: Testing command execution (More advanced)
// import { execSync } from 'child_process';
// import { resolve } from 'path';
// describe('script-a command execution', () => {
//   it('should run without errors and output expected text', () => {
//     const scriptPath = resolve(__dirname, './script-a.mjs');
//     // Note: Ensure scriptPath is correct and script has execute permissions
//     // Using execSync for simplicity, async execution might be better
//     const output = execSync(`node ${scriptPath} --some-arg`, { encoding: 'utf8' });
//     expect(output).toContain('Expected output snippet');
//   });
// });