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
var out = require("cli-output");
var sdk = require("ma3route-sdk");


// own modules
var config = require("./config");


// module variables
var descriptors = {
    bannerAdverts: {
        short: "b",
        description: "banner adverts",
    },
    drivingReports: {
        short: "d",
        description: "driving reports",
        more: ["getDriveTypes"],
    },
    externalStream: {
        short: "e",
        description: "external stream",
    },
    listedAdverts: {
        short: "l",
        description: "listed adverts",
    },
    misc: {
        short: "m",
        description: "miscellaneous operations",
        more: ["contactUs"],
    },
    news: {
        short: "n",
        description: "news articles",
    },
    places: {
        short: "p",
        description: "places",
        more: ["getTowns", "createDirections", "getDirections"],
    },
    trafficUpdates: {
        short: "t",
        description: "traffic updates",
        more: ["getSeverityLevels"],
    },
    users: {
        short: "u",
        description: "ma3route users",
        more: ["edit"],
    },
};


/**
 * Callback handling all responses from the REST API
 */
function callback(err, data, meta) {
    var displayJSON = this.json ? out.rawJSON : out.prettyJSON;
    if (err) {
        out.error(err);
        console.error(err);
        return;
    }
    if (this.meta) {
        if (!meta) {
            out.log("No metadata to display!");
        } else {
            out.log("Meta Data:");
            displayJSON(meta);
        }
    }
    if (data) {
        out.log("Data:");
        displayJSON(data);
    } else {
        out.log("No data to display!");
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
        var sdkConfig = userContext.sdk || {};
        out.debug("configuration passed to SDK: %j", sdkConfig);
        sdk.utils.setup(sdkConfig);

        var params = _.cloneDeep(userContext);
        delete params.sdk;
        delete params._;
        delete params._option;
        for (var key in params) {
            var value = params[key];
            delete params[key];
            params[camelcase(key)] = value;
        }
        out.debug("parameters passed to SDK module function: %j", params);

        return func(params, callback.bind(userContext));
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
    if (mod.deleteOne) {
        self.commands.delete = newReq(mod.deleteOne);
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
                out.debug("captured command: %s", name);
                fn = self.commands[name];
                break;
            }
        }
        if (self.commands.get && !fn) {
            out.debug("no command specifed: defaulting to a get request");
            fn = self.commands.get;
        }
        if (!fn) {
            return out.log("can not do anything, exiting silently");
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
