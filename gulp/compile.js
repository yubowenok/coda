// Compile the sources using closure-compiler.
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
var concat = require('gulp-concat');
var paths = require('./paths.js');

gulp.task('compile', function(cb) {
  return gulp.src(paths.webJs)
    .pipe(closureCompiler({
      compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
      fileName: 'coda.js'
    }).on('error', function(err) {
      cb(err);
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('compile-dev', function(cb) {
  return gulp.src(paths.webJs)
    .pipe(concat('coda.js'))
    .pipe(gulp.dest(paths.dist))
    .on('error', function(err) {
      cb(err);
    });
});
