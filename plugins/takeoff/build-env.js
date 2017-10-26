#!/usr/bin/env node

module.exports = {
    command: 'build',
    description: 'Builds an environment',
    options: [],
    args: '<name>',
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {

        let [environment] = args.length > 0 ? args : ['default'];

        let runCmd = shell.exec(`docker-compose -f envs/${environment}/docker/docker-compose.yml build`)

        if (runCmd.code !== 0) {
            shell.echo('Error starting environments');
            shell.exit(1);
        }
        shell.echo(`Successfully started ${environment}`);
        shell.exit(0);
    }
};
