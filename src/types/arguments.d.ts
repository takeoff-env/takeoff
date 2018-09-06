/**
 * Intermediate argument type for converting to {ExtractedArgs}
 */
type IntermediateArgs = [string, string];

interface ArgumentOptions {
  [key: string]: string;
}

/**
 * Extracted arguments from the process.argv. Contains the command
 * and arguments and any -x or --foo options passed
 */
interface ExtractedArgs {
  command: string;

  args: string[];

  opts: ArgumentOptions;

  [key: string]: string | string[] | ArgumentOptions;
}
