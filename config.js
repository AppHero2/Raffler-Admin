'use strict';

var fs          = require('fs');
var path        = require('path');
var cluster     = require('cluster');
var extend      = require('node.extend');


function Configuration() {
}

/*
    * Document Root
    * @static
    * @readonly
    * @property DOCUMENT_ROOT
    * @type {String}
*/
Configuration.DOCUMENT_ROOT = __dirname;

/*
    * The model files absolute path
    * @private
    * @static
    * @readonly
    * @property LOG_DIR
    * @type     {String}
*/
Configuration.MODEL_DIR = path.join(__dirname, 'models');
/*
    * The configuration module overrides file name
    * @private
    * @static
    * @readonly
    * @property CONFIG_MODULE_NAME
    * @type     {String}
*/
var CONFIG_MODULE_NAME      = 'config.js';

/*
    * The default list of absolute file path to try when loading the configuration
    * @private
    * @static
    * @readonly
    * @property OVERRIDE_FILE_PATHS
    * @type     {Array}
*/
var OVERRIDE_FILE_PATHS     = [
    path.join(Configuration.DOCUMENT_ROOT, CONFIG_MODULE_NAME),
];

/*
    * Retrieve the base configuration
*/

Configuration.getBaseConfig = function(multisite) {
    return {
        product: 'Raffler',
        siteRoot: 'http://localhost:3000',
        siteIP: '0, 0, 0, 0',
        sitePort: process.env.port || process.env.PORT || 8080,
        
    };
};

Configuration.load = (filePaths) => {
    if (filePaths != undefined) {
        filePaths = [filePaths];
    } else  if (!filePaths) {
        filePaths = OVERRIDE_FILE_PATHS;
    }

    var override = {};
    var overrideFile = null;
    var overridesFound = false;
    for (var i = 0; i < filePaths.length; i++) {
        overrideFile = filePaths[i];
        if (fs.existsSync(overrideFile)) {
            try {
                override        = require(overrideFile);
                overridesFound  = true;
                break;
            } catch (e) {
                console.log('SystemStartup: Failed to parse configuration file [%s]: %s', overrideFile, e.stack);
            }
        }
    }

    return Configuration.mergeWithBase(override);
};

Configuration.mergeWithBase = (overrides) => {
    var multisite = overrides && overrides.multisite? overrides.multisite.enabled : false;
    var baseConfig = Configuration.getBaseConfig(multisite);
    var config = extend(true, baseConfig, overrides);
    return config;
}

module.exports = Configuration;
