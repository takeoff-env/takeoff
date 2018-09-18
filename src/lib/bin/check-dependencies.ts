import { TakeoffResult } from 'commands';
import shell from 'shelljs';
import { ExitCode } from 'task';

const REQUIRED_APPS = ['git', 'npm', 'docker', 'docker-compose'];

export = (customDependencies: string[]): TakeoffResult => {
  const result: TakeoffResult = {
    code: 0,
  };

  const dependencies = REQUIRED_APPS.concat(customDependencies);

  for (const app of dependencies) {
    if (!shell.which(app)) {
      result.code = ExitCode.Error;
      result.fail = `Unable to find '${app}' on your local system. Please install to continue.`;
      break;
    }
  }

  return result;
};
