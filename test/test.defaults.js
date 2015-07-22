/**
 * testing the defaults file
 */


"use strict";


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var should = require("should");


// own modules
var defaultsFilePath = path.resolve(__dirname, "../lib/defaults.json");


describe("defaults file", function() {
    it("is readable", function() {
        should.doesNotThrow(function() {
            fs.readFileSync(defaultsFilePath);
        });
    });

    it("is valid json", function() {
        var defaults = fs.readFileSync(defaultsFilePath);
        should.doesNotThrow(function() {
            JSON.parse(defaults);
        });
    });
});
