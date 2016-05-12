/* eslint no-console: 0 */

/*
========================================================================
   Distribution Build
========================================================================
*/

import gulp from "gulp"
import AssetGraph from "assetgraph"
import del from "del"
import run from "run-sequence"

import { $, logError } from "./common"

const compressableFiles = [
  "dist/**/*.html",
  "dist/**/*.css",
  "dist/**/*.js",
  "dist/**/*.json",
  "dist/**/*.xml",
  "dist/**/*.svg",
  "dist/**/*.otf",
  "dist/**/*.ttf",
  "dist/**/*.map"
]

gulp.task("dist:clean", () =>
  del([ "dist" ])
)

gulp.task("dist", (done) =>
  run([ "dist:clean", "build" ], "dist:copy", "dist:compress", done)
)

gulp.task("dist:compress", [ "dist:compress:zopfli", "dist:compress:brotli" ])

gulp.task("dist:compress:zopfli", () =>
  gulp.src(compressableFiles).
    pipe($.zopfli()).
    pipe(gulp.dest("dist"))
)

gulp.task("dist:compress:brotli", () =>
  gulp.src(compressableFiles).
    pipe($.brotli.compress()).
    pipe(gulp.dest("dist"))
)

gulp.task("dist:copy", function(done)
{
  var query = AssetGraph.query
  var includeSources = true

  new AssetGraph({ root: "src" }).
    on("addAsset", function(asset) {
      console.log("- Process:", asset.toString())
    }).
    loadAssets("*.html").
    populate({
      followRelations: {
        hrefType: [ "relative", "rootRelative" ],
        type: includeSources ?
          function() { return true } :
          query.not([ "CssSourceMappingUrl", "JavaScriptSourceMappingUrl" ])
      }
    }).

    // Via: https://mntr.dk/2014/getting-started-with-assetgraph/
    /*
    .inlineRelations({
        type: 'CssImage',
        to: {
            isLoaded: true,
            isInline: false,
            rawSrc: function (rawSrc) {
                return rawSrc.length < 4096;
            }
        }
    })
    */

    moveAssetsInOrder({
      isLoaded: true,
      type: query.not([
        "Html"
      ])
    }, function(asset) {
      return "/static/" + asset.md5Hex.substr(0, 8) + asset.extension
    }).

    // waiting for release of new assetgraph version
    // setSourceMapRoot(null, null).
    queue(function setSourceMapRoot(assetGraph) {
      assetGraph.findAssets({type: 'SourceMap'}).forEach(function (mapFile) {
        delete mapFile.parseTree.sourceRoot;
      });
    }).

    addCacheManifest().
    writeAssetsToDisc({}, "dist").
    run(function(err) {
      if (err) {
        console.error("AssetGraph Error:", err)
      }

      done()
    })
})
