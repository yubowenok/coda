// Lint js sources.
var gulp = require('gulp');
var gjslint = require('gulp-gjslint');
var paths = require('./paths.js');

gulp.task('lint-gulp', function(cb) {
  return gulp.src(paths.gulp)
    .pipe(gjslint())
    .pipe(gjslint.reporter('console'))
    .pipe(gjslint.reporter('fail'))
    .on('error', function(err) {
      cb(err);
    });
});

gulp.task('lint-web', function(cb) {
  return gulp.src(paths.webJS)
    .pipe(gjslint())
    .pipe(gjslint.reporter('console'))
    .pipe(gjslint.reporter('fail'))
    .on('error', function(err) {
      cb(err);
    });
});

gulp.task('lint', ['lint-gulp', 'lint-web']);
