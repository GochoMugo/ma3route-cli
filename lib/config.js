/**
 * Application configurations
 */


"use strict";


exports = module.exports = {
    load: load,
    run: run,
    save: save,
};


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var _ = require("lodash");
var mkdirp = require("mkdirp");


// own modules
var cli = require("./cli");
var defaults = require("./defaults");


// module variables
var CONFIG_FILE = path.join(process.env.HOME, ".config", "ma3route-cli");


/**
 * Load configurations. User-defined configurations are supplemented using
 * the default appliation configurations.
 *
 * @return {Object} current configuration
 */
function load() {
    var config = _.cloneDeep(defaults);
    try {
        var userConfig = JSON.parse(fs.readFileSync(CONFIG_FILE));
        _.assign(config, userConfig);
    } catch (err) {
        cli.error("could not read configuration file");
    }
    return config;
}


/**
 * Save configurations. It also handles deleting any configuration value
 * marked as unwanted using the `delete` key
 *
 * @return {Object} current configuration
 * @throws Error
 */
function save(newConfig) {
    var currentConfig = load();
    _.assign(currentConfig, newConfig);
    if (newConfig.delete) {
        newConfig.delete = String(newConfig.delete);
        var unwantedConfigKeys = newConfig.delete.split(",");
        unwantedConfigKeys.forEach(function(key) {
            delete currentConfig[key.trim()];
        });
        delete newConfig.delete;
    }
    mkdirp(path.dirname(CONFIG_FILE));
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig));
    return currentConfig;
}


/**
 * Run function for the parser
 */
function run() {
    var newConfig = _.omit(this, ["_"]);

    if (this.show || !_.some(newConfig)) {
        var currentConfig = load();
        return cli.displayJSON(currentConfig);
    }

    try {
        save(newConfig);
    } catch(err) {
        return cli.error("configuration could not be saved: %s", err);
    }
    return cli.success("configuration saved");
}
