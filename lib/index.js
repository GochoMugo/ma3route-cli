/**
 * Library for us
 */


"use strict";


// own modules
var config = require("./config");
var generate = require("./generate");


exports = module.exports = generate.make();
exports.config = config;
