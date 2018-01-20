## how to run

### init judge (pull image)

npm run init-judge

### run judge

#### run once

npm run judge

#### run every 5 seconds

npm run judge -- --interval=5

### env setting example

CONTAINER_NAME='coda-judge-container'

DOCKER_ROOT='/usr/share/src'

IMAGE_NAME='szfck/nyu-problemtools:1.0.4'