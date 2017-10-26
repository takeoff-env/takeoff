#!/usr/bin/env node

module.exports = {
    command: 'destroy',
    description: 'Destroys an environment',
    options: [],
    args: '<name>',
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {

        let [environment] = args.length > 0 ? args : ['default'];
        const envDir = `${workingDir}/envs/${environment}`;

        if (!shell.test('-e', envDir)) {
            shell.echo(`The environment ${environment} doesn't exist`);
            shell.exit(0);  // Don't exit 1 as this might break CI workflows
        }

        const dockerDown = shell.exec(`docker-compose -f ${envDir}/docker/docker-compose.yml down --rmi all`);
        if (dockerDown.code !== 0) {
            shell.echo('Error stopping environments');
            shell.exit(1);
        }

        const removeFolder = shell.rm('-rf', `${envDir}`);
        if (dockerDown.code !== 0) {
            shell.echo('Error deleting environments');
            shell.exit(1);
        }
        
        shell.echo(`Successfully destroyed ${environment}`);
        shell.exit(0);
    }
};
