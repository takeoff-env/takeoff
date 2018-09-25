import { TakeoffRcFile } from 'takeoff';
import { TaskRunnerOptions } from 'task';
import { TakeoffResult } from 'commands';

export interface DynamicHelperArguments {
  args?: any;
  command?: string;
  opts?: any;
  workingDir?: string;
  silent?: boolean;
}

export interface StaticHelpers {
  execCommand?: (options: TaskRunnerOptions) => Promise<TakeoffResult>;
  exitWithMessage?: Function;
  fileExists?: Function;
  getProjectDetails?: Function;
  pathExists?: Function;
  printMessage?: Function;
  rcFile?: TakeoffRcFile;
  runCommand?: Function;
  shell?: any;
}

export type TakeoffHelpers = StaticHelpers & DynamicHelperArguments;
