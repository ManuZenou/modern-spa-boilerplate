SystemJS.config({
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.8"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "app": {
      "format": "esm",
      "main": "main.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "json": "github:systemjs/plugin-json@0.1.2",
    "lodash": "npm:lodash@4.13.1",
    "module": "github:jspm/nodelibs-module@0.2.0-alpha",
    "normalize.css": "github:necolas/normalize.css@4.1.1",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vue": "npm:vue@1.0.24",
    "vuex": "npm:vuex@0.6.3",
    "vuex-validator": "npm:vuex-validator@0.2.7"
  },
  packages: {
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.6.0"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:envify@3.4.0": {
      "map": {
        "jstransform": "npm:jstransform@10.1.0",
        "through": "npm:through@2.3.8"
      }
    },
    "npm:jstransform@10.1.0": {
      "map": {
        "base62": "npm:base62@0.1.1",
        "esprima-fb": "npm:esprima-fb@13001.1001.0-dev-harmony-fb",
        "source-map": "npm:source-map@0.1.31"
      }
    },
    "npm:source-map@0.1.31": {
      "map": {
        "amdefine": "npm:amdefine@1.0.0"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4"
      }
    },
    "npm:vue@1.0.24": {
      "map": {
        "envify": "npm:envify@3.4.0"
      }
    },
    "npm:vuex-validator@0.2.7": {
      "map": {
        "lodash-es": "npm:lodash-es@4.13.1"
      }
    },
    "npm:buffer@4.6.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.2",
        "isarray": "npm:isarray@1.0.0",
        "ieee754": "npm:ieee754@1.1.6"
      }
    },
    "npm:readable-stream@2.1.4": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "util-deprecate": "npm:util-deprecate@1.0.2",
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "string_decoder": "npm:string_decoder@0.10.31",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "core-util-is": "npm:core-util-is@1.0.2"
      }
    }
  }
});
