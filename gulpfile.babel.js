var gulp = require('gulp');
var connect = require('gulp-connect');
var postcss = require('gulp-postcss');

// Start local dev server.
gulp.task('serve', function () {
  connect.server({
    root: "src",
    port: 8085,
    https: false,
    livereload: true
  });
});

gulp.task('postcss', function() {
  gulp.src("src/main.css").
    pipe(postcss({

    })).
    pipe(gulp.dest()).
    pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch("src", ["postcss"]).on('change', logChanges);

});

function logChanges(event) {
  util.log(
    util.colors.green('File ' + event.type + ': ') +
    util.colors.magenta(path.basename(event.path))
  );
}
