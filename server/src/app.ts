import './config/env';
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as path from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as lusca from 'lusca';
import * as expressValidator from 'express-validator';
import { Response, Request, NextFunction } from 'express';
import './config/passport';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('trust proxy', 1);
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('origin');
  if (process.env.ALLOW_ORIGIN.split(';').indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // keep login for one day
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// API routes
require('./api/problemset')(app);
require('./api/problem')(app);
require('./api/submission')(app);
require('./api/submit')(app);
require('./api/scoreboard')(app);
require('./api/queue')(app);
require('./api/user')(app);

// Serve the web content
app.use('/', express.static(path.join(__dirname, '../../dist')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

module.exports = app;
