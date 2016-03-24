var gulp = require('gulp');
var connect = require('gulp-connect');
var gulpPostcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');
var atImport = require("postcss-import");
var rename = require("gulp-rename");
var path = require('path');
var util = require('gulp-util');
var vuesplitPlugin = require('gulp-vuesplit').default;

// Start local dev server.
gulp.task('serve', function () {
  connect.server({
    root: "src",
    port: 8085,
    https: false,
    livereload: true
  });
});

var postcss_processors = [
  atImport,
  nested,
  autoprefixer
];

var postcss_options = {

};

gulp.task('postcss', function() {
  gulp.src("src/main.css").
    pipe(gulpPostcss(postcss_processors, postcss_options)).
    pipe(rename({
      extname : ".bundle.css"
    })).
    pipe(gulp.dest("src")).
    pipe(connect.reload());
});

gulp.task('vuesplit', function() {
  return gulp.src("src/**/*.vue").
    pipe(vuesplitPlugin()).
    pipe(gulp.dest("."));
});

gulp.task('watch', ["vuesplit", "postcss"], function() {
  gulp.watch(["src/**/*.css", "!src/**/*.bundle.css"], ["postcss"]).on('change', logChanges);
  gulp.watch(["src/**/*.vue"], ["vuesplit"]).on('change', logChanges);
});

function logChanges(event) {
  util.log(
    util.colors.green('File ' + event.type + ': ') +
    util.colors.magenta(path.basename(event.path))
  );
}
