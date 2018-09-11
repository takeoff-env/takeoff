import { ExtractedArgs, IntermediateArgs } from 'arguments';
import { ParsedArgs } from 'minimist';

export = ({ _: [command, ...args], ...opts }: ParsedArgs): ExtractedArgs => ({
  args,
  command,
  opts: Object.keys(opts)
    .map((key: string) => [key, opts[key]])
    .reduce((newArgs: ExtractedArgs, v: IntermediateArgs) => (newArgs[v[0]] = v[1]) && newArgs, {}),
});
