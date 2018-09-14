import { Chalk } from 'chalk';
import { Task } from './task';

export interface TakeoffRcFile {
  exists: boolean;
  properties: { [key: string]: any };
  rcRoot: string;
}

export interface ChalkWithIndex extends Chalk {
  [k: string]: any;
}

/**
 * Options to be passed to the Takeoff Parser
 */
export interface TakeoffParserOptions {
  cwd: string;

  section?: string;
}

export interface PrintMessageOptions {
  header?: string;
  spacer?: string;
  headerColour?: string;
  textColour?: string;
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

  runCommand: (cmd: string, cwd?: string, disableSilent?: boolean) => any;

  fileExists: (path: string) => boolean;

  pathExists: (path: string) => boolean;

  printMessage: (
    message: string,
    stdout?: any,
    options?: {
      headerColour?: string;
      textColour?: string;
    },
    header?: string,
    spacer?: string,
  ) => void;

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
  exists: boolean;
  filepath: string;
  tasks: Task[];
}

export interface TakeoffCommandRequest {
  app: string;
  cmd: string;
}
