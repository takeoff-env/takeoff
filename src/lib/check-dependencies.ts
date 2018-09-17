import { CommandResult } from 'commands';
import shell from 'shelljs';
import { ExitCode } from 'task';

const REQUIRED_APPS = ['git', 'npm', 'docker', 'docker-compose'];

export = (): CommandResult => {
  const result: CommandResult = {
    code: 0,
  }

   for (const app of REQUIRED_APPS) {
    if (!shell.which(app)) {
      result.code = ExitCode.Error
      result.fail = `Unable to find '${app}' on your local system. Please install to continue.`
      break;
    }
  }

  return result;
}
