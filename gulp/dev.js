/* eslint no-console: 0 */

/*
========================================================================
   Developer Support
========================================================================
*/

import gulp from "gulp"
import notify from "node-notifier"

import { $, logError, AppShortTitle, getPath, logChange, devServer } from "./common";

gulp.task("build",
[
  "vue:split",
  "css:build",
  "js:build"
])

gulp.task("watch", [ "build" ], function()
{
  gulp.start("vue:watch")
  gulp.start("css:watch")
  gulp.start("js:watch")

  gulp.watch("*.html").
    on("change", devServer.reload).
    on("change", logChange)

  // protip: stop old version of gulp watch from running when you modify the gulpfile
  // via: https://gist.github.com/pornel/ca9631f5348383b61bc7b359e96ced38
  gulp.watch([
    "gulpfile.babel.js",
    "gulp/*.js"
  ]).
    on("change", () =>
      process.exit(0)
    )
})

gulp.task("serve", function()
{
  devServer.init({
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
