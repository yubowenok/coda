// Path specification.

/** @const */
module.exports = {
  dist: 'dist/',
  web: [
    'web/**/*'
  ],
  webJs: [
    'web/**/*.js'
  ],
  webScss: [
    'web/**/*.css',
    'web/**/*.scss'
  ],
  dev: [
    'dev/***.js'
  ],
  index: [
    'web/index.html'
  ],
  html: [
    'web/**/*.html',
    '!web/index.html'
  ],
  gulp: [
    'gulp/**/*.js'
  ]
};
