/**
 * testing the connfiguration module
 */


"use strict";


// built-in modules
var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");


// npm-installed modules
var should = require("should");


// own modules
var config = require("../lib/config");


// module variables
var originalPath = config.getConfigFilePath();
var tmpPath = originalPath + "~";


before(function(done) {
    fs.rename(originalPath, tmpPath, function() {
        return done();
    });
});

after(function(done) {
    fs.rename(tmpPath, originalPath, function() {
        return done();
    });
});


describe("config module", function() {
    it("has a `run` function", function() {
        should(config.run).be.a.Function();
    });
});


describe("config.getConfigFilePath", function() {
    it("return a string as path", function() {
        should(config.getConfigFilePath()).be.a.String();
    });
});


describe("config.load", function() {
    var configurations = {
        key: "some key",
        secret: "some secret",
    };

    it("returns an object", function() {
        should(config.load()).be.an.Object();
    });

    it("does not error if config file is missing", function() {
        should.doesNotThrow(function() {
            config.load();
        });
    });

    it("returns defaults even if config file is missing", function() {
        should.deepEqual(config.load(), require("../lib/defaults"));
    });

    it("allows loading from config file", function() {
        config.save(configurations);
        var configs = config.load();
        should.equal(configs.key, configurations.key);
        should.equal(configs.secret, configurations.secret);
    });

    it("allows loading user configurations only", function() {
        config.save(configurations);
        var configs = config.load(true);
        should.equal(configs.key, configurations.key);
        should(configs.limit).be.Undefined();
        configs = config.load(false);
        should(configs.limit).not.be.Undefined();
    });
});


describe("config.save", function() {
    beforeEach(function() {
        try {
            fs.unlinkSync(originalPath);
        } catch(err) {
            return err;
        }
    });

    it("does not write default configurations to file", function() {
        var someconfig = { awesome: "yes" };
        config.save(someconfig);
        var configs = config.load(true);
        should.equal(configs.awesome, someconfig.awesome);
        should(configs.limit).be.Undefined();
    });

    it("uses the key `delete` for deleting config values", function() {
        var someconfig = { name: "julius", age: 30, time: "now" };
        config.save(someconfig);
        var configs = config.load();
        should(configs.name, someconfig.name);
        should(configs.age, someconfig.age);
        should.equal(configs.time, someconfig.time);
        config.save({ delete: "name,age" });
        configs = config.load();
        should(configs.name).be.Undefined();
        should(configs.age).be.Undefined();
        should.equal(configs.time, someconfig.time);
    });
});


describe("config.run", function() {
    function run(flags, func) {
        childProcess.exec("bin/ma3route config " + (flags || ""), {
            cwd: path.dirname(__dirname),
        }, function(err, stdout, stderr) {
            return func(err, stdout, stderr);
        });
    }

    before(function() {
        config.save({ awesome: "ian" });
    });

    it("shows configurations if no variables are to be saved", function(done) {
        run("", function(err, stdout) {
            should(err).not.be.ok();
            should(stdout).containEql("limit");
            return done();
        });
    });

    it("show configurations in pretty format by default", function(done) {
        run("", function(err, stdout) {
            should(err).not.be.ok();
            should(stdout).not.containEql("{");
            should(stdout).not.containEql("}");
            return done();
        });
    });

    it("show configurations in JSON format is --json is used", function(done) {
        run("--json", function(err, stdout) {
            should(err).not.be.ok();
            should(stdout).containEql("{");
            should(stdout).containEql("}");
            should(stdout).containEql("\"limit\"");
            return done();
        });
    });

    it("shows default configurations if --default is used", function(done) {
        run("--default", function(err, stdout) {
            should(err).not.be.ok();
            should(stdout).containEql("limit");
            return done();
        });
    });

    it("shows user configurations if --user is ised", function(done) {
        run("--user", function(err, stdout) {
            should(err).not.be.ok();
            should(stdout).containEql("awesome");
            return done();
        });
    });

    it("saves any passed configurations", function(done) {
        run("--ship=nathan", function(err) {
            should(err).not.be.ok();
            var configs = config.load();
            should.equal(configs.ship, "nathan");
            return done();
        });
    });
});
