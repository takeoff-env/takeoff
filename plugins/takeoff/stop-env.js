#!/usr/bin/env node

module.exports = {
    command: 'stop',
    description: 'Stops an environment',
    options: [],
    args: '<name>',
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {

        let [environment, app] = args.length > 0 ? args : ['default'];

        let cmd = `docker-compose -f envs/${environment}/docker/docker-compose.yml stop`;

        let runCmd = shell.exec(cmd)

        if (runCmd.code !== 0) {
            shell.echo(`Error stopping ${environment}` + app ? `:${app}` : '');
            shell.exit(1);
        }
        shell.echo(`Successfully stopped ${environment}` + app ? `:${app}` : '');
        shell.exit(0);
    }
};
