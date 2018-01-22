#!/usr/bin/nodejs
optimist = require('optimist');
path = require('path');
fs = require('fs');
exec = require('child_process').exec;

var ARGS = optimist.argv;
var source = ARGS.source;
var problem_path = ARGS.problem;
var time = ARGS.time;
var sub = ARGS.subtask;
var help = ARGS.help;

// judge 
//       --source {user_submission_filename} 
//       --problem {problem_package_path} 
// opt   --time {time_limit}
// opt   --subtask {large/small/medium}
// opt   --output {output_path}
// opt   --help 
function has(str, sub) {
    return str.indexOf(sub) > -1;
}

function isDigit(ch) {
    return ch >= '0' && ch <= '9' || ch == '.';
}

function getTime(str) {
    var pos = str.indexOf('CPU:');
    while (!isDigit(str[pos])) pos++;
    var last = pos;
    while (isDigit(str[last])) last++;
    return str.substr(pos, last - pos);
}

function getFiles(dir, prefix) {
    var files = fs.readdirSync(dir);
    filelist = [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            var prefixName;
            if (prefix == '') prefixName = file;
            else prefixName = prefix + '/' + file;
            filelist = filelist.concat(getFiles(dir + '/' + file, prefixName));
        }
        else {
            if (path.extname(file) == ".in") {
                filelist.push(prefix + '/' + file.replace(/\.[^/.]+$/, ""));
            }
        }
    });
    return filelist;
}

function runCmd(cmd) {
    var execSync = require('child_process').execSync;
    try {
        execSync(cmd, function(err,stdout,stderr){
        });
    } catch (err) {
    }
}

function getCompilerErrorMsg(tmpSubmission, fileName) {
    var extension = path.extname(tmpSubmission);
    var err;
    var errPath = '/usr/share/errorMsg';
    if (extension == '.java') {
        var cmd_line = "javac " + tmpSubmission + ' 2>' + errPath;
        runCmd(cmd_line);
        err = fs.readFileSync(errPath).toString();
    } else if (extension == '.c') {
        var cmd_line = "gcc " + tmpSubmission + ' 2>' + errPath;
        runCmd(cmd_line);
        err = fs.readFileSync(errPath).toString();
    } else if (extension == '.cpp') {
        var cmd_line = "g++ " + tmpSubmission + ' 2>' + errPath;
        runCmd(cmd_line);
        err = fs.readFileSync(errPath).toString();
    } else if (extension == '.py') {
        var cmd_line = "python " + tmpSubmission + ' 2>' + errPath;
        runCmd(cmd_line);
        err = fs.readFileSync(errPath).toString();
    } else {
        err = "not find such file extension compiler";
    }
    return err;
}

function toJsonResult(str, source, fileName) {
    var dataPath = problem_path + '/data';
    var fileList = getFiles(dataPath, '');

    res = {};

    //Compile error
    if (has(str, "Compile error")) {
        res['verdict'] = 'CE';
        res['failedCase'] = {};
        res['failedCase']['number'] = 1;
        res['failedCase']['name'] = 'unknown';
        res['totalCases'] = fileList.length;
        res['compilationError'] = getCompilerErrorMsg(source, fileName);
        return JSON.stringify(res);
    }
    
    var pos = str.indexOf('[');
    var nxt = str.indexOf(']');
    pos -= 5;
    str = str.substr(pos, nxt - pos + 1);
    
    if (has(str, "AC")) {
      res['verdict'] = 'AC';
      res['failedCase'] = {};
      res['failedCase']['number'] = 0;
      res['failedCase']['name'] = 'unknown';
    }
    else if (has(str, "TLE")) res['verdict'] = 'TLE';
    else if (has(str, "RTE")) res['verdict'] = 'RE';
    else {
        res['verdict'] = 'WA';
    }
    
    var verdict = res['verdict'];
    
    if (verdict == 'RE' || verdict == 'WA' || verdict == 'TLE') {
        var pos = str.indexOf('test case ') + 10;
        var tmpStr = str.substr(pos);
        pos = tmpStr.indexOf(',');
        var caseName = tmpStr.substr(0, pos);
        var idx = fileList.indexOf(caseName);

        res['failedCase'] = {};
        res['failedCase']['number'] = idx + 1;
        res['failedCase']['name'] = caseName;
    }

    res['time'] = getTime(str);
    
    res['totalCases'] = fileList.length;
    return JSON.stringify(res);
}

if (help) {
    console.log(
        'usage: judge' +
        '[--source=user_submission_filename]' +
        '[--problem=problem_package_path]' +
        '[opt --subtask=subtask_name]' + 
        '[opt --time=time_limit]' +
        '[opt --help]');
} else if (!source) {
    console.log("Hey, you need --source {user_submission_filename}");
} else if (!problem_path) {
    console.log("Hey, you need --problem {problem_package_path}");
} else {
    if (sub) {
        problem_path = problem_path + '/' + sub;
    }

    var pos = source.lastIndexOf("/");
    var fileName = source.substr(pos + 1);

    var cmd_line = "verifyproblem " + problem_path + " -s " + "accepted/" + fileName + " -p submissions";
    
    if (time) {
        cmd_line = cmd_line + " -t " + time;
    }
    exec(cmd_line, function(err,stdout,stderr){
        console.log(toJsonResult(stdout, source, fileName));
    });
}

