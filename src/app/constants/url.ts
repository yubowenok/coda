/**
 * During web development,
 * - the web server is started via "ng serve" and it runs at localhost:4200;
 * - the API server is started via "npm start" under "server/", and it runs at localhost:3000.
 *
 * Thus during development we send API requests to localhost:3000, while in production we send to the origin.
 */
import { environment } from '../../environments/environment';

const isDev: boolean = !environment.production;

const host: string = isDev ? 'localhost' : window.location.hostname;
const apiPort: string = isDev ? '3000' : (window.location.port ? '' + window.location.port : '');

export const API_URL: string = 'http://' + host + ':' + apiPort + '/api';
