import chalk from 'chalk';
import requireFromString from 'require-from-string';
import { TakeoffParserOptions, When } from 'takeoff';
import { Task } from 'task';

import readFile from './read-takeoff-file';
import executeTask from './run-task';

function checkTypes(task: any, types: string[]) {
  return types.some(type => type === task.type);
}

const handleError = (task: Task, err: Error) => {
  throw new Error(`Task '${task.name}' failed.\n${err.stack}`);
};

export = (opts: TakeoffParserOptions, shell: any): (taskName?: string) => Promise<void> => {
  const takeoffFile = readFile(opts);

  if (!takeoffFile) {
    throw new Error('No takeoff.md file was found.');
  }

  const createTaskPromise = async (task: Task) => {
    return new Promise((resolve, reject) => {
      if (checkTypes(task, ['sh', 'bash'])) {
        return executeTask(shell, opts, {
          cwd: opts.cwd,
          reject,
          resolve,
          task,
        });
      }

      if (checkTypes(task, ['js', 'javascript'])) {
        let res;
        try {
          res = requireFromString(task.script, takeoffFile.filepath);
        } catch (err) {
          return handleError(task, err);
        }
        res = res.default || res;
        return resolve(typeof res === 'function' ? Promise.resolve(res()).catch(e => handleError(task, e)) : res);
      }

      return resolve();
    });
  };

  const runTasks = async (taskNames: string[], inParallel?: boolean) => {
    if (!taskNames || taskNames.length === 0) {
      return;
    }

    if (inParallel) {
      await Promise.all(
        taskNames.map(taskName => {
          return runTask(taskName);
        }),
      );
    } else {
      for (const taskName of taskNames) {
        await runTask(taskName);
      }
    }
  };

  const runTaskHooks = async (task: Task, when: string) => {
    const prefix: When = when === 'before' ? 'pre' : 'post';

    const tasks = takeoffFile.tasks.filter(({ name }: Task) => name === `${prefix}:${task.name}`);

    await runTasks(tasks.map((t: Task) => t.name));

    for (const item of task[when]) {
      const { taskNames, inParallel }: any = item;
      await runTasks(taskNames, inParallel);
    }
  };

  const runTask = async (taskName: string, throwWhenNoMatchedTask = true) => {
    const task = !taskName
      ? takeoffFile.tasks[0]
      : takeoffFile && takeoffFile.tasks.find((t: any) => t.name === taskName);

    if (!task) {
      if (throwWhenNoMatchedTask) {
        throw new Error(`${chalk.red('[Takeoff]')} No task called "${taskName}" was found. Stop.`);
      } else {
        return;
      }
    }

    shell.echo(`${chalk.magenta('[Takeoff]')} Running task ${chalk.whiteBright(task.name)}`);

    // Start running task
    await runTaskHooks(task, 'before');
    await createTaskPromise(task);
    await runTaskHooks(task, 'after');
  };

  return async (taskName: string): Promise<void> => {
    await runTask('beforeAll', false);
    await runTask(taskName);
    await runTask('afterAll', false);
  };
};
