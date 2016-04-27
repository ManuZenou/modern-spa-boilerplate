import test from "ava"
import "babel-register"
import gulp from "gulp"
import plugins from "gulp-load-plugins"
import "./gulpfile.babel"

const $ = plugins()

test("Successfully loaded", (t) => {
  t.is(typeof gulp.task, "function")
})

test("Plugins Ready", (t) => {
  t.is(typeof $, "object")
})

test("Running Build", (t) => {
  gulp.start("build")
})
