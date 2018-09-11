import { dirname } from 'path';
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
