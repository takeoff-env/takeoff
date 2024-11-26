#!/usr/bin/env node

import fg from 'fast-glob';
import Path from 'path';

import { TakeoffResult, TakeoffCommand } from 'commands';
import { TakeoffHelpers, TakeoffProject, TakeoffProjectApps } from 'takeoff';

import { ExitCode } from 'task';
import generateTable from '../../lib/helpers/generate-table';

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

export = ({ shell, workingDir, exitWithMessage, printMessage, rcFile }: TakeoffHelpers): TakeoffCommand => ({
  command: 'list',
  description: 'List all the available projects and their apps',
  group: 'takeoff',
  async handler(): Promise<TakeoffResult> {
    printMessage(`Listing all projects and application`);

    const packagePaths = await getProjects(workingDir);

    if (packagePaths.length === 0) {
      return { code: ExitCode.Success, fail: `No projects found in this workspace. Exiting.` };
    }

    const tableValues: string[][] = [];
    const projects: TakeoffProject[] = [];
    const apps: TakeoffProjectApps = {};

    packagePaths.forEach((pkg: string) => {
      let projectName;
      let app;
      let a;
      let b;
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
          const pkgJson = require(`${rcFile.rcRoot}/projects/${pkg}`);
          const { version } = pkgJson;
          projects.push({ projectName, version });
          apps[projectName] = apps[projectName] || [];
        } catch (e) {
          // Do nothing
        }
      }
    });

    projects.forEach((project: TakeoffProject) => {
      tableValues.push([
        project.projectName,
        project.version,
        ([...new Set([...apps[project.projectName]])] || []).join(', '),
      ]);
    });

    const table = generateTable(
      tableValues as any,
      [
        { value: 'Workspace', align: 'left', width: 11 },
        { value: 'Version', align: 'left', width: 10 },
        { value: 'Apps', align: 'left', width: 10 },
      ],

      { borderStyle: 0, compact: true, align: 'left', headerAlign: 'left' },
    );

    const result = generateTable(tableValues, [
        { value: 'Workspace', align: 'left', width: 11 },
        { value: 'Version', align: 'left', width: 10 },
        { value: 'Apps', align: 'left', width: 10 },
      ]).render();

    return { code: ExitCode.Success, success: result };
  },
});
