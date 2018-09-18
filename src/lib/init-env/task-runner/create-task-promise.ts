import requireFromString from 'require-from-string';
import shell from 'shelljs';
import { TakeoffFileData } from 'takeoff';
import { ExitCode, Task } from 'task';

import exitWithMessage from '../../helpers/exit-with-message';
import execTask from './exec-task';

function checkTypes(task: any, types: string[]) {
  return types.some(type => type === task.type);
}

function handleError(task: Task, err: Error) {
  throw new Error(`Task '${task.name}' failed.\n${err.stack}`);
}

async function createTaskPromise(task: Task, takeoffFile: TakeoffFileData, cwd: string, silent: boolean) {
  return new Promise((resolve, reject) => {
    if (checkTypes(task, ['sh', 'bash'])) {
      return execTask({
        cwd,
        reject,
        resolve,
        silent,
        task,
      });
    }

    if (checkTypes(task, ['js', 'javascript'])) {
      let res;
      try {
        res = requireFromString(task.script, takeoffFile.filepath);
      } catch (e) {
        throw exitWithMessage({ fail: `Task '${task.name}' failed.`, code: ExitCode.Error, extra: e });
      }
      res = res.default || res;
      return resolve(typeof res === 'function' ? Promise.resolve(res()).catch(e => handleError(task, e)) : res);
    }

    return resolve();
  });
}

export = createTaskPromise;
