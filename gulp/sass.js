// Sass build the css.
var gulp = require('gulp');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var concat = require('gulp-concat');
var paths = require('./paths.js');

var runSass = function(cb, compressed) {
  return gulp.src(paths.webCss)
    .pipe(concat('coda.scss'))
    .pipe(sass({
      outputStyle: compressed ? 'compressed' : ''
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.dist))
    .on('error', function(err) {
      cb(err);
    });
};

gulp.task('sass', function(cb) {
  return runSass(cb, true);
});

gulp.task('sass-dev', function(cb) {
  return runSass(cb, false);
});
