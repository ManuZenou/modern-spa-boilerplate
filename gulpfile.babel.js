/* eslint no-console: 0 */

import path from "path"
import fs from "fs"
import del from "del"
import gulp from "gulp"
import notify from "node-notifier"

import loadPlugins from "load-plugins"

const $ = loadPlugins("gulp-*")
const $css = loadPlugins("postcss-*")

import postcss from "gulp-postcss"
import cssstats from "cssstats"

// Load Autoprefixer and register with plugin loader
import autoprefixer from "autoprefixer"
$css.autoprefixer = autoprefixer

// Load doiuse and register with plugin loader
import doiuse from "doiuse"
$css.doiuse = doiuse

// Load stylelint and register with plugin loader
import stylelint from "stylelint"
$css.stylelint = stylelint

// Load stylefmt and register with plugin loader
import stylefmt from "stylefmt"
$css.stylefmt = stylefmt

import layoutSelector from "postcss-layout-selector"
import fontSystem from "postcss-font-system"

import jspm from "jspm"

import browserSync from "browser-sync"



/*
========================================================================
   Common Features
========================================================================
*/

const AppShortTitle = "MSB"

function smartError(err)
{
  console.error(err.message)

  notify.notify({
    title: `${AppShortTitle}: Error`,
    message: err.message
  });

  // Display error in the browser
  browserSync.notify(err.message, 3000)

  // Prevent gulp from catching the error and exiting the watch process
  this.emit("end")
}

function getPath(event)
{
  return path.relative(__dirname, event.path)
}



/*
========================================================================
   VueJS Support
========================================================================
*/

gulp.task("vue:split", () =>
  gulp.src("src/**/*.vue").
    pipe($.vuesplit.default()).
    pipe(gulp.dest("."))
)




/*
========================================================================
   CSS Support
========================================================================
*/

var postcss_processors =
[
  $css.import({
    extensions: [ ".css", ".sss" ]
  }),
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
    sourceMap: true,
    restructure: false
  }),

  $css.reporter
]

var postcss_options =
{

}

var sourcemap_options = {
  includeContent: false,
  sourceRoot: "src"
}

gulp.task("css:lint", [ "vue:split" ], () =>
  gulp.src("src/main.css", { base: "src" }).
    pipe(postcss(
    [
      $css.import({
        extensions: [ ".css", ".sss" ]
      }),
      $css.stylelint(),
      $css.doiuse({
        browsers: ['ie >= 9', 'last 2 versions']
      }),
      $css.reporter({
        clearMessages: true
      })
    ]))
)

gulp.task("css:stats", [ "css:build" ], () =>
{
  var css = fs.readFileSync("main.bundle.css", "utf8")
  var stats = cssstats(css)
  console.log(`- Size: ${stats.humanizedSize} (${stats.humanizedGzipSize} zipped)`)
  console.log(`- Rules: ${stats.rules.total}`)
  console.log(`- Selectors: ${stats.selectors.total} (ID: ${stats.selectors.id}) (Type: ${stats.selectors.type})`)
  console.log(`- Declarations: ${stats.declarations.total}`)
  console.log(`- Media Queries: ${stats.mediaQueries.total}`)
})

gulp.task("css:format", () =>
  gulp.src("src/**/*.css", { base: "src" }).
    pipe(postcss([
      stylefmt
    ], postcss_options).on("error", smartError)).
    pipe(gulp.dest("src"))
)

gulp.task("css:build", () =>
  gulp.src("src/main.css", { base: "src" }).
    pipe($.sourcemaps.init()).
    pipe(postcss(postcss_processors, postcss_options).on("error", smartError)).
    pipe($.rename({
      extname: ".bundle.css"
    })).
    pipe($.sourcemaps.write(".", sourcemap_options)).
    pipe(gulp.dest("."))
)




/*
========================================================================
   JS Support
========================================================================
*/



var jspm_options = {
  minify: false,
  mangle: false,
  sourceMaps: true,
  lowResSourceMaps: true
}

gulp.task("js:prep", () =>
  gulp.src([
    "jspm_packages/system.src.js",
    "jspm.browser.js",
    "jspm.config.js"
  ]).
  pipe($.concat("prep.bundle.js").on("error", smartError)).
  pipe(gulp.dest("."))
)


gulp.task("js:main", () =>
{
  // Re-init Builder instance is currently required as it seems.
  // See also: https://github.com/systemjs/builder/issues/579
  var jspmBuilder = new jspm.Builder("src", "jspm.config.js")
  jspmBuilder.bundle("app/main", "main.bundle.js", jspm_options)
})

gulp.task("js:deps", () =>
{
  var jspmBuilder = new jspm.Builder("src", "jspm.config.js")
  jspmBuilder.bundle("app/main - app/**/*", "deps.bundle.js", jspm_options)
})

gulp.task("js:lint", [ "vue:split" ], () =>
  gulp.src([
    "gulpfile*.js",
    "src/**/*.js"
  ]).
  pipe($.eslint()).
  pipe($.eslint.format()).
  pipe($.eslint.failAfterError())
)

gulp.task("js:format", [ "vue:split" ], () =>
  gulp.src([
    "gulpfile*.js",
    "src/**/*.js"
  ]).
  pipe($.eslint({ fix: true })).
  pipe($.eslint.format())
)




/*
========================================================================
   Combined Tasks
========================================================================
*/

gulp.task("build", [
  "vue:split",
  "css:build",
  "js:prep",
  "js:main"
])

gulp.task("watch", [ "build" ], function()
{
  function log(event)
  {
    var cleanPath = getPath(event);

    $.util.log(
      $.util.colors.green("Changed: ") +
      $.util.colors.magenta(cleanPath)
    )

    notify.notify(
    {
      title: `${AppShortTitle}: File was changed`,
      message: cleanPath
    })
  }

  gulp.watch([
    "src/**/*.vue"
  ], [ "vue:split" ]).on("change", log)

  gulp.watch([
    "jspm_packages/system.src.js",
    "jspm.browser.js",
    "jspm.config.js"
  ], [ "js:prep" ]).
    on("change", log)

  gulp.watch([
    "src/**/*.js"
  ], [ "js:main" ]).
    on("change", log)

  gulp.watch([
    "src/**/*.css",
    "src/**/*.scss",
    "src/**/*.sss"
  ], [ "css:build" ]).
    on("change", log)

  gulp.watch([
    "*.bundle.css"
  ]).
    on("change", (event) =>
      gulp.src(getPath(event)).
        pipe(browserSyncServer.stream())
    ).
    on("change", log)

  gulp.watch([
    "*.html",
    "*.bundle.js"
  ]).
    on("change", browserSyncServer.reload).
    on("change", log)

  // protip: stop old version of gulp watch from running when you modify the gulpfile
  // via: https://gist.github.com/pornel/ca9631f5348383b61bc7b359e96ced38
  gulp.watch("gulpfile.babel.js").
    on("change", () =>
      process.exit(0)
    )
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
