#!/usr/bin/env node

module.exports = {
    command: 'build',
    description: 'Builds an environment',
    options: [],
    args: '<name>',
    group: 'takeoff',
    handler: async ({ shell, args, workingDir }) => {

        let [environment] = args.length > 0 ? args : ['default'];
        const envDir = `${workingDir}/envs/${environment}`;

        let runCmd = shell.exec(`docker-compose -f ${envDir}/docker/docker-compose.yml build`)

        if (runCmd.code !== 0) {
            shell.echo('Error starting environments');
            shell.exit(1);
        }
        shell.echo(`Successfully started ${environment}`);
        shell.exit(0);
    }
};
