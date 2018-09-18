import shell from 'shelljs';

export = (path: string) => shell.test('-e', path);
