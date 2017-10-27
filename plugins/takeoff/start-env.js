#!/usr/bin/env node

module.exports = {
    command: 'start',
    description: 'Starts an environment',
    options: [],
    args: '<name> [app]',
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {

        let [environment, app] = args.length > 0 ? args : ['default'];
        const envDir = `${workingDir}/envs/${environment}`;

        let cmd = `docker-compose -f ${envDir}/docker/docker-compose.yml up`;
        if (app) {
            cmd = `${cmd} -d ${app}`;
        }

        let runCmd = shell.exec(cmd)

        if (runCmd.code !== 0) {
            shell.echo('Error starting environments');
            shell.exit(1);
        }
        shell.echo(`Successfully started ${environment}`);
        shell.exit(0);
    }
};
