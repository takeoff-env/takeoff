import { TakeoffHelpers, TakeoffFileData, When } from 'takeoff';
import { ExitCode, Task } from 'task';

import readTakeoffFile from './read-takeoff-file';
import runTaskTypeAsync from './task-runner/run-type-task-async';

export = ({
  silent,
  printMessage,
  exitWithMessage,
  workingDir,
}: Partial<TakeoffHelpers>): ((taskName?: string, cwd?: string) => Promise<void>) => {
  const runTasks = async (
    taskNames: string[],
    takeoffFile: TakeoffFileData,
    cwd: string,
    options: any,
    inParallel?: boolean,
  ) => {
    if (!taskNames || taskNames.length === 0) {
      return;
    }

    if (inParallel) {
      await Promise.all(
        taskNames.map(taskName => {
          return runTask(taskName, takeoffFile, cwd, options);
        }),
      );
    } else {
      for (const taskName of taskNames) {
        await runTask(taskName, takeoffFile, cwd, options);
      }
    }
  };

  const runTaskHooks = async (task: Task, when: string, takeoffFile: TakeoffFileData, cwd: string, options: any) => {
    const prefix: When = when === 'before' ? 'pre' : 'post';

    const tasks = takeoffFile.tasks.filter(({ name }: Task) => name === `${prefix}:${task.name}`);

    const taskNameDynamic = tasks.map((t: Task) => t.name);
    await runTasks(taskNameDynamic, takeoffFile, cwd, options);

    for (const item of task[when]) {
      const { taskNames, inParallel }: any = item;
      await runTasks(taskNames, takeoffFile, cwd, options, inParallel);
    }
  };

  const runTask = async (
    taskName: string,
    takeoffFile: TakeoffFileData,
    cwd: string,
    options: {
      success: string;
      fail: string;
    },
    throwWhenNoMatchedTask = false,
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
    await runTaskHooks(task, 'before', takeoffFile, cwd, options);
    await runTaskTypeAsync({ task, takeoffFile, cwd, silent, ...options });
    await runTaskHooks(task, 'after', takeoffFile, cwd, options);
  };

  return async (success: string, fail: string, taskName?: string, cwd?: string): Promise<void> => {
    const takeoffFile = readTakeoffFile(cwd || workingDir);

    if (!takeoffFile.exists) {
      throw exitWithMessage({ fail: 'No takeoff.md file was found. Stopping.', code: ExitCode.Error });
    }

    await runTask('beforeAll', takeoffFile, cwd, { success, fail }, false);
    await runTask(taskName, takeoffFile, cwd, { success, fail });
    await runTask('afterAll', takeoffFile, cwd, { success, fail }, false);
  };
};
