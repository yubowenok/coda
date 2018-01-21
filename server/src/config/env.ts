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
console.log(`using env file "${envFile}"`);
dotenv.config({path: envFile});
console.log(`data is located at "${process.env.CODA_ROOT}"`);

if (process.env.CODA_USER) {
  process.setuid(process.env.CODA_USER);
  console.log(`running as user "${process.env.CODA_USER}"`);
}
if (process.env.CODA_GROUP) {
  process.setgid(process.env.CODA_GROUP);
  console.log(`running as group "${process.env.CODA_GROUP}"`);
}

process.env.CONTAINER_NAME = process.env.CONTAINER_NAME || 'coda-judge-container';
process.env.DOCKER_ROOT = process.env.DOCKER_ROOT || '/usr/share/src';
process.env.IMAGE_NAME = process.env.IMAGE_NAME || 'szfck/nyu-problemtools:latest';
