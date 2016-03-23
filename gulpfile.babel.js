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
var ASQ = require("asynquence");

function convertFragmentIntoNodeMap(fragment)
{
  var nodes = {};
  fragment.childNodes.forEach(function(child) {
    // Ignore text (typically just white space) and comment nodes
    if (child.nodeName === "#text" || child.nodeName === "#comment") {
      return;
    }

    var content = deindent(parse5.serialize(child.content || child)).trim();
    nodes[child.nodeName] = content;
  })

  return nodes;
}

function getContentFromNode(node) {
  return deindent(parse5.serialize(node.content || node));
}

function vueifyPlugin()
{
  var processStyle = function(done, text, path)
  {
    if (!text) {
      return done();
    }

    console.log("Processing STYLE...");

    var moduleMapping = null;
    postcss([
      require('postcss-modules')({
        getJSON: function(cssFileName, json) {
          moduleMapping = json;
        }
      })
    ]).
    process(text).
    then(function(result) {
      var fileObj = new File({
        contents: new Buffer(result.css),
        path: path.replace(".vue", ".css")
      });
      done(fileObj, moduleMapping);
    }).
    catch(function(ex) {
      throw new Error(ex);
    });
  };

  var processTemplate = function(done, text, path, mapping)
  {
    if (!text) {
      return done();
    }

    console.log("Processing TEMPLATE...");
    console.log("Using mapping: ", mapping)

    var fileObj = new File({
      contents: new Buffer(text),
      path: path.replace(".vue", ".html")
    });

    done(fileObj);
  };

  var processScript = function(done, text, path)
  {
    if (!text) {
      return done();
    }

    console.log("Processing SCRIPT...");

    var fileObj = new File({
      contents: new Buffer(text),
      path: path.replace(".vue", ".js")
    });

    done(fileObj);
  }


  var transform = function(file, encoding, callback)
  {
    var content = file.contents.toString('utf8');
    var fragment = parse5.parseFragment(content, {
      locationInfo: true
    });
    var nodes = convertFragmentIntoNodeMap(fragment);
    var stream = this;
    var filePath = file.path;
    var moduleMapping = null;

    var styleNode = nodes.style;
    var htmlNode = nodes.html;
    var scriptNode = nodes.script;

    ASQ(function(done) {
      processStyle(done, nodes.style, filePath)
    }).
    then(function(done, styleFile, mappingInfo)
    {
      if (styleFile) {
        stream.push(styleFile);
      }

      processTemplate(done, nodes.template, filePath, mappingInfo)
    }).
    then(function(done, htmlFile)
    {
      if (htmlFile) {
        stream.push(htmlFile);
      }

      processScript(done, nodes.script, filePath)
    }).
    then(function(done, scriptFile)
    {
      if (scriptFile) {
        stream.push(scriptFile);
      }

      console.log("ALL DONE")
      callback();
    }).
    or(function(ex) {
      console.error("ERROR: " + ex);
    });
  };

  return through.obj(transform);
};

gulp.task('vueify', function() {
  return gulp.src("src/**/*.vue").
    pipe(vueifyPlugin()).
    pipe(gulp.dest("."));
});
