/*
========================================================================
   CSS Support
========================================================================
*/

import { $, logError, logChange, devServer } from "./common";

import fs from "fs"
import gulp from "gulp"
import loadPlugins from "load-plugins"

const $css = loadPlugins("postcss-*")

var autoprefixer_settings =
{
  browsers: ["> 2% in DE", "IE 10", "IE 11", "last 3 Chrome versions", "last 3 Firefox versions"],
  cascade: false,
  flexbox: "no-2009"
}

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

// Load immutable-css and register with plugin loader
import immutable from "immutable-css"
$css.immutable = immutable

import layoutSelector from "postcss-layout-selector"
import fontSystem from "postcss-font-system"




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
  $css.autoprefixer(autoprefixer_settings),
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

      $css.advancedVariables,
      $css.sassyMixins,
      $css.willChange,
      $css.calc,
      $css.nested,

      $css.stylelint(),
      $css.doiuse({
        browsers: autoprefixer_settings.browsers,
        ignore: ["css-appearance", "text-size-adjust"]
      }),
      $css.immutable(),
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
    ], postcss_options).on("error", logError)).
    pipe(gulp.dest("src"))
)

gulp.task("css:build", () =>
  gulp.src("src/main.css", { base: "src" }).
    pipe($.sourcemaps.init()).
    pipe(postcss(postcss_processors, postcss_options).on("error", logError)).
    pipe($.rename({
      extname: ".bundle.css"
    })).
    pipe($.sourcemaps.write(".", sourcemap_options)).
    pipe(gulp.dest("."))
)

gulp.task("css:watch", () =>
{
  gulp.watch([
    "src/**/*.css",
    "src/**/*.scss",
    "src/**/*.sss"
  ], [ "css:build" ]).
    on("change", logChange)

  gulp.watch([
    "*.bundle.css"
  ]).
    on("change", (event) =>
      gulp.src(getPath(event)).
        pipe(devServer.stream())
    ).
    on("change", logChange)
})
