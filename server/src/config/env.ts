import * as dotenv from 'dotenv';
import * as fs from 'fs';

let envFile: string;
switch (process.env.NODE_ENV) {
  case 'production':
    envFile = '.env';
    break;
  case 'test':
    envFile = '.env.test';
    break;
  case 'development':
  default:
    envFile = fs.existsSync('.env') ? '.env' : '.env.example';
}
console.log(`using env file ${envFile}`);
dotenv.config({path: envFile});
console.log(`coda data is located at ${process.env.CODA_ROOT}`);
