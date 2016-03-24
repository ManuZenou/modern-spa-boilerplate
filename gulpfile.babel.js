import gulp from "gulp"
import connect from "gulp-connect"
import rename from "gulp-rename"
import path from "path"
import util from "gulp-util"
import del from "del";

import jspm from "jspm";

import postcss from "gulp-postcss"
import autoprefixer from "autoprefixer"
import nested from "postcss-nested"
import atImport from "postcss-import"

import splitPlugin from "gulp-vuesplit"
import layoutSelector from "postcss-layout-selector";
import fontSystem from "postcss-font-system";

// Start local dev server.
gulp.task("serve", function() {
  connect.server({
    root: "src",
    port: 8085,
    https: false,
    livereload: true
  })
})

var postcss_processors = [
  atImport,
  nested,
  autoprefixer
]

var postcss_options = {

}

gulp.task("postcss", function() {
  gulp.src("src/main.css").
    pipe(postcss(postcss_processors, postcss_options)).
    pipe(rename({
      extname : ".bundle.css"
    })).
    pipe(gulp.dest("src")).
    pipe(connect.reload())
})

gulp.task("vuesplit", function() {
  return gulp.src("src/**/*.vue").
    pipe(splitPlugin()).
    pipe(gulp.dest("."))
})

gulp.task("watch", [ "vuesplit", "postcss" ], function() {
  gulp.watch([ "src/**/*.css", "!src/**/*.bundle.css" ], [ "postcss" ]).on("change", logChanges)
  gulp.watch([ "src/**/*.vue" ], [ "vuesplit" ]).on("change", logChanges)
})

function logChanges(event) {
  util.log(
    util.colors.green("File " + event.type + ": ") +
    util.colors.magenta(path.basename(event.path))
  )
}
