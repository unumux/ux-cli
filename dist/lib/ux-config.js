'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.detectIfSitecoreSite = detectIfSitecoreSite;
exports.findSitecorePaths = findSitecorePaths;
exports.findPaths = findPaths;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilJs = require('./util.js');

var util = _interopRequireWildcard(_utilJs);

var fs = require('fs'),
    path = require('path');

var Config = (function () {
    function Config(paths, server, compileJs, mainJsFile) {
        if (server === undefined) server = false;
        if (compileJs === undefined) compileJs = true;

        var _this = this;

        var proxy = arguments[4] === undefined ? false : arguments[4];

        _classCallCheck(this, Config);

        if (paths.scss) {
            this.scss = {
                src: this.appendGlobs(paths.scss, 'scss'),
                dest: paths.scss
            };
        }

        if (paths.js) {
            this.js = {
                src: this.appendGlobs(paths.js, 'js'),
                dest: paths.js
            };
        }

        if (paths.watch) {
            this.watch = paths.watch.map(function (folder) {
                return _this.appendGlobs(folder);
            });
        }

        this.server = server;
        this.compileJs = compileJs;
        this.proxy = proxy;

        // if we aren't compiling JS, set it to be a watched folder as well
        if (this.compileJs && mainJsFile) {
            this.js.main = mainJsFile;
        } else if (this.js && this.js.src) {
            this.watch.push(this.js.src);
        }
    }

    _createClass(Config, [{
        key: 'appendGlobs',
        value: function appendGlobs(folder) {
            var ext = arguments[1] === undefined ? '*' : arguments[1];

            // check if folder is actually a folder
            if (fs.statSync(folder).isDirectory()) {
                return folder + '/**/*.' + ext;
            } else {
                // if it isn't a folder, don't append globs
                return folder;
            }
        }
    }, {
        key: 'write',
        value: function write(writePath) {
            if (writePath) {
                fs.writeFile(writePath, JSON.stringify(this, null, 4));
            }
        }
    }]);

    return Config;
})();

exports.Config = Config;

/**
 * detectIfSitecoreSite - determines if a given folder is inside of a Sitecore site
 *
 * @param  {string} dir
 * @return {boolean}     is this a Sitecore site?
 */

function detectIfSitecoreSite(dir) {
    var pathParts = dir.split(path.sep);

    // check if sitecore site
    if (pathParts.indexOf('AllSites') >= 0 && pathParts.indexOf('SiteCore') >= 0 && pathParts.indexOf('UI') >= 0) {
        // this is a Sitecore site
        return true;
    }

    // this is not a Sitecore site
    return false;
}

/**
 * findSitecorePaths - determine paths of styles/scripts/other watchable files
 *                     for a Sitecore site
 *
 * @param  {string} dir current directory
 * @return {object}     paths
 */

function findSitecorePaths(dir) {
    var pathParts = dir.split(path.sep);

    // make sure we are in the correct spot
    if (pathParts[pathParts.length - 3] === 'UI') {
        var pathSuffix = pathParts.slice(-2).join(path.sep);

        var relativePrefix = ['..', '..', '..'].join(path.sep);

        var scss = [relativePrefix, 'styles', pathSuffix].join(path.sep);
        var js = [relativePrefix, 'scripts', pathSuffix].join(path.sep);
        var watch = [[relativePrefix, 'layouts', pathSuffix].join(path.sep), [relativePrefix, 'images', pathSuffix].join(path.sep)];

        return {
            scss: scss,
            js: js,
            watch: watch
        };
    }
}

/**
 * findPaths - determine paths of styles/scripts/other watchable files
 *             fot a non-Sitecore site
 *
 * @param  {string} dir current directory
 * @return {object}     paths
 */

function findPaths(dir) {
    var ignorePaths;
    return regeneratorRuntime.async(function findPaths$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                ignorePaths = ['node_modules', 'bower_components', 'bin', 'dist', 'App_Data', 'App_Start', 'obj'];
                context$1$0.next = 3;
                return regeneratorRuntime.awrap(util.findFiles(path.join(dir), ignorePaths));

            case 3:
                return context$1$0.abrupt('return', context$1$0.sent);

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}