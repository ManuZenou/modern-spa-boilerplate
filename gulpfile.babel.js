import path from "path"
import del from "del";

import postcss from "gulp-postcss"
import gulp from "gulp"

import gulpPlugins from "gulp-load-plugins"
import cssPlugins from "postcss-load-plugins"

const $ = gulpPlugins()
const $css = cssPlugins()

import jspm from "jspm";
const builder = new jspm.Builder("src", "jspm.config.js")
import resolve from "pkg-resolve";

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

// import vueSplit from "gulp-vuesplit"
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
    injectChanges: true,
    notify: true,
    port: 8085,
    server: {
      baseDir: "./"
    }
  });
})




gulp.task("vuesplit", function() {
  return gulp.src("src/**/*.vue").
    pipe($.vuesplit.default()).
    pipe(gulp.dest("."))
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
  return gulp.src("src/main.css", { base: "src" }).
    pipe($.sourcemaps.init()).
    pipe(postcss(postcss_processors, postcss_options)).
    pipe($.rename({
      extname : ".bundle.css"
    })).
    pipe($.sourcemaps.write(".", {
      includeContent: false,
      sourceRoot: "src"
    })).
    pipe(gulp.dest("."))
})



gulp.task("jspm:prep", function() {
  return gulp.src([
    "jspm_packages/system.src.js",
    "jspm.browser.js",
    "jspm.config.js"
  ]).
  pipe($.concat("prep.bundle.js")).
  pipe(gulp.dest("."))
});

gulp.task("jspm:main", function() {
  return builder.bundle("app/main", "main.bundle.js", {
    minify : false,
    mangle : false,
    sourceMaps: true,
    lowResSourceMaps: true
  })
})

gulp.task("jspm:deps", function() {
  return builder.bundle("app/main - app/**/*", "deps.bundle.js", {
    minify : false,
    mangle : false,
    sourceMaps: true,
    lowResSourceMaps: true
  })
})



gulp.task("build", [ "vuesplit", "postcss", "jspm:prep", "jspm:main" ])


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
  ], [ "jspm:prep"]).on("change", log)

  gulp.watch([
    "src/**/*.js"
  ], [ "jspm:main" ]).on("change", log)

  gulp.watch([
    "src/**/*.css"
  ], [ "postcss" ]).on("change", log)

  gulp.watch([
    "*.bundle.css"
  ], function() {
    gulp.src("*.bundle.css").
      pipe(browserSyncServer.stream());
  })

  gulp.watch([
    "*.html",
    "*.bundle.js"
  ]).on('change', browserSyncServer.reload).on("change", log)

  // protip: stop old version of gulp watch from running when you modify the gulpfile
  // via: https://gist.github.com/pornel/ca9631f5348383b61bc7b359e96ced38
  gulp.watch("gulpfile.babel.js").on("change", () => process.exit(0));
})

gulp.task("default", [ "serve", "watch" ]);
