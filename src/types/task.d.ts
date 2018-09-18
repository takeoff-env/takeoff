/**
 * Available exit codes for an application.
 */
export const enum ExitCode {
  Success,
  Error,
}

/**
 * Internal task event
 */
export interface TaskEvent {
  taskNames: string[];
  inParallel: boolean;
}

/**
 * A task is defined by the markdown and use of key words.
 */
export interface Task {
  name: string;

  script: string;

  description: string;

  type: string;

  before: TaskEvent[];

  after: TaskEvent[];

  [key: string]: string | TaskEvent[];
}

/**
 * Options to pass to the task runner
 */
export interface TaskRunnerOptions {
  /**
   * Message to display on success
   */
  success: string;

  /**
   * Message to display on fail
   */
  fail: string;

  /**
   * If the output is silent
   */
  silent: boolean;

  /**
   * The task to run
   */
  task: {
    script: string;
    [k: string]: string;
  };

  /**
   * The directory to run the command in
   */
  cwd: string;
}
