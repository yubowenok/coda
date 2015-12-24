// Generate index.html in the root directory.
var gulp = require('gulp');
var paths = require('./paths.js');

gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(gulp.dest('.'));
});

gulp.task('index-dev', function() {
  return gulp.src(paths.index)
    .pipe(gulp.dest('.'));
});
