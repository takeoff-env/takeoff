import { Chalk } from 'chalk';
import { Task } from './task';

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

  workingDir?: string;

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
