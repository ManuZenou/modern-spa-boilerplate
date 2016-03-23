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
var posthtml = require('posthtml');
var posthtmlCssModules = require('posthtml-css-modules');
var templateValidate = require('vue-template-validator');

var htmlMinifier = require('html-minifier')

// required for Vue 1.0 shorthand syntax
var templateMinifyOptions = {
  customAttrSurround: [[/@/, new RegExp('')], [/:/, new RegExp('')]],
  collapseWhitespace: true,
  removeComments: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  // this is disabled by default to avoid removing
  // "type" on <input type="text">
  removeRedundantAttributes: false,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true
}

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

function cleanTemplateText(text) {
  return text.split("\n").map((line) => line.trim()).join("\n");
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
      var cssObj = new File({
        contents: new Buffer(result.css),
        path: path.replace(".vue", ".css")
      });

      var mappingObj = new File({
        contents: new Buffer(JSON.stringify(moduleMapping)),
        path: path.replace(".vue", ".css.json")
      })

      done(cssObj, mappingObj);
    }).
    catch(function(ex) {
      throw new Error(ex);
    });
  };

  var minifyTemplate = true;

  var processTemplate = function(done, text, path)
  {
    if (!text) {
      return done();
    }

    var warnings = templateValidate(text);
    warnings.forEach((msg) => {
      console.warn(msg)
    });

    console.log("Processing TEMPLATE...");
    posthtml([
      posthtmlCssModules(path.replace(".vue", ".css.json"))
    ]).
    process(text).
    then((result) => {
      var html = minifyTemplate ? htmlMinifier.minify(result.html, templateMinifyOptions) : cleanTemplateText(result.html);
      var htmlObj = new File({
        contents: new Buffer(html),
        path: path.replace(".vue", ".html")
      });

      var js = `export default ${JSON.stringify(html)}`;
      var jsObj = new File({
        contents: new Buffer(js),
        path: path.replace(".vue", ".html.js")
      });

      done(htmlObj, jsObj);
    }).
    catch(function(ex) {
      console.error("Error while transforming template: ", ex)
    });
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
    then(function(done, styleFile, mappingFile)
    {
      if (styleFile) {
        stream.push(styleFile);
      }

      if (mappingFile) {
        stream.push(mappingFile);
      }

      processTemplate(done, nodes.template, filePath)
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
