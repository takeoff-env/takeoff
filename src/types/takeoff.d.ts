



/**
 * Options to be passed to the Takeoff Parser
 */
interface TakeoffParserOptions {
  cwd: string;

  section?: string;
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
