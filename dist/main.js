"use strict";

var _util = require("./lib/util.js");

var util = _interopRequireWildcard(_util);

var _uxDebug = require("@unumux/ux-debug");

var debug = _interopRequireWildcard(_uxDebug);

var _updateNotifier = require("update-notifier");

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var fs = require("fs"),
    argv = require("minimist")(process.argv.slice(2));

module.exports = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var pkg, ONE_HOUR, notifier, reconfigure, newInstall, buildTools;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;

                        // enabled debug mode if debug or verbose arg set
                        if (argv.debug || argv.verbose) {
                            debug.enable();
                        }

                        // print the current version
                        if (argv.v || argv.version) {
                            console.log(util.getVersion());
                            process.exit();
                        }

                        // experimental update notifications support
                        if (!argv['disable-updates']) {
                            debug.log('Update support enabled');
                            pkg = require('../package.json');
                            ONE_HOUR = 1000 * 60 * 60;
                            notifier = (0, _updateNotifier2.default)({ pkg: pkg, updateCheckInterval: ONE_HOUR });

                            // if statement to prevent showing notifications if update happened recently

                            if (notifier.update && notifier.update.latest !== pkg.version) {
                                notifier.notify({ defer: false });
                            }
                        }

                        // check for login param

                        if (!argv.login) {
                            _context.next = 9;
                            break;
                        }

                        debug.log("Updating login");
                        _context.next = 8;
                        return util.updateLogin();

                    case 8:
                        debug.log("Login enabled");

                    case 9:

                        // aliases for reconfigure switch
                        reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config;

                        // if package.json does not exist, create it

                        if (!fs.existsSync("./package.json")) {
                            util.createPackageJson();
                        }

                        // if bower.json does not exist, create it
                        if (!fs.existsSync("./bower.json")) {
                            util.createBowerJson();
                        }

                        // if(!argv['disable-updates']) {
                        //   packages = JSON.parse(fs.readFileSync('./package.json','utf8'));
                        //
                        //   // experimental update notifications for framework build tools
                        //   await util.checkForUpdates("@unumux/ui-framework", packages.devDependencies['@unumux/ui-framework'].replace('^', ''), false);
                        // }

                        debug.log("Checking for ux.json...");
                        newInstall = !fs.existsSync("./ux.json");

                        // create config file, if it does not exist or if reconfigure switch is passed

                        if (!(newInstall || reconfigure)) {
                            _context.next = 18;
                            break;
                        }

                        debug.log("ux.json not found. Prompting to create one...");
                        _context.next = 18;
                        return util.createUXConfig();

                    case 18:
                        if (!(newInstall || reconfigure || argv.install)) {
                            _context.next = 22;
                            break;
                        }

                        debug.log("Prompting to install libraries...");
                        _context.next = 22;
                        return util.installLibraries();

                    case 22:
                        if (!(argv.packages !== false)) {
                            _context.next = 29;
                            break;
                        }

                        if (!(argv.npm !== false)) {
                            _context.next = 26;
                            break;
                        }

                        _context.next = 26;
                        return util.npmInstall();

                    case 26:
                        if (!(argv.bower !== false)) {
                            _context.next = 29;
                            break;
                        }

                        _context.next = 29;
                        return util.bowerInstall();

                    case 29:

                        console.log("Starting UX...");

                        _context.next = 32;
                        return util.determineBuildTools();

                    case 32:
                        buildTools = _context.sent;


                        if (argv.dev || argv.develop || argv.development) {
                            util.watchGulp();
                        } else {
                            debug.log("Attempting to run project...");
                            util.runGulp(buildTools, argv._);
                        }

                        _context.next = 40;
                        break;

                    case 36:
                        _context.prev = 36;
                        _context.t0 = _context["catch"](0);

                        console.error("There was an unexpected error. Details: ");
                        console.error(_context.t0);

                    case 40:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 36]]);
    }));

    function main() {
        return ref.apply(this, arguments);
    }

    return main;
}();