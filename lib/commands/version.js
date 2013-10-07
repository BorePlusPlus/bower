var mout = require('mout');
var Logger = require('bower-logger');
var semver = require('semver');
var Project = require('../core/Project');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function version(newVersion, options, config) {
    var project;
    var logger = new Logger();

    config = mout.object.deepFillIn(config || {}, defaultConfig);

    project = new Project(config, logger);

    // Read package descriptor
    readJson(project)
    // update version
    .then(updateVersion.bind(null, newVersion))
    // check git

    // save version

    // commit

    // tag

    // done
    .done(function (json) {
        logger.emit('end', json);
    }, function (error) {
        logger.emit('error', error);
    });
    // * push
    // * push --tags

    return logger;
}

function readJson(project) {
    return project.hasJson()
    .then(function (json) {
        if (!json) {
            throw createError('You are not inside a package', 'ENOENT');
        }

        return project.getJson();
    });
}

function updateVersion(newVersion, json) {
    var newVer = semver.valid(newVersion) || semver.inc(json.version, newVersion);

    if (!newVer) {
        throw createError('Not a valid version identifier', 'ENOVER');
    }

    json.version = newVer;
    return json;
}

version.line = function (argv) {
    var options = version.options(argv);
    return version(options.argv.remain[1], options);
};

version.options = function (argv) {
    return cli.readOptions(argv);
};

module.exports = version;
