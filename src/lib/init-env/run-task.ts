/**
 * Task runner taken from Maid (https://github.com/egoist/maid) under MIT licence
 */

import path from 'path';

export = (shell: any, opts: any, { task, type = task.type, resolve, reject, cwd }: TaskRunnerOptions): void => {

  const run = shell.exec(`${task.script}`, {
    slient: opts.v ? false : true,
    cwd,
    env: {
      ...process.env,
      PATH: `${path.resolve('node_modules/.bin')}:${process.env.PATH}`
    }
  });
  if (run.code !== 0) {
    reject(new Error(`Task "${task.name}" exited with code ${run.code}`));
  }

  resolve();
};
