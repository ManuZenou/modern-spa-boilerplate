import gulp from "gulp"
import rename from "gulp-rename"
import path from "path"
import util from "gulp-util"
import del from "del";

import jspm from "jspm";
const builder = new jspm.Builder("src", "jspm.config.js");

import postcss from "gulp-postcss"
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

import splitPlugin from "gulp-vuesplit"
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
    notify: false,
    port: 8085,
    server: {
      baseDir: "./src"
    }
  });
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
  postcss_cssnano,
]

var postcss_options = {

}

gulp.task("postcss", function() {
  return gulp.src("src/main.css").
    pipe(postcss(postcss_processors, postcss_options)).
    pipe(rename({
      extname : ".bundle.css"
    })).
    pipe(gulp.dest("src"))
})

gulp.task("vuesplit", function() {
  return gulp.src("src/**/*.vue").
    pipe(splitPlugin()).
    pipe(gulp.dest("."))
})

gulp.task("watch", [ "vuesplit", "postcss", "jspm" ], function()
{
  function log(event)
  {
    util.log(
      util.colors.green("Changed: ") +
      util.colors.magenta(path.basename(event.path))
    )
  }

  gulp.watch([
    "src/**/*.css",
    "!src/**/*.bundle.css"
  ], [ "postcss" ]).on("change", log)

  gulp.watch([
    "src/**/*.js",
    "!src/**/*.bundle.js"
  ], [ "jspm" ]).on("change", log)

  gulp.watch([
    "src/**/*.vue"
  ], [ "vuesplit" ]).on("change", log)

  gulp.watch([
    "src/*.html",
    "src/*.bundle.css",
    "src/*.bundle.js"
  ]).on('change', browserSyncServer.reload).on("change", log)
})

gulp.task("default", [ "serve", "watch" ]);

gulp.task("jspm", function() {

  builder.bundle("app/main", "src/main.bundle.js", { minify : false, mangle : false, sourceMaps: true })
})

import npmResolve from "resolve";
import fs from "fs";




function crossResolver(id)
{
  console.log("Query for: ", id);

  return new Promise(function(resolve, reject)
  {
    npmResolve(id, {
      basedir: __dirname
    },
    function (err, npmResult)
    {
      if (err)
      {
        var isFileRequest = id.indexOf("/") !== -1;
        var idFileExt = isFileRequest && path.extname(id) || null;

        // console.log("NPM Lookup Failed: ", err);
        jspm.normalize(id).then(function(jspmResult)
        {
          // Convert to non-url real usable file system path
          jspmResult = jspmResult.replace("file://", "");

          // The JSPM normalization falls back to working directory + ID even if the
          // file / directory does not exist.
          fs.lstat(jspmResult, function(err)
          {
            if (err) {

              let resolvedExt = path.extname(jspmResult);
              if (idFileExt !== resolvedExt) {
                let jspmResultFixed = jspmResult.slice(0, -resolvedExt.length)
                fs.lstat(jspmResultFixed, function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(jspmResultFixed)
                  }
                })

                return;
              }

              reject(err);
            } else {
              resolve(jspmResult)
            }
          })
        }).
        catch(function(jspmError) {
          reject(jspmError);
        })
      }
      else
      {
        resolve(npmResult);
      }
    })
  })
}


gulp.task("oh", function()
{
  return Promise.all([
    crossResolver("jspm"),
    crossResolver("vue"),
    crossResolver("normalize.css"),
    crossResolver("normalize.css/normalize.css")
  ]).then(function(values) {
    return values.map(function(entry) {
      return path.relative(__dirname, entry)
    })
  }).then(function(relativeValues) {
    console.log("Resolved: ", relativeValues);
  }).catch(function(err) {
    console.error("Error: ", err);
  })
});




gulp.task("play", function(done) {
  jspm.normalize("normalize.css").then(function(res) {
    res = res.replace("file://", "");
    console.log("Result: ", res);

    npmResolve("jspm", { basedir: __dirname }, function (err, res) {
      if (err)
        console.error(err)
      else
        console.log("NPM-Result JSPM: ", res);
    })

    npmResolve("normalize.css", { basedir: res }, function (err, res) {
      if (err)
        console.error(err)
      else
        console.log("NPM-Result normalize1: ", res);
    })

    npmResolve(".", { basedir: res }, function (err, res) {
      if (err)
        console.error(err)
      else
        console.log("NPM-Result normalize2: ", res);
    })

    npmResolve("./normalize.css", { basedir: res }, function (err, res) {
      if (err)
        console.error(err)
      else
        console.log("NPM-Result normalize3: ", res);
    })


  })

  jspm.normalize("vue").then(function(res) {
    res = res.replace("file://", "");
    console.log("Vue-Result: ", res);

    npmResolve(".", { basedir: res }, function (err, res) {
      if (err)
        console.error(err)
      else
        console.log("NPM-Result vue: ", res);
    })


  })

})


