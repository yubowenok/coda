import * as errorHandler from 'errorhandler';

const app = require('./app');

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

const server = app.listen(app.get('port'), () => {
  console.log(('  coda server is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
});

export = server;
