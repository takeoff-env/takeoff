import { dirname } from 'path';
import chalk from 'chalk';
import JoyCon from 'joycon';
/**
 * Check to see if there is a .takeoffrc file in the environment folder, if not then we exit
 */

export = (cwd: string): boolean => {
  const loadTakeoffRc = new JoyCon({
    // Stop reading at parent dir
    // i.e. Only read file from process.cwd()
    cwd,
    stopDir: dirname(process.cwd())
  });

  const { path: filepath } = loadTakeoffRc.loadSync(['.takeoffrc']);
  return filepath ? true : false;
};

// export = (shell: any, workingDir: string) => {

//   //`Finished '${chalk.cyan(task.name)}' ${chalk.magenta(
//   if (!shell.test('-f', `${workingDir}/.takeoffrc`)) {
//     shell.echo(
//       `${chalk.red('[Takeoff]')} No ${chalk.yellow(
//         '.takeoffrc'
//       )} file found, are you runnng this within a Takeoff environment?`
//     );
//     return shell.exit(1);
//   }
// };
