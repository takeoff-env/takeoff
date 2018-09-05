interface TableRow {
  command: string;
  args: string[];
  options: string;
  description: string;
}

type IntermediateArgs = [string, string];

interface ExtractedArgs {
  command: string;

  args: string[];

  opts: {
    [key: string]: string;
  };

  [key: string]: string | string | object;
}

interface TableHeader {
  width?: number;

  value: string;

  align: string;
}

interface TableOptions {
  borderStyle?: number;
  compact?: boolean;
  align?: string;
  headerAlign?: string;
}

/**
 * Options to be passed to the Takeoff Parser
 */
interface TakeoffParserOptions {
  cwd: string;

  section?: string;
}

/**
 * The PluginMap defines a string value of a directory to a plugin
 */
interface PluginMap {
  [key: string]: any;
}

interface PluginOption {
  option: string;

  description: string;
}

interface TakeoffCmdParameters {
  command?: string;

  args?: string[];

  opts?: {
    [key: string]: string;
  };

  shell?: any;

  workingDir?: string;
}

interface TakeoffCommand {
  command: string;

  description: string;

  options?: PluginOption[];

  args?: string;

  group?: string;

  handler: Function;
}

interface TaskEvent {
  taskNames: string[];
  inParallel: boolean;
}

interface Task {
  name: string;

  script: string;

  description: string;

  type: string;

  before: TaskEvent[];

  after: TaskEvent[];

  [key: string]: string | TaskEvent[];
}

interface TaskRunnerOptions {
  type?: string;

  task: Task;

  resolve: Function;

  reject: Function;

  cwd: string;
}

interface ReadFileOptions {
  cwd: string;

  section?: string;
}

type When = 'before' | 'after' | 'pre' | 'post';

interface ParsedCommand {
  taskNames: string[];
  when: When;
  inParallel: boolean;
}

interface TakeoffProject {
  projectName: string;

  version: string;
}

interface TakeoffProjectApps {
  [key: string]: string[];
}

interface TakeoffFileData {
  filepath: string;
  tasks: Task[];
}
