import { TakeoffResult } from 'commands';
import requireFromString from 'require-from-string';
import { TakeoffFileData } from 'takeoff';
import { ExitCode, Task } from 'task';

import execTask from './exec-command';

function checkTypes(task: any, types: string[]) {
  return types.some(type => type === task.type);
}

interface AsyncTask {
  task: Task;
  takeoffFile: TakeoffFileData;
  cwd: string;
  silent: boolean;
  success: string;
  fail: string;
}

/**
 * This method takes a `Task` and options and passes them to a task to be executed
 */
async function runTaskTypeAsync({ task, takeoffFile, cwd, silent, success, fail }: AsyncTask): Promise<TakeoffResult> {
  if (checkTypes(task, ['sh', 'bash'])) {
    return await execTask({ cwd, silent, task, success, fail });
  }

  if (checkTypes(task, ['js', 'javascript'])) {
    const result: TakeoffResult = {
      code: 0,
      fail: `Javascript task ${task.name} failed to run`,
      success: `Javascript task ${task.name} ran successfully`,
    };
    return new Promise<TakeoffResult>(async (resolve, reject) => {
      let res;
      try {
        res = requireFromString(task.script, takeoffFile.filepath);
      } catch (e) {
        result.code = ExitCode.Error;
        result.extra = e;
        return reject(result);
      }
      res = res.default || res;

      try {
        const runResult = await Promise.resolve(res());
        result.extra = runResult;
        return resolve(result);
      } catch (e) {
        result.code = ExitCode.Error;
        result.extra = e;
        return reject(result);
      }
    });
  }
}

export = runTaskTypeAsync;
