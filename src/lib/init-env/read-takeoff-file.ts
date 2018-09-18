import JoyCon from 'joycon';
import { TakeoffFileData } from 'takeoff';

import parseMarkdown from './parse-markdown';

export = (cwd: string): TakeoffFileData => {
  const loadTakeoffFile = new JoyCon({
    cwd,
  });

  const { path: filepath, data } = loadTakeoffFile.loadSync(['takeoff.md']);
  if (!filepath) {
    return { exists: false, filepath: '', tasks: [] };
  }

  return { exists: true, filepath, tasks: parseMarkdown(data) };
};
