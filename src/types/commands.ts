/**
 * Plugin Options
 */
interface CommandOption {
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
 * A takeoff command to be run
 */
interface TakeoffCommand {
  command: string;

  description: string;

  options?: CommandOption[];

  args?: string;

  group?: string;

  skipRcCheck?: boolean;

  handler: () => void | Promise<void>;
}
