/**
 * Terminal client for the Ma3Route REST API
 */


"use strict";


// npm-installed modules
var decamelize = require("decamelize");
var parser = require("simple-argparse");


// own modules
var lib = require(".");
var pkg = require("../package.json");


parser
    .version(pkg.version)
    .description("ma3route", "terminal client for the Ma3Route REST API v2")
    .epilog("See https://github.com/GochoMugo/ma3route-cli for source code and license")
    .option("c", "config", "run configuration setup", lib.config.run)
    .prerun(function() {
      if (this.debug) {
        process.env.DEBUG = process.env.DEBUG || 1;
        delete this.debug;
      }
    });


// add options
for (var name in lib.options) {
    var option = lib.options[name];
    parser.option(option.descriptor.short, decamelize(name, "-"), option.description, option.run);
}


parser.parse();
