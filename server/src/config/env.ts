import * as dotenv from 'dotenv';
import * as fs from 'fs';

switch (process.env.NODE_ENV) {
  case 'production':
    dotenv.config({path: '.env'});
    break;
  case 'test':
    dotenv.config({path: '.env.test'});
    break;
  case 'development':
  default:
    dotenv.config({path: fs.existsSync('.env') ? '.env' : '.env.example'});
}
