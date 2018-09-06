#!/usr/bin/env node

import fg from 'fast-glob';
import Path from 'path';
import generateTable from '../../lib/generate-table';
import rcCheck from '../../lib/rc-check';

const getProjects = async (baseDir: string) => {
  // Do all the pre-plugin loading
  const basePath = `${Path.normalize(baseDir)}/projects`;
  let projects = [];
  try {
    projects = await fg('**/package.json', {
      cwd: basePath,
      ignore: ['**/node_modules/**'],
    });
  } catch (e) {
    throw e;
  }
  return projects.sort((a: string, b: string) => {
    if (a.length === b.length) {
      return 0;
    }
    return a.length > b.length ? -1 : 1;
  });
};

export = ({ shell, workingDir }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'list',
  description: 'List all the available projects and their apps',
  group: 'takeoff',
  async handler(): Promise<void> {
    rcCheck(shell, workingDir);

    const packagePaths = await getProjects(workingDir);

    if (packagePaths.length === 0) {
      shell.echo(`No projects found in this environment`);
      return shell.exit(0);
    }
    const tableValues: Array<[string, string, string]> = [];
    const projects: TakeoffProject[] = [];
    const apps: TakeoffProjectApps = {};

    packagePaths.forEach((pkg: string) => {
      let projectName, app, a, b;
      let split;
      if (pkg.match('/env/')) {
        split = pkg.split('/');
        [projectName, a, app, b] = split;
        apps[projectName] = apps[projectName] || [];
        apps[projectName].push(app);
      } else {
        try {
          split = pkg.split('/');
          [projectName] = split;
          const pkgJson = require(`${workingDir}/projects/${pkg}`);
          const { version } = pkgJson;
          projects.push({ projectName, version });
          apps[projectName] = apps[projectName] || [];
        } catch (e) {}
      }
    });

    projects.forEach((project: TakeoffProject) => {
      tableValues.push([
        project.projectName,
        project.version,
        (apps[project.projectName] || []).join(', '),
      ]);
    });

    var commandsTable = generateTable(
      tableValues as any,
      [
        { value: 'Environment', align: 'left', width: 11 },
        { value: 'Version', align: 'left', width: 10 },
        { value: 'Apps', align: 'left', width: 10 },
      ],

      { borderStyle: 0, compact: true, align: 'left', headerAlign: 'left' },
    );
    shell.echo(commandsTable.render());
    shell.exit(0);
  },
});
