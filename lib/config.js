/**
 * Application configurations
 */


"use strict";


exports = module.exports = {
    getConfigFilePath: getConfigFilePath,
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
var CONFIG_FILE_PATH = path.join(process.env.HOME, ".config", "ma3route-cli");


/**
 * Return the path to the configuration file
 */
function getConfigFilePath() {
    return CONFIG_FILE_PATH;
}


/**
 * Load configurations. User-defined configurations are supplemented using
 * the default appliation configurations.
 *
 * @param {Boolean} [userOnly=false] - load configurations from user only
 * @return {Object} current configuration
 */
function load(userOnly) {
    userOnly = userOnly ? true : false;
    var config = { };
    try {
        config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH));
    } catch (err) {
        cli.error("could not read configuration file");
    }
    if (userOnly === false) {
        cli.debug("using the default configurations");
        _.defaults(config, defaults);
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
    // only load the user's configuration
    var currentConfig = load(true);
    _.assign(currentConfig, newConfig);
    // delete unwanted keys
    if (currentConfig.delete) {
        currentConfig.delete = String(newConfig.delete);
        var unwantedConfigKeys = currentConfig.delete.split(/\s*,\s*/);
        unwantedConfigKeys.forEach(function(key) {
            delete currentConfig[key.trim()];
        });
        delete currentConfig.delete;
    }
    // write to file
    mkdirp.sync(path.dirname(CONFIG_FILE_PATH));
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(currentConfig));
    return currentConfig;
}


/**
 * Run function for the parser
 */
function run() {
    var outputJSON = this.json;
    var defaultConfig = this.default || false;
    var userConfig = this.user || false;
    var newConfig = _.omit(this, ["_", "json", "user", "default"]);

    if (!_.some(newConfig)) {
        var currentConfig = defaultConfig ? defaults : load(userConfig);
        if (outputJSON) {
            return cli.rawJSON(currentConfig);
        } else {
            return cli.prettyJSON(currentConfig);
        }
    }

    try {
        save(newConfig);
    } catch(err) {
        return cli.error("configuration could not be saved: %s", err);
    }
    return cli.success("configuration saved");
}
