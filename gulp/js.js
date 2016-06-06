/* eslint no-console: 0 */

/*
========================================================================
   JavaScript Support
========================================================================
*/

import { $, logError, logChange, devServer } from "./common"

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
    "src/jspm_packages/system-polyfills.src.js",
    "src/jspm_packages/system.src.js",
    "src/jspm.browser.js",
    "src/jspm.config.js"
  ], { base: "src" }).
  pipe($.sourcemaps.init()).
  pipe($.concat("prep.bundle.js").on("error", logError)).
  pipe($.sourcemaps.write(".", {
    includeContent: false
  })).
  pipe(gulp.dest("src"))
)

var jspmBuilder = new jspm.Builder(".", "jspm.config.js")

gulp.task("js:main", () =>
  jspmBuilder.bundle("app", "src/main.bundle.js", jspmOptions)
)

gulp.task("js:deps", () =>
  jspmBuilder.bundle("app - app/**/*", "src/deps.bundle.js", jspmOptions)
)

gulp.task("js:build", [ "js:prep", "js:main" ])

gulp.task("js:lint", [ "vue:split" ], () =>
  gulp.src([
    "gulpfile*.js",
    "gulp/**.js",
    "src/app/**/*.js"
  ]).
  pipe($.eslint()).
  pipe($.eslint.format()).
  pipe($.eslint.failAfterError())
)

gulp.task("js:format", [ "vue:split" ], () =>
  gulp.src([
    "gulpfile*.js",
    "gulp/**.js",
    "src/app/**/*.js"
  ], { base: "." }).
  pipe($.eslint({ fix: true })).
  pipe($.eslint.format()).
  pipe(gulp.dest("."))
)

gulp.task("js:watch", () =>
{
  gulp.watch([
    "src/jspm_packages/system.src.js",
    "src/jspm.browser.js",
    "src/jspm.config.js"
  ], [ "js:prep" ]).
    on("change", logChange)

  gulp.watch([
    "src/app/**/*.js"
  ], [ "js:main" ]).
    on("change", logChange).
    on("change", (info) =>
      jspmBuilder.invalidate(info.path)
    )

  gulp.watch([
    "src/*.bundle.js"
  ]).
    on("change", devServer.reload).
    on("change", logChange)
})
