import JoyCon from 'joycon';
import { sep } from 'path';
import { TakeoffRcFile } from 'takeoff';
import { ExitCode } from 'task';
import exitWithMessage from '../helpers/exit-with-message';

/**
 * Starting from the directory the *takeoff* command is run in, this method will then resolve up all the parent
 * directories to find a `.takeoffrc` or `.takeoffrc.json` file.  Both are JSON format and must start with a `{`
 * object.
 * Some commands may want to skip this and be run anywhere, in this case (*e.g. takeoff init, takeoff docker:pv*)
 * those commands can add the `{global: boolean}` value in their configuration
 */
function loadRcFile(cwd: string): TakeoffRcFile {
  const loadTakeoffRc = new JoyCon({
    cwd,
  });

  const properties: Map<string, any> = new Map<string, any>();

  const { path: filepath, data } = loadTakeoffRc.loadSync(['.takeoffrc', '.takeoffrc.json']);

  if (!filepath) {
    return { exists: false, properties, rcRoot: '' };
  }

  if (filepath && typeof data === 'string' && data.charAt(0) === '{') {
    try {
      const result = JSON.parse(data);
      Object.keys(result).forEach((key: string) => properties.set(key, result[key]));
    } catch (e) {
      exitWithMessage({ code: ExitCode.Error, fail: `Unable to parse file contents: ${filepath}`, extra: e });
    }
  } else {
    Object.keys(data || {}).forEach((key: string) => properties.set(key, data[key]));
  }
  const rcLocationParts = filepath.split(sep);
  rcLocationParts.pop();
  const rcRoot = rcLocationParts.join(sep);
  return { exists: true, properties, rcRoot };
}

export = loadRcFile;
