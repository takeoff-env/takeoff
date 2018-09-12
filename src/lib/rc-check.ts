import JoyCon from 'joycon';
import jsonfile from 'jsonfile';
import { dirname } from 'path';
import { TakeoffRcFile } from 'takeoff';
/**
 * Check to see if there is a .takeoffrc file in the environment folder, if not then we exit
 */

export = (cwd: string): TakeoffRcFile => {
  const loadTakeoffRc = new JoyCon({
    cwd,
  });

  const { path: filepath, data } = loadTakeoffRc.loadSync(['.takeoffrc', '.takeoffrc.json']);
  const properties = typeof data === 'string' ? JSON.parse(data) : data || {};

  if (!filepath) {
    return { exists: false, properties: {}, rcRoot: '' };
  }

  // TODO: Make this OS agnostic
  const rcLocationParts = filepath.split('/');
  rcLocationParts.pop();
  const rcRoot = rcLocationParts.join('/');
  return { exists: true, properties, rcRoot };
};
