import { TakeoffCmdParameters } from "takeoff";
import { TakeoffCommand } from "commands";

/**
 * Command that handles the stopping of a project
 */

export = ({
  shell,
  args,
  workingDir,
  opts,
  printMessage,
  exitWithMessage,
}: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'stop',
  description: 'Stops all services in a named project',
  args: '<name>',
  group: 'takeoff',
  handler(): void {
    let [project]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Stopping project ${project}`);

    const projectDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', projectDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    let cmd = `docker-compose -f ${projectDir}/docker/docker-compose.yml stop`;

    let runCmd = shell.exec(cmd, { slient: opts.v ? false : true });
    
    if (runCmd.code !== 0) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1, runCmd.stdout);
    }

    return exitWithMessage(`Successfully stopped ${project}`, 0);
  },
});
