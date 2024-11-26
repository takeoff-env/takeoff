/**
 * Task runner taken from Maid (https://github.com/egoist/maid) under MIT licence
 */
import { TakeoffResult } from 'commands';
import path from 'path';
import shell, { ExecOutputReturnValue } from 'shelljs';
import { TaskRunnerOptions } from 'task';

/**
 * Method called with a script from a task.  Triggers the task and waits for the result to come back
 */
function execTask({ silent, task, cwd }: TaskRunnerOptions): Promise<TakeoffResult> {
  return new Promise((resolve, reject) => {
    const run = shell.exec(`${task.script}`, {
      cwd,
      env: {
        ...process.env,
        PATH: `${path.resolve('node_modules/.bin')}:${process.env.PATH}`,
      },
      silent,
    }) as ExecOutputReturnValue;

    if (run.code !== 0) {
      return reject({
        code: run.code,
        extra: run.stderr,
        fail: `Task "${task.name}" exited with code ${run.code}`,
      });
    }
    return resolve({
      code: run.code,
      extra: run.stdout,
      success: `Task "${task.name}" ran successfully`,
    });
  });
}

export = execTask;
