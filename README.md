# Coda

[![Build Status](https://travis-ci.com/yubowenok/coda.svg?token=72Mbb98eevCq6x2s2zUd&branch=dockerJudge)](https://travis-ci.com/yubowenok/coda)

Coda Online Judge Platform

Light-weight contest & practice platform for Coding Of Data structure and Algorithm.

### Install

Suggested nodejs version 8.9.4, npm version 5.6.

Coda has two components: the web and the server. Install the two parts separately.

```bash
npm install -g @angular/cli
npm install
npm --prefix ./server install
```

### Run in development

```bash
npm --prefix ./server start
ng serve --open
```

### Run in production

```bash
ng build
npm --prefix ./server run build
npm --prefix ./server run serve
```

Then copy the files at /dist/ and /server/dist/ to your server deployment.
Maintain the relative directory structure between web and server.

Configure CODA_ROOT path in /server/.env. See /server/.env.example for an example configuration.
