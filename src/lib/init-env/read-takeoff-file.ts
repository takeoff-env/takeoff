import { dirname } from 'path';
import parseMarkdown from './parse-markdown';
import JoyCon from 'joycon';
import { ReadFileOptions, TakeoffFileData } from 'takeoff';

export = ({ cwd }: ReadFileOptions): TakeoffFileData => {
  const loadTakeoffFile = new JoyCon({
    // Stop reading at parent dir
    // i.e. Only read file from process.cwd()
    cwd,
    stopDir: dirname(process.cwd()),
  });

  const { path: filepath, data } = loadTakeoffFile.loadSync(['takeoff.md']);
  if (!filepath) return null;

  return { filepath, tasks: parseMarkdown(data) };
};
