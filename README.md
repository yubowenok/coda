# Coda

[![Build Status](https://travis-ci.com/yubowenok/coda.svg?token=72Mbb98eevCq6x2s2zUd&branch=dockerJudge)](https://travis-ci.com/yubowenok/coda)

Coda Online Judge Platform

Light-weight contest & practice platform for Coding Of Data structure and Algorithm.

### Install

Suggested nodejs version 8.9.4, npm version 5.6.

Coda has two components: the web and the server. Install the two parts separately.

```bash
npm install
npm --prefix ./server install
```

### Run in development

```bash
npm --prefix ./server start
npm start
```

Coda shall then be served at http://localhost:4200.

### Run in production

```bash
npm run build
npm --prefix ./server run build
npm --prefix ./server run serve
```

Then copy the files at /dist/ and /server/dist/ to your server deployment.
Maintain the relative directory structure between web and server.

Configure CODA_ROOT path and ALLOW_ORIGIN in /server/.env. See /server/.env.example for an example configuration.

CODA_ROOT must be a valid Coda storage directory.
See /server/test_root for a small storage directory example.
This directory must be readable and writable for the user that runs the Coda server.
