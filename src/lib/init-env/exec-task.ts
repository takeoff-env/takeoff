/**
 * Task runner taken from Maid (https://github.com/egoist/maid) under MIT licence
 */
import chalk from 'chalk';
import path from 'path';
import { TaskRunnerOptions } from 'task';

/**
 * Method called with a script from a task.  Triggers the task and waits for the result to come back
 */
export = (
  shell: any,
  silent: boolean,
  { task, resolve, reject, cwd }: TaskRunnerOptions,
): Promise<void | Error> => {
  const run = shell.exec(`${task.script}`, {
    cwd,
    env: {
      ...process.env,
      PATH: `${path.resolve('node_modules/.bin')}:${process.env.PATH}`,
    },
    silent,
  });
  if (run.code !== 0) {
    return reject(new Error(`${chalk.red('[Takeoff]')} Task "${task.name}" exited with code ${run.code}`));
  }
  return resolve();
};
