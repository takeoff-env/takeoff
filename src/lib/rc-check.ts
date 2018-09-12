import JoyCon from 'joycon';
import { dirname } from 'path';
import { TakeoffRcFile } from 'takeoff';
/**
 * Check to see if there is a .takeoffrc file in the environment folder, if not then we exit
 */

export = (cwd: string): TakeoffRcFile => {
  const loadTakeoffRc = new JoyCon({
    // Stop reading at parent dir
    // i.e. Only read file from process.cwd()
    cwd,
  });

  const { path: filepath, data } = loadTakeoffRc.loadSync(['.takeoffrc']);

  if (!filepath) {
    return { exists: false, properties: {}, rcRoot: '' };
  }

  // TODO: Make this OS agnostic
  const rcLocationParts = filepath.split('/');
  rcLocationParts.pop();
  const rcRoot = rcLocationParts.join('/');

  let properties = {};
  if (data) {
    try {
      properties = JSON.parse(data);
    } catch (e) {
      throw e;
    }
  }
  return { exists: true, properties, rcRoot };
};
