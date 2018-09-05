import path from 'path';
import JoyCon from 'joycon';

export = (cwd: string): JoyCon => {
  return new JoyCon({
    // Stop reading at parent dir
    // i.e. Only read file from process.cwd()
    cwd,
    stopDir: path.dirname(process.cwd()),
  });
};
