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
  
  let properties;
  if (typeof data === 'string' && (data.charAt(0) === '{' || data.charAt(0) === '[')) {
    try {
      properties = JSON.parse(data);
    } catch (e) {
      throw e;
    }
  } else {
    properties = data || {};
  }

  if (!filepath) {
    return { exists: false, properties: {}, rcRoot: '' };
  }

  const rcLocationParts = filepath.split(sep);
  rcLocationParts.pop();
  const rcRoot = rcLocationParts.join(sep);
  return { exists: true, properties, rcRoot };
};
