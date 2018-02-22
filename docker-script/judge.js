#!/usr/bin/nodejs
/**
 * @fileoverview
 *
 * Usage:
 *
 * node judge.js
 *   --source {user_submission_filename}
 *   --problem {problem_package_path}
 *   opt   --time {time_limit}
 *   opt   --subtask {large/small/medium}
 *   opt   --output {output_path}
 *   opt   --help
 */

"use strict";
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const exec = child_process.exec;
const execSync = child_process.execSync;

const ARGS = require('optimist').argv;
const problemPath = ARGS.problem;
const source = ARGS.source;
const time = ARGS.time;
const sub = ARGS.subtask;
const help = ARGS.help;

const judgeProblemPath = sub ? problemPath + '/' + sub : problemPath;

function hasSubstring(str, sub) {
  return str.indexOf(sub) > -1;
}

/**
 * @returns Execution time (CPU time) from verifyproblem output "CPU:..."
 */
function getTime(str) {
  return str.match(/CPU:[^0-9.]*([0-9.]+)/)[1];
}

function getFiles(dir, prefix) {
  var files = fs.readdirSync(dir);
  var filelist = [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      const prefixName = prefix === '' ? file : prefix + '/' + file;
      filelist = filelist.concat(getFiles(dir + '/' + file, prefixName));
    } else {
      if (path.extname(file) === '.in') {
        filelist.push(prefix + '/' + file.replace(/\.[^/.]+$/, ''));
      }
    }
  });
  return filelist;
}

function runCmd(cmd) {
  try {
    execSync(cmd);
  } catch (err) {
    console.error('execSync error:', err);
  }
}

function getCompilerErrorMsg(tmpSubmission) {
  var extension = path.extname(tmpSubmission);
  var errPath = '/usr/share/errorMsg';
  var cmdLine;
  switch (extension) {
    case '.java':
      cmdLine = 'javac ' + tmpSubmission + ' 2>' + errPath;
      break;
    case '.c':
      cmdLine = 'gcc ' + tmpSubmission + ' 2>' + errPath;
      break;
    case '.cpp':
      cmdLine = 'g++ ' + tmpSubmission + ' 2>' + errPath;
      break;
    case '.py':
      cmdLine = 'python ' + tmpSubmission + ' 2>' + errPath;
      break;
    default:
      return 'file extension not supported by any compiler';
  }
  runCmd(cmdLine);
  return fs.readFileSync(errPath).toString();
}

function toJsonResult(str, source, fileName) {
  var dataPath = judgeProblemPath + '/data';
  var fileList = getFiles(dataPath, '');

  // Compile error
  if (hasSubstring(str, 'Compile error')) {
    return JSON.stringify({
      verdict: 'CE',
      failedCase: {
        number: 1,
        name: 'unknown'
      },
      totalCases: fileList.length,
      compilationError: getCompilerErrorMsg(source, fileName)
    });
  }

  /**
   * The judge output has those possible lines:
   *
   * 1) AC submission Solution.java (Java) OK: AC [CPU: 3.32s @ test case secret/005-randomLarge-1]
   * 2) ERROR in submissions: AC submission Sol.java (Java) got TLE [test case: test case secret/005-randomLarge-1,
   *   CPU: 3.32s @ test case secret/005-randomLarge-1]
   * 3) WARNING in submissions: AC submission Solution.java (Java) sensitive to time limit: limit of 2 secs -> TLE,
   *   limit of 4 secs -> AC
   *   AC submission Solution.java (Java) OK with extra time: AC [CPU: 3.06s @ test case secret/009-closeQueriesLarge-2]
   *
   * Capture the content in the square brackets to retrieve CPU time.
   */
  var matched = str.match(/([A-Z]+) \[(.*)\]/);
  if (matched === null) {
    console.error('cannot find verdict line');
  }
  var verdict = matched[1];
  var bracketContent = matched[2];

  if (verdict === 'RTE') {
    verdict = 'RE';
  }

  // Fix case 3). The verdict before the bracket is AC, but it is actually TLE.
  if (hasSubstring(str, 'sensitive to time limit')) {
    verdict = 'TLE';
  }

  var res = {
    verdict: verdict,
    failedCase: {
      number: 0,
      name: ''
    },
    time: getTime(bracketContent),
    totalCases: fileList.length
  };

  if (res.verdict !== 'AC') {
    var caseName = bracketContent.match(/test case ([^,]+)/)[1];
    res.failedCase = {
      number: fileList.indexOf(caseName) + 1,
      name: caseName
    };
  }
  return JSON.stringify(res);
}

if (help) {
  console.log(
    'usage: judge' +
    '  [--source=user_submission_filename]' +
    '  [--problem=problem_package_path]' +
    '  [opt --subtask=subtask_name]' +
    '  [opt --time=time_limit]' +
    '  [opt --help]'
  );
} else if (!source) {
  console.log('--source {user_submission_filename} is required');
} else if (!problemPath) {
  console.log('--problem {problem_package_path} is required');
} else {
  const pos = source.lastIndexOf('/');
  const fileName = source.substr(pos + 1);
  const cmdLine = 'verifyproblem ' + judgeProblemPath + ' -s ' + 'accepted/' + fileName + ' -p submissions' +
    (time ? ' -t ' + time : '');
  exec(cmdLine, function(err, stdout, stderr) {
    console.log(toJsonResult(stdout, source, fileName));
  });
}

