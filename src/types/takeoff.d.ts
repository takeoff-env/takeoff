import { Chalk } from 'chalk';
import { Task } from './task';
import { CommandResult } from '@takeoff/takeoff/types/commands';

/**
 * A Object containing the results of a `.takeoffrc` file
 */
export interface TakeoffRcFile {
  /**
   * If the file exists or not
   */
  exists: boolean;

  /**
   * A key/value map of properties read from the takeoff file
   */
  properties: Map<string, any>;

  /**
   * The folder location of the file
   */
  rcRoot: string;
}

/**
 * Internal interface to wrap chalk with an index
 */
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

/**
 * Options to be passed to the print message methods
 */
export interface PrintMessageOptions {
  /**
   * The text to display in the header
   */
  header?: string;

  /**
   * The spacer to use between the header and the display text
   */
  spacer?: string;

  /**
   * The colour of the header, see npm module `chalk` for available colours
   */
  headerColour?: string;

  /**
   * The colour of the text, see npm module `chalk` for available colours
   */
  textColour?: string;
}

/**
 * These are the parameters injected into a Takeoff command.
 */
export interface TakeoffCmdParameters {
  /**
   * The current command being run
   */
  command?: string;

  /**
   * Any arguments passed to the command
   */
  args?: string[];

  /**
   * Any options passed to the command
   */
  opts?: {
    [key: string]: string;
  };

  /**
   * An instance of `shelljs` as a helper
   */
  shell?: any;

  /**
   * If the command is silence or verbose, default is true
   */
  silent: boolean;

  /**
   * The directory the command was run in
   */
  workingDir?: string;

  /**
   * The RC file for the workspace
   */
  rcFile: TakeoffRcFile;

  fileExists: (path: string) => boolean;

  getProjectDetails: (
    args: string[],
    workingDir: string,
    rcFile: TakeoffRcFile,
  ) => {
    apps: string[];
    project: string;
    projectDir: string;
  };

  /**
   * Helper method to run a command
   */
  runCommand: (cmd: string, cwd?: string, disableSilent?: boolean) => any;

  /**
   * Helper method to check if a path exists
   */
  pathExists: (path: string) => boolean;

  /**
   * Helper Method to print a message to the console
   */
  printMessage: (message: string, stdout?: any, options?: PrintMessageOptions) => void;

  /**
   * Helper method to exit the application
   */
  exitWithMessage: (commandResult: CommandResult) => void;
}

/**
 * Options passed to read file
 */
export interface ReadFileOptions {
  cwd: string;

  section?: string;
}

/**
 * Type for the stages supported in tasks
 */
export type When = 'before' | 'after' | 'pre' | 'post';

/**
 * A parsed command from the `takeoff.md file`
 */
export interface ParsedCommand {
  /**
   * Names of the tasks
   */
  taskNames: string[];

  /**
   * The stage of where the tasks is run
   */
  when: When;

  /**
   * If the task is run in parallel
   */
  inParallel: boolean;
}

/**
 * A takeoff project
 */
export interface TakeoffProject {
  /**
   * Name of the project from the package.json
   */
  projectName: string;

  /**
   * Version of the project from the package.json
   */
  version: string;
}

/**
 * Apps container in a proejct
 */
export interface TakeoffProjectApps {
  [key: string]: string[];
}

/**
 * The details of a `takeoff.md` file
 */
export interface TakeoffFileData {
  exists: boolean;
  /**
   * Path to the file
   */
  filepath: string;

  /**
   * The tasks contained within the file
   */
  tasks: Task[];
}

export interface TakeoffCommandRequest {
  app: string;
  cmd: string;
}
