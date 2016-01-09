// Copy resources to the dist folder.
var gulp = require('gulp');
var flatten = require('gulp-flatten');
var paths = require('./paths.js');

gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.dist + 'html'));
});
