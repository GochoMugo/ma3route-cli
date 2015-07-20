/**
 * Terminal client for the Ma3Route REST API
 */


"use strict";


// npm-installed modules
var decamelize = require("decamelize");
var parser = require("simple-argparse");


// own modules
var lib = require("./lib");
var pkg = require("./package.json");


parser
    .version(pkg.version)
    .description("ma3route", "terminal client for the Ma3Route REST API v2")
    .epilog("See https://github.com/GochoMugo/ma3route-cli for source code and license")
    .option("config", "run configuration setup", lib.config.run);


// add options
for (var name in lib) {
    parser.option(decamelize(name, "-"), lib[name].description, lib[name].run);
}


parser.parse();
