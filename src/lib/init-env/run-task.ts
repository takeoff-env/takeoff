/**
 * Task runner taken from Maid (https://github.com/egoist/maid) under MIT licence
 */
import chalk from 'chalk';
import path from 'path';
import { TaskRunnerOptions } from 'task';

export = (shell: any, opts: any, silent: boolean, { task, resolve, reject, cwd }: TaskRunnerOptions): void => {
  const run = shell.exec(`${task.script}`, {
    cwd,
    env: {
      ...process.env,
      PATH: `${path.resolve('node_modules/.bin')}:${process.env.PATH}`,
    },
    silent
  });
  if (run.code !== 0) {
    return reject(new Error(`${chalk.red('[Takeoff]')} Task "${task.name}" exited with code ${run.code}`));
  }
  return resolve();
};
