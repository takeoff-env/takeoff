import { TakeoffRcFile } from 'takeoff';

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

export interface CommandResult {
  cmd?: any;
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

  skipRcCheck?: boolean;

  handler: () => CommandResult | Promise<CommandResult>;
}
