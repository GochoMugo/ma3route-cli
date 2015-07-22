/**
 * testing the generate module
 */


"use strict";


// npm-installed modules
var sdk = require("ma3route-sdk");
var should = require("should");


// own modules
var generate = require("../lib/generate");


describe("generate module", function() {
    it("exports a make function", function() {
        should(generate.make).be.a.Function();
    });

    it("exports an Option constructor", function() {
        should(generate.Option).be.a.Function();
    });
});


describe("generate.make", function() {
    it("returns object of options", function() {
        should(generate.make()).be.an.Object();
    });

    it("all returned options are instances of Options", function() {
        var options = generate.make();
        for (var name in options) {
            should(options[name]).be.an.instanceOf(generate.Option);
        }
    });

    it("all returned options are from the SDK lib", function() {
        var options = generate.make();
        for (var name in options) {
            should(sdk[name]).be.an.Object();
        }
    });

    it("ignores some SDK inner modules", function() {
        var options = generate.make();
        var excludes = ["sse", "Client", "auth", "utils"];
        excludes.forEach(function(exclude) {
            should(sdk[exclude]).not.be.Undefined();
            should(options[exclude]).be.Undefined();
        });
    });
});
