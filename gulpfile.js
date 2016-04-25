var gulp = require('gulp');
var requireDir = require('require-dir');
var paths = require('./gulp/paths.js');

requireDir('./gulp', {recurse: true});

// Watch the sources and automatically rebuild dev when files change.
gulp.task('watch', function() {
  gulp.watch([
    paths.web,
    paths.index
  ], ['build-dev']);
});

// Task for testing.
gulp.task('test', ['lint', 'build-test']);

// Task for development build.
gulp.task('dev', ['lint', 'build-dev']);

// Task for production build.
gulp.task('default', ['lint', 'build']);
