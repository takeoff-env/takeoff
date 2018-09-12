import { Chalk } from 'chalk';
import { Task } from './task';

export interface TakeoffRcFile {
  exists: boolean;
  properties: { [key: string]: any };
  rcRoot: string;
}

/**
 * Options to be passed to the Takeoff Parser
 */
export interface TakeoffParserOptions {
  cwd: string;

  section?: string;
}

export interface TakeoffCmdParameters {
  command?: string;

  args?: string[];

  opts?: {
    [key: string]: string;
  };

  shell?: any;

  silent: boolean;

  workingDir?: string;

  rcFile: TakeoffRcFile;

  printMessage: (message: string, stdout?: any) => void;

  exitWithMessage: (message: string, code: number, stdout?: any) => void;
}

export interface ReadFileOptions {
  cwd: string;

  section?: string;
}

export type When = 'before' | 'after' | 'pre' | 'post';

export interface ParsedCommand {
  taskNames: string[];
  when: When;
  inParallel: boolean;
}

export interface TakeoffProject {
  projectName: string;

  version: string;
}

export interface TakeoffProjectApps {
  [key: string]: string[];
}

export interface TakeoffFileData {
  filepath: string;
  tasks: Task[];
}
