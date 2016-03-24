import gulp from "gulp"
import connect from "gulp-connect"
import rename from "gulp-rename"
import path from "path"
import util from "gulp-util"
import del from "del";

import jspm from "jspm";
const builder = new jspm.Builder("src", "jspm.config.js");

import postcss from "gulp-postcss"
import postcss_import from "postcss-import"
import postcss_assets from "postcss-assets"
import postcss_discardComments from "postcss-discard-comments"
import postcss_sassyMixins from "postcss-sassy-mixins"
import postcss_colorFunction from "postcss-color-function"
import postcss_colorHexAlpha from "postcss-color-hex-alpha"
import postcss_advancedVariables from "postcss-advanced-variables"
import postcss_willChange from "postcss-will-change"
import postcss_calc from "postcss-calc"
import postcss_nested from "postcss-nested"
import postcss_extend from "postcss-extend"
import postcss_autoprefixer from "autoprefixer"
import postcss_cssnano from "cssnano"
import postcss_transparentFix from "postcss-gradient-transparency-fix"
import postcss_easings from "postcss-easings"

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

var postcss_processors =
[
  postcss_import,
  postcss_discardComments,

  postcss_advancedVariables,
  postcss_sassyMixins,
  postcss_willChange,
  postcss_extend,

  postcss_assets,
  postcss_calc,
  postcss_transparentFix,
  postcss_easings,
  postcss_colorFunction,
  postcss_colorHexAlpha,

  postcss_nested,
  postcss_autoprefixer,
  postcss_cssnano,
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

gulp.task("watch", [ "vuesplit", "postcss" ], function()
{
  function log(event)
  {
    util.log(
      util.colors.green("File " + event.type + ": ") +
      util.colors.magenta(path.basename(event.path))
    )
  }

  gulp.watch([ "src/**/*.css", "!src/**/*.bundle.css" ], [ "postcss" ]).on("change", log)
  gulp.watch([ "src/**/*.vue" ], [ "vuesplit" ]).on("change", log)
})
