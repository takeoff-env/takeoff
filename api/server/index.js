const util = require('util');
const Glue = require('glue');
const Path = require('path');
const handlebars = require('handlebars');
const createDatabaseConnection = require(Path.resolve(`${__dirname}/../database`));

const composeServer = util.promisify(Glue.compose);

const createServer = async function createServer (config, env) {

  try {
    const server = await composeServer(config, {relativeTo: Path.resolve(`${__dirname}/plugins`)});

    server.views({
      engines: {
        html: handlebars
      },
      path: `${__dirname}/`,
      layoutPath: `${__dirname}/views/layout`,
      layout: 'default'
    });

    server.route({
      method: ['GET', 'POST', 'PUT', 'DELETE'],
      path: '/{path*}',
      config: {
        auth: false
      },
      handler: (req, reply) => {
        const accept = req.raw.req.headers.accept;
        if (accept && accept.match(/json/)) {
          return reply(new Error('Whoops, this resource is not available'));
        }

        reply.view('views/404').code(404)
      }
    })

    server.app.db = await createDatabaseConnection();

    server.state('ed-auth', server.settings.app.cookieSettings);

      // If in the development environment we want to check all request and response types
      if (env === 'development') {
        server.ext('onRequest', (__req, reply) => {
          //server.log(['debug', 'request'], 'Incoming request', Date.now());
          return reply.continue();
        });

        server.on('response', () => {
          //server.log(['debug', 'request'], 'Request finished', Date.now());
        });
      }

      return server;

  } catch (e) {
    throw e;
  }
};

module.exports = createServer;