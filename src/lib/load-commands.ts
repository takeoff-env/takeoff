import chalk from 'chalk';
import fg from 'fast-glob';
import { normalize } from 'path';

import { TakeoffCommand } from 'commands';
import { EntryItem } from 'fast-glob/out/types/entries';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

/**
 * Load plugins from the basePath. Will attempt to load both Typescript and JavaScript plugins
 * Returns a map of plugins with the key as the command and value as the plugin object
 */
export = async (cwdList: string[], params: TakeoffCmdParameters): Promise<Map<string, TakeoffCommand>> => {
  const commandMap: Map<string, TakeoffCommand> = new Map<string, TakeoffCommand>();

  for (const cwd of cwdList) {
    const commandPath = normalize(cwd);

    let commandPaths: EntryItem[] = [];
    try {
      commandPaths = await fg([`**/*.js`, `**/*.ts`], {
        cwd,
        ignore: [`**/*.spec.js`, `**/*spec.js`, `**/*.d.ts`],
      });
    } catch (e) {
      throw e;
    }

    commandPaths.forEach((path: string) => {
      const requirePath = `${commandPath}/${path}`;
      try {
        const plugin: TakeoffCommand = require(requirePath)(params);
        commandMap.set(`${plugin.group}:${plugin.command}`, plugin);
      } catch (e) {
        throw e;
      }
    });
  }
  return commandMap;
};
