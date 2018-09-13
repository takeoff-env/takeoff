import JoyCon from 'joycon';
import { sep } from 'path';
import { TakeoffRcFile } from 'takeoff';
/**
 * Check to see if there is a .takeoffrc file in the environment folder, if not then we exit
 */

export = (cwd: string): TakeoffRcFile => {
  const loadTakeoffRc = new JoyCon({
    cwd,
  });

  const { path: filepath, data } = loadTakeoffRc.loadSync(['.takeoffrc', '.takeoffrc.json']);
  const properties = typeof data === 'string' && data !== '' ? JSON.parse(data) : data || {};

  if (!filepath) {
    return { exists: false, properties: {}, rcRoot: '' };
  }

  const rcLocationParts = filepath.split(sep);
  rcLocationParts.pop();
  const rcRoot = rcLocationParts.join(sep);
  return { exists: true, properties, rcRoot };
};
