#!/usr/bin/env node

module.exports = {
    command: 'pull',
    description: 'Pulls any pre-built images',
    options: [],
    args: '<name>',
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {

        let [environment] = args.length > 0 ? args : ['default'];

        let runCmd = shell.exec(`docker-compose -f envs/${environment}/docker/docker-compose.yml pull`)

        if (runCmd.code !== 0) {
            shell.echo(`Error pulling in ${environment}.  Use -v to see verbose logs`);
            shell.exit(1);
        }
        shell.echo(`Pulled pre-built images on ${environment}`);
        shell.exit(0);
    }
};
