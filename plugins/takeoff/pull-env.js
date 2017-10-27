#!/usr/bin/env node

module.exports = {
    command: 'pull',
    description: 'Pulls any pre-build images',
    options: [],
    args: '<name> [service]',
    group: 'takeoff',
    handler: async ({ shell, args, workingDir }) => {

        let [environment, service] = args.length > 0 ? args : ['default'];
        const envDir = `${workingDir}/envs/${environment}`;

        let cmd = `docker-compose -f ${envDir}/docker/docker-compose.yml pull`;
        if (service) {
            cmd = cmd + ` ${service}`;
        }
        console.log(cmd);
        const runCmd = shell.exec(cmd)
        if (runCmd.code !== 0) {
            shell.echo(`Error pulling in ${environment}.  Use -v to see verbose logs`);
            shell.exit(1);
        }
        shell.echo(`Pulled pre-built images on ${environment}`);
        shell.exit(0);
    }
};
