module.exports = async takeoff => {
    await takeoff.task(
        'destroy',
        async () => await takeoff.series([
            { cmd: `npm run compose:rm --env=${takeoff.envName}`, message: 'Removing docker amis' },
            { cmd: `rm -rf envs/${takeoff.envName}`, message: 'Removing default environment', cwd: takeoff.rootDir }
        ])
    );
};
