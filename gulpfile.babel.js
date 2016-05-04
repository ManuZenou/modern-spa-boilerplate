import path from "path"
import del from "del"
import gulp from "gulp"

import loadPlugins from "load-plugins"

const $ = loadPlugins("gulp-*")
const $css = loadPlugins("postcss-*")

import postcss from "gulp-postcss"

// Load Autoprefixer and register with plugin loader
import autoprefixer from "autoprefixer"
$css.autoprefixer = autoprefixer

import stylefmt from "stylefmt"
import layoutSelector from "postcss-layout-selector"
import fontSystem from "postcss-font-system"

import jspm from "jspm"

import browserSync from "browser-sync"



/*
========================================================================
   Common Features
========================================================================
*/

function smartError(err)
{
  console.error(err.message);
  browserSync.notify(err.message, 3000); // Display error in the browser
  this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
}




/*
========================================================================
   VueJS Support
========================================================================
*/

gulp.task("vue:split", function() {
  return gulp.src("src/**/*.vue").
    pipe($.vuesplit.default()).
    pipe(gulp.dest("."))
})




/*
========================================================================
   CSS Support
========================================================================
*/

var postcss_processors =
[
  $css.import,
  $css.discardComments,

  $css.advancedVariables,
  $css.sassyMixins,
  $css.willChange,
  $css.extend,

  $css.assets,
  $css.calc,
  $css.gradientTransparencyFix,
  $css.easings,
  $css.colorFunction,
  $css.colorHexAlpha,

  $css.nested,
  $css.autoprefixer,
  $css.csso({
    sourceMap: true
  })
]

var postcss_options =
{

}

gulp.task("css:lint", function() {
  return gulp.src("src/**/*.css", { base: "src" }).
    pipe($.stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
})

gulp.task("css:format", function() {
  return gulp.src("src/**/*.css", { base: "src" }).
    pipe(postcss([
      stylefmt
    ], postcss_options).on("error", smartError)).
    pipe(gulp.dest("src"))
})

gulp.task("css:build", function() {
  return gulp.src("src/main.css", { base: "src" }).
    pipe($.sourcemaps.init()).
    pipe(postcss(postcss_processors, postcss_options).on("error", smartError)).
    pipe($.rename({
      extname : ".bundle.css"
    })).
    pipe($.sourcemaps.write(".", {
      includeContent: false,
      sourceRoot: "src"
    })).
    pipe(gulp.dest("."))
})




/*
========================================================================
   JS Support
========================================================================
*/

const jspmBuilder = new jspm.Builder("src", "jspm.config.js")

gulp.task("jspm:prep", function() {
  return gulp.src([
    "jspm_packages/system.src.js",
    "jspm.browser.js",
    "jspm.config.js"
  ]).
  pipe($.concat("prep.bundle.js").on("error", smartError)).
  pipe(gulp.dest("."))
})

gulp.task("jspm:main", function() {
  return jspmBuilder.bundle("app/main", "main.bundle.js", {
    minify : false,
    mangle : false,
    sourceMaps: true,
    lowResSourceMaps: true
  })
})

gulp.task("jspm:deps", function() {
  return jspmBuilder.bundle("app/main - app/**/*", "deps.bundle.js", {
    minify : false,
    mangle : false,
    sourceMaps: true,
    lowResSourceMaps: true
  })
})




/*
========================================================================
   Combined Tasks
========================================================================
*/

gulp.task("build", [
  "vuesplit",
  "css:build",
  "jspm:prep",
  "jspm:main"
])

gulp.task("watch", [ "build" ], function()
{
  function log(event)
  {
    $.util.log(
      $.util.colors.green("Changed: ") +
      $.util.colors.magenta(path.basename(event.path))
    )
  }

  gulp.watch([
    "src/**/*.vue"
  ], [ "vuesplit" ]).on("change", log)

  gulp.watch([
    "jspm_packages/system.src.js",
    "jspm.browser.js",
    "jspm.config.js"
  ], [ "jspm:prep" ]).on("change", log)

  gulp.watch([
    "src/**/*.js"
  ], [ "jspm:main" ]).on("change", log)

  gulp.watch([
    "src/**/*.css"
  ], [ "css:build" ]).on("change", log)

  gulp.watch([
    "*.bundle.css"
  ], function() {
    gulp.src("*.bundle.css").
      pipe(browserSyncServer.stream())
  })

  gulp.watch([
    "*.html",
    "*.bundle.js"
  ]).on("change", browserSyncServer.reload).on("change", log)

  // protip: stop old version of gulp watch from running when you modify the gulpfile
  // via: https://gist.github.com/pornel/ca9631f5348383b61bc7b359e96ced38
  gulp.watch("gulpfile.babel.js").on("change", () => process.exit(0))
})

var browserSyncServer = browserSync.create()

gulp.task("serve", function()
{
  browserSyncServer.init({
    open: false,
    logConnections: true,
    logFileChanges: true,
    reloadOnRestart: true,
    injectChanges: true,
    notify: true,
    port: 8085,
    server: {
      baseDir: "./"
    }
  })
})

gulp.task("default", [ "serve", "watch" ])
