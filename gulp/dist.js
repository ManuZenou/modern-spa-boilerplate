/* eslint no-console: 0 */

/*
========================================================================
   Distribution Build
========================================================================
*/

import gulp from "gulp"
import assetgraph from "assetgraph"
import del from "del"

gulp.task("clean-dist", () =>
  del([ "dist" ])
)

gulp.task("dist", [ "clean-dist", "build" ], function(done)
{
  var query = assetgraph.query;
  var includeSources = true;

  new assetgraph({root: "src"})
    .on("addAsset", function (asset) {
      console.log("- Process:", asset.toString());
    })
    .loadAssets("*.html")
    .populate({
      followRelations: {
        hrefType: ["relative", "rootRelative"],
        type: includeSources ?
          function() { return true } :
          query.not(["CssSourceMappingUrl", "JavaScriptSourceMappingUrl"])
      }
    })

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

    .moveAssetsInOrder({
      isLoaded: true,
      type: query.not([
        "Html"
      ])
    }, function (asset) {
      return "/static/" + asset.md5Hex.substr(0, 8) + asset.extension;
    })
    .setSourceMapRoot(null, null)
    .addCacheManifest()
    .writeAssetsToDisc({}, "dist")
    .run(function (err) {
      if (err) {
        console.error("AssetGraph Error:", err);
      }

      done();
    });
})
