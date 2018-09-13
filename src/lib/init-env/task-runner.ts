import requireFromString from 'require-from-string';
import { TakeoffCmdParameters, TakeoffFileData, When } from 'takeoff';
import { Task } from 'task';

import readFile from './read-takeoff-file';
import executeTask from './run-task';

function checkTypes(task: any, types: string[]) {
  return types.some(type => type === task.type);
}

const handleError = (task: Task, err: Error) => {
  throw new Error(`Task '${task.name}' failed.\n${err.stack}`);
};

export = ({
  silent,
  shell,
  printMessage,
  opts,
  workingDir,
}: Partial<TakeoffCmdParameters>): ((taskName?: string, projectDirectory?: string) => Promise<void>) => {
  const createTaskPromise = async (task: Task, takeoffFile: TakeoffFileData, cwd: string) => {
    return new Promise((resolve, reject) => {
      if (checkTypes(task, ['sh', 'bash'])) {
        return executeTask(shell, opts, silent, {
          cwd,
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

  const runTasks = async (
    taskNames: string[],
    takeoffFile: TakeoffFileData,
    projectDirectory: string,
    inParallel?: boolean,
  ) => {
    if (!taskNames || taskNames.length === 0) {
      return;
    }

    if (inParallel) {
      await Promise.all(
        taskNames.map(taskName => {
          return runTask(taskName, takeoffFile, projectDirectory);
        }),
      );
    } else {
      for (const taskName of taskNames) {
        await runTask(taskName, takeoffFile, projectDirectory);
      }
    }
  };

  const runTaskHooks = async (task: Task, when: string, takeoffFile: TakeoffFileData, projectDirectory: string) => {
    const prefix: When = when === 'before' ? 'pre' : 'post';

    const tasks = takeoffFile.tasks.filter(({ name }: Task) => name === `${prefix}:${task.name}`);

    await runTasks(tasks.map((t: Task) => t.name), takeoffFile, projectDirectory);

    for (const item of task[when]) {
      const { taskNames, inParallel }: any = item;
      await runTasks(taskNames, takeoffFile, projectDirectory, inParallel);
    }
  };

  const runTask = async (
    taskName: string,
    takeoffFile: TakeoffFileData,
    projectDirectory: string,
    throwWhenNoMatchedTask = true,
  ) => {
    const task = !taskName
      ? takeoffFile.tasks[0]
      : takeoffFile && takeoffFile.tasks.find((t: any) => t.name === taskName);

    if (!task) {
      if (throwWhenNoMatchedTask) {
        throw new Error(`No task called "${taskName}" was found. Stopping.`);
      } else {
        return;
      }
    }

    printMessage(`Running task: ${task.name}`);

    // Start running task
    await runTaskHooks(task, 'before', takeoffFile, projectDirectory);
    await createTaskPromise(task, takeoffFile, projectDirectory);
    await runTaskHooks(task, 'after', takeoffFile, projectDirectory);
  };

  return async (taskName?: string, projectDirectory?: string): Promise<void> => {
    const takeoffFile = readFile(projectDirectory || workingDir);

    if (!takeoffFile) {
      throw new Error('No takeoff.md file was found.');
    }

    await runTask('beforeAll', takeoffFile, projectDirectory, false);
    await runTask(taskName, takeoffFile, projectDirectory);
    await runTask('afterAll', takeoffFile, projectDirectory, false);
  };
};
