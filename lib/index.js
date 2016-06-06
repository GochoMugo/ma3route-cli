/**
 * Library for us
 */


"use strict";


// own modules
var config = require("./config");
var generate = require("./generate");


exports = module.exports = {};
exports.options = generate.make();
exports.config = config;
