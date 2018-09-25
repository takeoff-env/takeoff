import { promisify } from 'util';
import { mkdir, copyFile } from 'fs';

const mkdirAsync = promisify(mkdir);
const copyFileAsync = promisify(copyFile);

const DEFAULT_FOLDERS = ['blueprints', 'projects', 'commands', '@types'];

const DEFAULT_COPY_FILES = ['.takeoffrc.json', 'package.json', '@types/index.d.ts'];

export = async (basePath: string): Promise<void> => {
  // Create base directory
  try {
    await mkdirAsync(basePath);
  } catch (e) {
    throw e;
  }

  // Create folders
  const folders = DEFAULT_FOLDERS.map(folder => `${basePath}/${folder}`);
  for (const folder in folders) {
    try {
      await mkdirAsync(`${basePath}/${folder}`);
    } catch (e) {
      throw e;
    }
  }

  // Copy default files
  for (const file in DEFAULT_COPY_FILES) {
    try {
      await copyFileAsync(`${__dirname}/templates/${file}`, `${basePath}/${file}`);
    } catch (e) {
      throw e;
    }
  }
};
