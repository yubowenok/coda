// Build tasks
var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(cb) {
  runSequence(
    'dist',
    ['index', 'sass', 'compile'],
    cb);
});

gulp.task('build-dev', function(cb) {
  runSequence(
    'dist',
    ['index-dev', 'sass-dev', 'compile-dev'],
    cb);
});

gulp.task('build-test', function(cb) {
  runSequence(
    'dist',
    ['index-test', 'sass-dev'],
    cb);
});
