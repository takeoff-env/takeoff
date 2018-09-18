import { TakeoffCmdParameters, TakeoffFileData, When } from 'takeoff';
import { ExitCode, Task } from 'task';

import readTakeoffFile from './read-takeoff-file';
import createTaskPromise from './task-runner/create-task-promise';

export = ({
  silent,
  printMessage,
  exitWithMessage,
  workingDir,
}: Partial<TakeoffCmdParameters>): ((taskName?: string, projectDirectory?: string) => Promise<void>) => {

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
        throw exitWithMessage({ fail: `No task called "${taskName}" was found. Stopping.`, code: ExitCode.Error });
      } else {
        return;
      }
    }

    printMessage(`Running task: ${task.name}`);

    // Start running task
    await runTaskHooks(task, 'before', takeoffFile, projectDirectory);
    await createTaskPromise(task, takeoffFile, projectDirectory, silent);
    await runTaskHooks(task, 'after', takeoffFile, projectDirectory);
  };

  return async (taskName?: string, projectDirectory?: string): Promise<void> => {
    const takeoffFile = readTakeoffFile(projectDirectory || workingDir);

    if (!takeoffFile.exists) {
      throw exitWithMessage({ fail: 'No takeoff.md file was found. Stopping.', code: ExitCode.Error });
    }

    await runTask('beforeAll', takeoffFile, projectDirectory, false);
    await runTask(taskName, takeoffFile, projectDirectory);
    await runTask('afterAll', takeoffFile, projectDirectory, false);
  };
};
