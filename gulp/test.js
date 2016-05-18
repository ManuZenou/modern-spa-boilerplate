/* eslint no-console: 0 */

/*
========================================================================
   Test Suite Support
========================================================================
*/

import gulp from "gulp"
import run from "run-sequence"
import child from "child_process"

import { $, logChange, devServer } from "./common"

gulp.task("test:ui", (done) =>
  run([ "test:ui:phantomjs", "test:ui:slimerjs" ], done)
)

gulp.task("test:ui:phantomjs", [ "build" ], (done) =>
  child.exec("casperjs test --concise --log-level=debug --engine=phantomjs uitest.js", done)
)

gulp.task("test:ui:slimerjs", [ "build" ], (done) =>
  child.exec("casperjs test --concise --log-level=debug --engine=slimerjs uitest.js", done)
)
