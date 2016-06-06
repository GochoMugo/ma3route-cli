/**
 * testing the main module
 */


"use strict";


// npm-installed modules
var should = require("should");


// own modules
var config = require("../lib/config");
var lib = require("../lib");
var generate = require("../lib/generate");


describe("main module", function() {
    it("exports the config module", function() {
        should.deepEqual(lib.config, config);
    });

    it("exports generated options", function() {
        should(lib.options).containDeep(generate.make());
    });
});
