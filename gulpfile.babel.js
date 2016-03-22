var gulp = require('gulp');
var connect = require('gulp-connect');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');
var atImport = require("postcss-import");
var rename = require("gulp-rename");
var path = require('path');
var util = require('gulp-util');

// Start local dev server.
gulp.task('serve', function () {
  connect.server({
    root: "src",
    port: 8085,
    https: false,
    livereload: true
  });
});

var postcss_processors = [
  atImport,
  nested,
  autoprefixer
];

var postcss_options = {

};

gulp.task('postcss', function() {
  gulp.src("src/main.css").
    pipe(postcss(postcss_processors, postcss_options)).
    pipe(rename({
      extname : ".bundle.css"
    })).
    pipe(gulp.dest("src")).
    pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(["src/**/*.css", "!src/**/*.bundle.css"], ["postcss"]).on('change', logChanges);
  gulp.watch(["src/**/*.vue"], ["vueify"]).on('change', logChanges);
});

function logChanges(event) {
  util.log(
    util.colors.green('File ' + event.type + ': ') +
    util.colors.magenta(path.basename(event.path))
  );
}



var through = require('through2');
var parse5 = require('parse5');
var deindent = require('de-indent');
var File = require('vinyl');
var postcss = require('postcss');

function vueifyPlugin()
{
  var transform = function(file, encoding, callback)
  {
    var content = file.contents.toString('utf8');
    var fragment = parse5.parseFragment(content, {
      locationInfo: true
    });

    var filePath = file.path;
    var id = "";
    var hasScopedStyle = false;
    var stream = this;

    Promise.all(fragment.childNodes.map((node) =>
    {
      // Ignore text nodes - typically just white space
      if (node.nodeName === "#text") {
        return;
      }

      console.log("- Vue Process: " + node.nodeName);

      switch (node.nodeName)
      {
        case 'template':
          var segmentContent = deindent(parse5.serialize(node.content));
          stream.push(new File({
            contents: new Buffer(segmentContent),
            path: filePath.replace(".vue", ".html")
          }));
          break;

        case 'style':
          var segmentContent = deindent(parse5.serialize(node));

          return postcss([
            require('postcss-modules')({
              getJSON: function(cssFileName, json) {
                console.log("Module Mapping Config: ", json)
              }
            })
          ]).
          process(segmentContent).
          then(function(transformedCSS) {
            stream.push(new File({
              contents: new Buffer(transformedCSS.css),
              path: filePath.replace(".vue", ".css")
            }));
          }).catch(function(ex) {
            console.error("Ooops: " + ex);
          })

          break;

        case 'script':
          var segmentContent = deindent(parse5.serialize(node));
          stream.push(new File({
            contents: new Buffer(segmentContent),
            path: filePath.replace(".vue", ".js")
          }));
          break;
      }
    })).
    then(callback);
  };

  return through.obj(transform);
};

gulp.task('vueify', function() {
  gulp.src("src/**/*.vue").
    pipe(vueifyPlugin()).
    pipe(gulp.dest("."));
});
