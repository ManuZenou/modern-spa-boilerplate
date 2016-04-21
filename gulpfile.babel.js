import gulp from "gulp"
import rename from "gulp-rename"
import path from "path"
import util from "gulp-util"
import del from "del";

import jspm from "jspm";
const builder = new jspm.Builder("src", "jspm.config.js");
import resolve from "pkg-resolve";

import sourcemaps from "gulp-sourcemaps";

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
import postcss_csso from "postcss-csso"

import vueSplit from "gulp-vuesplit"
import layoutSelector from "postcss-layout-selector";
import fontSystem from "postcss-font-system";

import browserSync from "browser-sync";

var browserSyncServer = browserSync.create();

// Start local dev server.
gulp.task("serve", function() {
  browserSyncServer.init({
    open: false,
    logConnections: true,
    logFileChanges: true,
    reloadOnRestart: true,
    notify: false,
    port: 8085,
    server: {
      baseDir: "./src"
    }
  });
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
  postcss_csso({
    sourceMap: true
  }),
]

var postcss_options = {

}

gulp.task("postcss", function() {
  return gulp.src("src/main.css").
    pipe(sourcemaps.init()).
    pipe(postcss(postcss_processors, postcss_options)).
    pipe(rename({
      extname : ".bundle.css"
    })).
    pipe(sourcemaps.write(".", {
      includeContent: false
    })).
    pipe(gulp.dest("src"))
})

gulp.task("vuesplit", function() {
  return gulp.src("src/**/*.vue").
    pipe(vueSplit()).
    pipe(gulp.dest("."))
})

gulp.task("watch", [ "vuesplit", "postcss", "jspm" ], function()
{
  function log(event)
  {
    util.log(
      util.colors.green("Changed: ") +
      util.colors.magenta(path.basename(event.path))
    )
  }

  gulp.watch([
    "src/**/*.css",
    "!src/**/*.bundle.css"
  ], [ "postcss" ]).on("change", log)

  gulp.watch([
    "src/**/*.js",
    "!src/**/*.bundle.js"
  ], [ "jspm" ]).on("change", log)

  gulp.watch([
    "src/**/*.vue"
  ], [ "vuesplit" ]).on("change", log)

  gulp.watch([
    "src/*.html",
    "src/*.bundle.css",
    "src/*.bundle.js"
  ]).on('change', browserSyncServer.reload).on("change", log)
})

gulp.task("default", [ "serve", "watch" ]);

gulp.task("jspm", function() {
  builder.bundle("app/main", "src/main.bundle.js", {
    minify : false,
    mangle : false,
    sourceMaps: true,
    lowResSourceMaps: true
  })
})

gulp.task("jspm:deps", function() {
  builder.bundle("app/main - app/**/*", "src/deps.bundle.js", {
    minify : false,
    mangle : false,
    sourceMaps: true,
    lowResSourceMaps: true
  })
})
