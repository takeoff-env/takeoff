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
  task: Task;

  resolve: Function;

  reject: Function;

  cwd: string;
}
