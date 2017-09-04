module.exports = {
    use_env_variable: false,
    development: {
        host: 'db',
        port: '5432',
        database: 'myappdb',
        dialect: 'postgres',
        username: 'myappuser',
        password: 'myapppassword'
    }
};
