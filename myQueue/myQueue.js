import { setInterval } from 'timers';

const { exec } = require('child_process');
const containerName = 'coda-test';
const dockerRoot = '/usr/share/src';
const localRoot = '/Users/kaichen/Dev/docker/codaTest';
const localVerdict = localRoot + '/verdict';
path = require('path')

fs = require('fs');

var child_process = require('child_process');

function systemSync(cmd) {
  try {
    return child_process.execSync(cmd).toString();
  } 
  catch (error) {
    error.status;  // Might be 127 in your example.
    error.message; // Holds the message you typically want.
    error.stderr;  // Holds the stderr output. Use `.toString()`.
    error.stdout;  // Holds the stdout output. Use `.toString()`.
  }
};

function judgeSubmission(user, problem, fileName, subtask, time) {
    var userPath = dockerRoot + '/users/' + user;
    var problemPath = dockerRoot + '/problems/' + problem;
    var submissionPath = userPath + '/' + fileName;

    var outputPath = localRoot + '/users/' + user + '/' + fileName + '.verdict.json';

    var cmd_line = 
    'docker exec ' + containerName + ' judge' +
    ' --source=' +  submissionPath + 
    ' --problem=' + problemPath;

    if (subtask != '') cmd_line += ' --subtask=' + subtask;
    cmd_line += ' --time=' + time;
    console.log(cmd_line);

    fs.writeFileSync(outputPath, systemSync(cmd_line));
}

//judgeSubmission('001', 'hello', 'hello.cpp', 'large', 1);
function getJsonList(dir) {
    var files = fs.readdirSync(dir);
    filelist = [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = filelist.concat(getFiles(dir + '/' + file));
        }
        else {
            if (path.extname(file) == ".json") {
                filelist.push(dir + '/' + file);
            }
            
        }
    });
    return filelist;
}

function judgeAll() {
    list = getJsonList(localVerdict);
    //console.log(list);

    list.forEach(function(file){
        //console.log(file);
        rawdata = fs.readFileSync(file);
        submissions = JSON.parse(rawdata);
        //console.log(submissions); 
        submissions.forEach(function(submission) {
            console.log(submission);
            if (submission['verdict'] == 0) {
                judgeSubmission(
                    submission['username'], 
                    submission['problemNumber'],
                    submission['sourceFilename'],
                    submission['subtask'],
                    1
                );
            }
            
        }); 
    });
}

// docker run -dit --name coda-test  
// -v /Users/kaichen/Dev/docker/codaTest:/usr/share/src szfck/nyu-problemtools:1.0.4
//pull docker image and create a container
var imageName = 'szfck/nyu-problemtools:1.0.4'
systemSync('docker pull ' + imageName);
systemSync('docker run -dit --name ' + containerName + 
' -v ' + localRoot + ':' + dockerRoot + ' ' + 
imageName);

setInterval(judgeAll(), 10 * 1000);




