import shell from 'shelljs';

export = (silent: boolean, cwd: string) => (cmd: string, overideCwd?: string, disableSilent?: boolean) =>
  shell.exec(cmd, {
    cwd: overideCwd || cwd,
    silent: !disableSilent ? silent : false,
  });
