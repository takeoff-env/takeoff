import { relative } from 'path';
import chalk from 'chalk';
import mm from 'micromatch';
import requireFromString from 'require-from-string';
import readFile from './read-takeoff-file';
import executeTask from './run-task';

export class TakeoffParser {
  opts: TakeoffParserOptions;

  takeoffFile: TakeoffFileData;

  shell: any;

  constructor(opts: TakeoffParserOptions, shell: any) {
    this.opts = opts;

    this.takeoffFile = readFile(opts);

    this.shell = shell;

    if (!this.takeoffFile) {
      throw new Error('No takeoff.md file was found.');
    }
  }

  async runTasks(taskNames: string[], inParallel?: boolean) {
    if (!taskNames || taskNames.length === 0) return;

    if (inParallel) {
      await Promise.all(
        taskNames.map(taskName => {
          return this.runTask(taskName);
        })
      );
    } else {
      for (const taskName of taskNames) {
        await this.runTask(taskName);
      }
    }
  }

  async runFile(taskName: string) {
    await this.runTask('beforeAll', false);
    await this.runTask(taskName);
    await this.runTask('afterAll', false);
  }

  async runTask(taskName: string, throwWhenNoMatchedTask = true) {
    const task = taskName && this.takeoffFile && this.takeoffFile.tasks.find((task: any) => task.name === taskName);

    const handleError = (err: Error) => {
      throw new Error(`Task '${task.name}' failed.\n${err.stack}`);
    };

    if (!task) {
      if (throwWhenNoMatchedTask) {
        throw new Error(`No task called "${taskName}" was found. Stop.`);
      } else {
        return;
      }
    }

    await this.runTaskHooks(task, 'before');

    const start = Date.now();

    this.shell.echo(`Starting '${chalk.cyan(task.name)}'...`);
    await new Promise((resolve, reject) => {
      if (checkTypes(task, ['sh', 'bash'])) {
        return executeTask(this.shell, this.opts, { task, resolve, reject, cwd: this.opts.cwd });
      }

      if (checkTypes(task, ['js', 'javascript'])) {
        let res;
        try {
          res = requireFromString(task.script, this.takeoffFile.filepath);
        } catch (err) {
          return handleError(err);
        }
        res = res.default || res;
        return resolve(typeof res === 'function' ? Promise.resolve(res()).catch(handleError) : res);
      }

      return resolve();
    });

    this.shell.echo(
      `Finished '${chalk.cyan(task.name)}' ${chalk.magenta(
        `after ${Date.now() - start} ms`,
      )}...`,
    );
    await this.runTaskHooks(task, 'after');
  }

  async runTaskHooks(task: Task, when: string) {
    const prefix: When = when === 'before' ? 'pre' : 'post';

    const tasks = this.takeoffFile.tasks.filter(({ name }: Task) => name === `${prefix}:${task.name}`);

    await this.runTasks(tasks.map((task: Task) => task.name));
    for (const item of task[when]) {
      const { taskNames, inParallel }: any = item;
      await this.runTasks(taskNames, inParallel);
    }
  }
}

function checkTypes(task: any, types: string[]) {
  return types.some(type => type === task.type);
}

// module.exports = opts => new TakeoffParser(opts)
