/* eslint no-console: 0 */

/*
========================================================================
   JS Support
========================================================================
*/

import { $, logError, logChange, devServer, sourceMapOptions } from "./common";

import gulp from "gulp"
import jspm from "jspm"

var jspmOptions =
{
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
  ], { base : "." }).
  pipe($.sourcemaps.init()).
  pipe($.concat("prep.bundle.js").on("error", logError)).
  pipe($.sourcemaps.write(".", {
    includeContent: false,
    destPath: "."
  })).
  pipe(gulp.dest("."))
)

var jspmBuilder = new jspm.Builder("src", "jspm.config.js")

gulp.task("js:main", () =>
{
  // Re-init Builder instance is currently required as it seems.
  // See also: https://github.com/systemjs/builder/issues/579
  jspmBuilder.bundle("app", "main.bundle.js", jspmOptions)
})

gulp.task("js:deps", () =>
{
  jspmBuilder.bundle("app/main - app/**/*", "deps.bundle.js", jspmOptions)
})

gulp.task("js:build", [ "js:prep", "js:main" ])

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

gulp.task("js:watch", () =>
{
  gulp.watch([
    "jspm_packages/system.src.js",
    "jspm.browser.js",
    "jspm.config.js"
  ], [ "js:prep" ]).
    on("change", logChange)

  gulp.watch([
    "src/**/*.js"
  ], [ "js:main" ]).
    on("change", logChange).
    on("change", function(info) {
      jspmBuilder.invalidate(info.path)
    })

  gulp.watch([
    "*.bundle.js"
  ]).
    on("change", devServer.reload).
    on("change", logChange)
})
