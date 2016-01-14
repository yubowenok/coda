// Compile the sources using closure-compiler.
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
var concat = require('gulp-concat');
var paths = require('./paths.js');

var compilerPath = 'node_modules/google-closure-compiler/compiler.jar';
var closureExterns = 'node_modules/google-closure-compiler/contrib/externs/';

var externs = [
  closureExterns + 'jquery-1.9.js',
  closureExterns + 'underscore-1.5.2.js',
  closureExterns + 'angular-1.4*'
].concat(paths.externs);

var jscompErrors = [
  'checkVars',
  'duplicate',
  'undefinedVars'
];

var jscompWarnings = [
  'checkTypes',
  'globalThis',
  'missingProperties',
  'undefinedNames'
];

gulp.task('compile', function(cb) {
  return gulp.src(paths.webJs)
    .pipe(closureCompiler({
      compilerPath: compilerPath,
      fileName: 'coda.js',
      compilerFlags: {
        jscomp_error: jscompErrors,
        jscomp_warning: jscompWarnings,
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        externs: externs,
        output_wrapper: '(function(){%output%}).call(window);'
      }
    }).on('error', function(err) {
      cb(err);
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('compile-dev', ['compile'], function(cb) {
  return gulp.src(paths.webJs)
    .pipe(concat('coda.js'))
    .pipe(gulp.dest(paths.dist))
    .on('error', function(err) {
      cb(err);
    });
});
