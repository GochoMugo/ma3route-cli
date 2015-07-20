/**
 * Generate run functions
 */


"use strict";


exports = module.exports = {
    make: make,
};


// npm-installed modules
var _ = require("lodash");
var sdk = require("ma3route-sdk");


// own modules
var cli = require("./cli");
var config = require("./config");


// module variables
var descriptions = {
    bannerAdverts: "banner adverts",
    drivingReports: "driving reports",
    listedAdverts: "listed adverts",
    news: "news articles",
    places: "places",
    trafficUpdates: "traffic updates",
    users: "ma3route users",
};


/**
 * Callback handling all responses from the REST API
 */
function callback(err, data, meta) {
    if (err) {
        cli.error(err);
        return;
    }
    cli.displayJSON(data);
    if (this.meta) {
        cli.displayJSON(meta);
    }
    return;
}


/**
 * Generate new function for executing requests to the API
 *
 * @param  {Function} function - method from the SDK
 * @return {Function} function
 */
function newReq(func) {
    /**
     * Used to add context for request
     *
     * @param {Object} userContext - user options from terminal
     */
    return function(userContext) {
        var params = { };
        _.assign(params, config.load(), userContext);
        params = _.omit(params, ["_", "meta", "create"]);
        return func(params, callback.bind(userContext));
    };
}


/**
 * An option that is added to the parser
 *
 * @constructor
 * @param  {String} description
 * @param  {Function} get
 * @param  {Function} create
 * @return {Option} this
 */
function Option(description, get, create) {
    var self = this;
    self.description = description;
    self.get = get;
    self.create = create;
    self.run = function() {
        if (this.create) {
            return self.create(this);
        }
        return self.get(this);
    };
    return self;
}


/**
 * Generates/makes the different commands available to the user
 *
 * @return {Object} options
 */
function make() {
    var options = { };
    for (var name in sdk) {
        var mod = sdk[name];
        var description = descriptions[name];
        var get;
        var create;
        if (mod.get) {
            get = newReq(mod.get);
        } else if (mod.getOne) {
            get = newReq(mod.getOne);
        }
        if (mod.createOne) {
            create = newReq(mod.createOne);
        }
        if (!(get || create)) {
            continue;
        }
        options[name] = new Option(description, get, create);
    }
    return options;
}
