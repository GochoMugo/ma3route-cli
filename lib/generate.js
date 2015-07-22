/**
 * Generate run functions
 */


"use strict";


exports = module.exports = {
    make: make,
    Option: Option,
};


// npm-installed modules
var _ = require("lodash");
var camelcase = require("camelcase");
var sdk = require("ma3route-sdk");


// own modules
var cli = require("./cli");
var config = require("./config");


// module variables
var descriptors = {
    bannerAdverts: {
        description: "banner adverts",
    },
    drivingReports: {
        description: "driving reports",
        more: ["getDriveTypes"],
    },
    externalStream: {
        description: "external stream",
    },
    listedAdverts: {
        description: "listed adverts",
    },
    misc: {
        description: "miscellaneous operations",
        more: ["contactUs"],
    },
    news: {
        description: "news articles",
    },
    places: {
        description: "places",
        more: ["getTowns"],
    },
    trafficUpdates: {
        description: "traffic updates",
    },
    users: {
        description: "ma3route users",
        more: ["edit"],
    },
};


/**
 * Callback handling all responses from the REST API
 */
function callback(err, data, meta) {
    var displayJSON = this.json ? cli.rawJSON : cli.prettyJSON;
    if (this.meta) {
        if (!meta) {
            cli.log("no metadata to show");
        } else {
            cli.log("meta-data:");
            displayJSON(meta);
        }
    }
    if (err) {
        cli.error(err);
        return;
    }
    cli.log("data:");
    displayJSON(data);
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
        sdk.utils.setup(userContext.sdk || { });
        return func(userContext, callback.bind(userContext));
    };
}


/**
 * An option that is added to the parser
 *
 * @constructor
 * @param  {Object} descriptor
 * @param  {Object} mod
 * @return {Option} this
 */
function Option(descriptor, mod) {
    var self = this;
    self.descriptor = descriptor;
    self.description = descriptor.description;
    self.commands = { };
    if (mod.get) {
        self.commands.get = newReq(mod.get);
    } else if (mod.getOne) {
        self.commands.get = newReq(mod.getOne);
    }
    if (mod.createOne) {
        self.commands.create = newReq(mod.createOne);
    }
    if (descriptor.more) {
        descriptor.more.forEach(function(name) {
            self.commands[name] = newReq(mod[name]);
        });
    }
    self.run = function() {
        var ctx = { };
        _.assign(ctx, config.load(), this);
        var fn;
        for (var flag in this) {
            var name = camelcase(flag);
            if (self.commands[name]) {
                fn = self.commands[name];
            }
        }
        if (self.commands.get && !fn) {
            fn = self.commands.get;
        }
        if (!fn) {
            return cli.log("can not do anything, exiting silently");
        }
        return fn(ctx);
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
        var descriptor = descriptors[name];
        if (!descriptor) {
            continue;
        }
        var mod = sdk[name];
        options[name] = new Option(descriptor, mod);
    }
    return options;
}
