import { Chalk } from 'chalk';
import { Task, TaskRunnerOptions } from './task';
import { TakeoffResult } from './commands';
import { ExecOutputReturnValue } from 'shelljs';

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
