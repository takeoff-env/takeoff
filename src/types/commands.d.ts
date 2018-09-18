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

/**
 * A CommandResult is what all commands in Takeoff must return.
 */
export interface CommandResult {
  /**
   * The code to exit with (0 for no error, >=1 for errors)
   */
  code: number;
  /**
   * Any extra text to display (such as stdout, stderr, or an Error)
   */
  extra?: string;
  /**
   * String to display when errorcode !== 0
   */
  fail?: string;
    /**
   * String to display when errorcode === 0
   */
  success?: string;
}

/**
 * The definition of a Takeoff command. 
 */
export interface TakeoffCommand {

  /**
   * The arguments that can be passed to the command
   */
  args?: string;

  /**
   * The command name
   */
  command: string;

  /**
   * Description of what the command does
   */
  description: string;
  
  /**
   * The group the command belongs to
   */
  group: string;

  /**
   * Any options that can be passed to the command
   */
  options?: CommandOption[];

  /**
   * Skip checking for a `.takeoffrc` file, allows the command to be run
   * anywhere
   */
  skipRcCheck?: boolean;

  /**
   * The method called when the command is run. The method must return
   * a `CommandResult` or `Promise<CommandResult>`
   */
  handler: () => CommandResult | Promise<CommandResult>;
}
