/* eslint no-console: 0 */

/*
========================================================================
   VueJS Support
========================================================================
*/

import gulp from "gulp"
import { $, logChange } from "./common"

gulp.task("vue:split", () =>
  gulp.src("src/**/*.vue").
    pipe($.vuesplit.default()).
    pipe(gulp.dest("."))
)

gulp.task("vue:watch", () =>
  gulp.watch([
    "src/**/*.vue"
  ], [ "vue:split" ]).on("change", logChange)
)
