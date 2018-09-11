import { ParsedArgs } from 'minimist';
import { ExtractedArgs, IntermediateArgs } from 'arguments';

export = ({ _: [command, ...args], ...opts }: ParsedArgs): ExtractedArgs => ({
  command,
  args,
  opts: Object.keys(opts)
    .map((key: string) => [key, opts[key]])
    .reduce(
      (newArgs: ExtractedArgs, v: IntermediateArgs) =>
        (newArgs[v[0]] = v[1]) && newArgs,
      {},
    ),
});
