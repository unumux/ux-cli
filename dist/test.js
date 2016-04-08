"use strict";
var _util = require("./lib/util.js");var util = _interopRequireWildcard(_util);var _uxDebug = require("@unumux/ux-debug");var debug = _interopRequireWildcard(_uxDebug);function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);var value = info.value;
                } catch (error) {
                    reject(error);return;
                }if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        return step("next", value);
                    }, function (err) {
                        return step("throw", err);
                    });
                }
            }return step("next");
        });
    };
}var fs = require("fs"),
    argv = require("minimist")(process.argv.slice(2));

module.exports = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var reconfigure, newInstall;return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {case 0:
                        _context.prev = 0; // enabled debug mode if debug or verbose arg set
                        if (argv.debug || argv.verbose) {
                            debug.enable();
                        } // print the current version
                        if (argv.v || argv.version) {
                            console.log(util.getVersion());process.kill();
                        } // experimental update notifications support
                        // if(!argv['disable-updates']) {
                        //   debug.log('Update support enabled');
                        //   var pkg = require('../package.json');
                        //   await util.checkForUpdates(pkg.name, pkg.version, true);
                        // }
                        // check for login param
                        if (!argv.login) {
                            _context.next = 8;break;
                        }debug.log("Updating login");_context.next = 7;return util.updateLogin();case 7:
                        debug.log("Login enabled");case 8:
                        // aliases for reconfigure switch
                        reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config; // if package.json does not exist, create it
                        if (!fs.existsSync("./package.json")) {
                            util.createPackageJson();
                        } // if bower.json does not exist, create it
                        if (!fs.existsSync("./bower.json")) {
                            util.createBowerJson();
                        } // if(!argv['disable-updates']) {
                        //   packages = JSON.parse(fs.readFileSync('./package.json','utf8'));
                        //
                        //   // experimental update notifications for framework build tools
                        //   await util.checkForUpdates("@unumux/ui-framework", packages.devDependencies['@unumux/ui-framework'].replace('^', ''), false);
                        // }
                        debug.log("Checking for ux.json...");newInstall = !fs.existsSync("./ux.json"); // create config file, if it does not exist or if reconfigure switch is passed
                        if (!(newInstall || reconfigure)) {
                            _context.next = 17;break;
                        }debug.log("ux.json not found. Prompting to create one...");_context.next = 17;return util.createUXConfig();case 17:
                        if (!(newInstall || reconfigure || argv.install)) {
                            _context.next = 21;break;
                        }debug.log("Prompting to install libraries...");_context.next = 21;return util.installLibraries();case 21:
                        if (!(argv.packages !== false)) {
                            _context.next = 28;break;
                        }if (!(argv.npm !== false)) {
                            _context.next = 25;break;
                        }_context.next = 25;return util.npmInstall();case 25:
                        if (!(argv.bower !== false)) {
                            _context.next = 28;break;
                        }_context.next = 28;return util.bowerInstall();case 28:

                        if (argv.dev || argv.develop || argv.development) {
                            util.watchGulp();
                        } else {
                            util.runGulp(argv._);
                        }_context.next = 35;break;case 31:
                        _context.prev = 31;_context.t0 = _context["catch"](0);

                        debug.error("There was an unexpected error. Details: ");
                        debug.error(_context.t0);case 35:case "end":
                        return _context.stop();}
            }
        }, _callee, this, [[0, 31]]);
    }));return function main() {
        return ref.apply(this, arguments);
    };
}();