// Depndencies for Tasks
import shell from 'shelljs';

import exitWithMessage from '../helpers/exit-with-message';
import fileExists from '../helpers/file-exists';
import getProjectDetails from '../helpers/get-project-details';
import pathExists from '../helpers/path-exists';
import printMessage from '../helpers/print-message';
import createRunCommand from '../helpers/run-command';
import loadRcFile from './load-rc-file';

// Experimental
import execCommand from '../init-env/task-runner/exec-command';

import { DynamicHelperArguments, TakeoffHelpers } from 'helpers';

export = (options: DynamicHelperArguments): TakeoffHelpers => {
  return {
    ...options,
    execCommand,
    exitWithMessage,
    fileExists,
    getProjectDetails,

    pathExists,
    printMessage,
    rcFile: loadRcFile(options.workingDir),
    runCommand: createRunCommand(options.silent, options.workingDir),
    shell,
  };
};
