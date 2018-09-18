import { sep } from 'path';
import { TakeoffRcFile } from 'takeoff';
import pathExists from './path-exists';

export = (
  args: string[],
  workingDir: string,
  rcFile: TakeoffRcFile,
): { project: string; projectDir: string; apps: string[] } => {
  let projectDir;
  // tslint:disable-next-line
  let [project, ...apps] = args.length > 0 ? args : [''];

  // If the command is run within a project then we want to actually run it there
  if (!project && pathExists(`${workingDir}/docker/docker-compose.yml`)) {
    projectDir = workingDir;
    project = workingDir.split(sep).pop();
  } else if (!project) {
    projectDir = `${rcFile.rcRoot}/projects/default`;
    project = 'default';
  } else {
    projectDir = `${rcFile.rcRoot}/projects/${project}`;
  }

  return {
    apps,
    project,
    projectDir,
  };
};
