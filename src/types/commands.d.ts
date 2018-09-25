import { TakeoffRcFile } from 'takeoff';
import { TakeoffHelpers } from 'helpers';

/**
 * Plugin Options
 */
export interface CommandOption {
  /**
   * The name of the option
   */
  option: string;

  /**
   * The description of the option
   */
  description: string;
}

export interface TakeoffResult {
  extra?: any;
  code: number;
  fail?: string;
  success?: string;
}

/**
 * A takeoff command to be run
 */
export interface TakeoffCommand {
  command: string;

  description: string;

  options?: CommandOption[];

  args?: string;

  group?: string;

  global?: boolean;

  handler: (options: TakeoffHelpers) => Promise<TakeoffResult>;
}

/**
 * A takeoff command to be run
 */
export interface TakeoffHandler {
  handler: (options: TakeoffHelpers) => Promise<TakeoffResult>;
}
