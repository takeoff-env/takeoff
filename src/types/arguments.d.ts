/**
 * Intermediate argument type for converting to {ExtractedArgs}
 */
export type IntermediateArgs = [string, string];

/**
 * A dictionary of arguments
 */
export interface ArgumentOptions {
  [key: string]: string;
}

/**
 * Extracted arguments from the process.argv. Contains the command
 * and arguments and any -x or --foo options passed
 */
export interface ExtractedArgs {
  command: string;

  args: string[];

  opts: ArgumentOptions;

  [key: string]: string | string[] | ArgumentOptions;
}
