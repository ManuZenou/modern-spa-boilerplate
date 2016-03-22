var gulp = require('gulp');
var connect = require('gulp-connect');

// Start local dev server.
gulp.task('serve', function () {
  connect.server({
    root: "src",
    livereload: true
  });
});
