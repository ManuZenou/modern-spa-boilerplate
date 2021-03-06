/* eslint no-console: 0 */

/*
========================================================================
   CSS Support
========================================================================
*/

import { $, logError, logChange, devServer, getPath } from "./common"

import fs from "fs"
import gulp from "gulp"
import loadPlugins from "load-plugins"

const $css = loadPlugins("postcss-*")

const autoprefixerSettings =
{
  browsers: [ "> 2% in DE", "IE 10", "IE 11", "last 3 Chrome versions", "last 3 Firefox versions" ],
  cascade: false,
  flexbox: "no-2009"
}

import postcss from "gulp-postcss"
import cssstats from "cssstats"

// Load Autoprefixer and register with plugin loader
import autoprefixer from "autoprefixer"
$css.autoprefixer = autoprefixer

// Load Lost Grid and register with plugin loader
import lost from "lost"
$css.lost = lost

// Load linting tools
import doiuse from "doiuse"
import stylelint from "stylelint"
import stylefmt from "stylefmt"
import immutable from "immutable-css"
import colorguard from "colorguard"



var postcss_processors =
[
  /*
  // Log execution time for each plugin in a PostCSS instance.
  $css.devtools({
    silent: true
  }),
  */
  /*
  $css.import({
    extensions: [ ".css", ".sss" ]
  }),
  */
  $css.load.default(),
  $css.discardComments({
    removeAll: true
  }),

  $css.advancedVariables({
    variables: {}
  }),
  $css.sassyMixins,
  $css.willChange,

  // TODO
  // $css.fontSystem.default(),

  $css.layoutSelector.default({
    layout: "landscape"
  }),

  /*
  $css.assets({
    relative: "src/"
  }),
  */

  $css.calc,
  $css.gradientTransparencyFix,
  $css.easings,
  $css.colorFunction,
  $css.colorHexAlpha,
  $css.flexbugsFixes,
  $css.clearfix,
  $css.zindex,

  // Support for CSS Media Queries Level 4: https://drafts.csswg.org/mediaqueries/#mq-range-context
  $css.mediaMinmax,

  $css.nested,
  $css.extend,
  $css.pseudoClassAnyLink,
  $css.selectorMatches,
  $css.lost,
  $css.responsiveType,

  $css.pseudoelements,
  $css.autoprefixer(autoprefixerSettings),

  /*$css.csso({
    sourceMap: true,
    restructure: false
  }),*/

  $css.svgo,
  $css.reporter({
    clearMessages: true
  })
]

var postcss_options =
{

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

      stylelint(),
      doiuse({
        browsers: autoprefixerSettings.browsers,
        ignore: [ "css-appearance", "text-size-adjust" ]
      }),
      immutable(),
      colorguard(),

      $css.reporter({
        clearMessages: true
      })
    ]))
)

gulp.task("css:stats", [ "css:build" ], () =>
{
  var css = fs.readFileSync("src/main.bundle.css", "utf8")
  var stats = cssstats(css)
  console.log(`- Size: ${stats.humanizedSize} (${stats.humanizedGzipSize} zipped)`)
  console.log(`- Rules: ${stats.rules.total}`)
  console.log(`- Selectors: ${stats.selectors.total} (ID: ${stats.selectors.id}) (Type: ${stats.selectors.type})`)
  console.log(`- Declarations: ${stats.declarations.total}`)
  console.log(`- Media Queries: ${stats.mediaQueries.total}`)
})

gulp.task("css:format", () =>
  gulp.src("src/app/**/*.css", { base: "src" }).
    pipe(postcss([
      stylefmt
    ], postcss_options).on("error", logError)).
    pipe(gulp.dest("src"))
)

gulp.task("css:build", () =>
  gulp.src("src/app/main.css", { base: "src/app" }).
    pipe($.sourcemaps.init()).
    pipe(postcss(postcss_processors, postcss_options).on("error", logError)).
    pipe($.rename({
      extname: ".bundle.css"
    })).
    pipe($.sourcemaps.write(".", {
      includeContent: false,
      destPath: "src"
    })).
    pipe(gulp.dest("src"))
)

gulp.task("css:watch", () =>
{
  gulp.watch([
    "src/app/**/*.css",
    "src/app/**/*.scss",
    "src/app/**/*.sss"
  ], [ "css:build" ]).
    on("change", logChange)

  gulp.watch([
    "src/*.bundle.css"
  ]).
    on("change", (event) =>
      gulp.src(getPath(event)).
        pipe(devServer.stream())
    ).
    on("change", logChange)
})
