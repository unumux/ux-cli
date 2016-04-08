"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkForUpdates = exports.updateLogin = exports.installLibraries = exports.findFiles = exports.watchGulp = exports.determineBuildTools = exports.runGulp = exports.createUXConfig = exports.installUIFramework = exports.npmInstall = exports.bowerInstall = undefined;

var bowerInstall = exports.bowerInstall = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return ux.shouldInstallBowerPackages();

                    case 2:
                        if (!_context.sent) {
                            _context.next = 5;
                            break;
                        }

                        console.log("Installing Bower packages...");
                        return _context.abrupt("return", execCmd("bower install"));

                    case 5:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function bowerInstall() {
        return ref.apply(this, arguments);
    };
}();

var npmInstall = exports.npmInstall = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return ux.shouldInstallNPMPackages();

                    case 2:
                        if (!_context2.sent) {
                            _context2.next = 5;
                            break;
                        }

                        console.log("Installing NPM packages...");
                        return _context2.abrupt("return", execCmd("npm install"));

                    case 5:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function npmInstall() {
        return ref.apply(this, arguments);
    };
}();

var installUIFramework = exports.installUIFramework = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var shouldInstall, _version;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return question.yesNo('UX Build Tools not found. Would you like to install them?');

                    case 2:
                        shouldInstall = _context3.sent;


                        if (shouldInstall) {
                            console.log('Installing UX Build Tools...');
                            debug.log('Getting latest version of ux-build-tools...');
                            _version = require("child_process").execSync('npm show @unumux/ux-build-tools version');

                            console.log(_version.toString());
                        }

                    case 4:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function installUIFramework() {
        return ref.apply(this, arguments);
    };
}();

var generateConfig = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(paths) {
        var scssPath, jsPath, watchPaths, compileJs, jsFiles, mainJsFile, staticSite, proxy, config;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return question.list('Where are your SCSS files stored?', paths.scss);

                    case 2:
                        scssPath = _context4.sent;
                        _context4.next = 5;
                        return question.list('Where are your JS files stored?', paths.js);

                    case 5:
                        jsPath = _context4.sent;

                        if (!(paths.other.length > 0)) {
                            _context4.next = 14;
                            break;
                        }

                        if (!(paths.other.length === 1 && paths.other[0] === "index.html")) {
                            _context4.next = 11;
                            break;
                        }

                        watchPaths = ["index.html"];
                        _context4.next = 14;
                        break;

                    case 11:
                        _context4.next = 13;
                        return question.checkbox('What other files/folders should trigger a refresh in the browser when files are changed?', paths.other);

                    case 13:
                        watchPaths = _context4.sent;

                    case 14:
                        _context4.next = 16;
                        return question.yesNo('Should Javascript files be processed with Browserify?');

                    case 16:
                        compileJs = _context4.sent;

                        if (!compileJs) {
                            _context4.next = 24;
                            break;
                        }

                        jsFiles = glob.sync(path.join(jsPath, '**/*.js'), { ignore: ['**/*.min.js'] });
                        _context4.next = 21;
                        return question.list('Which JS file is your main (entry) file?', jsFiles);

                    case 21:
                        mainJsFile = _context4.sent;
                        _context4.next = 25;
                        break;

                    case 24:
                        mainJsFile = false;

                    case 25:
                        _context4.next = 27;
                        return question.yesNo('Is this a static site?');

                    case 27:
                        staticSite = _context4.sent;

                        if (staticSite) {
                            _context4.next = 32;
                            break;
                        }

                        _context4.next = 31;
                        return question.text('What is the local url of the site you are working on? (ex: http://my.localhost.com/producers)');

                    case 31:
                        proxy = _context4.sent;

                    case 32:
                        config = new UXConfig.Config({ scss: scssPath, js: jsPath, watch: watchPaths }, staticSite, compileJs, mainJsFile, proxy);


                        config.write('./ux.json');

                    case 34:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function generateConfig(_x) {
        return ref.apply(this, arguments);
    };
}();

var createUXConfig = exports.createUXConfig = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var shouldCreate, isSitecoreSite, paths, proxy, config, _paths;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return question.yesNo('ux.json not found. Would you like to create one?');

                    case 2:
                        shouldCreate = _context5.sent;

                        if (!shouldCreate) {
                            _context5.next = 19;
                            break;
                        }

                        isSitecoreSite = UXConfig.detectIfSitecoreSite(process.cwd());

                        if (!isSitecoreSite) {
                            _context5.next = 14;
                            break;
                        }

                        paths = UXConfig.findSitecorePaths(process.cwd());
                        _context5.next = 9;
                        return question.text('What is the local url of the site you are working on? (ex: http://my.localhost.com/producers)');

                    case 9:
                        proxy = _context5.sent;
                        config = new UXConfig.Config(paths, false, false, '', proxy);

                        config.write('./ux.json');
                        _context5.next = 19;
                        break;

                    case 14:
                        _context5.next = 16;
                        return UXConfig.findPaths(process.cwd());

                    case 16:
                        _paths = _context5.sent;
                        _context5.next = 19;
                        return generateConfig(_paths);

                    case 19:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function createUXConfig() {
        return ref.apply(this, arguments);
    };
}();

var runGulp = exports.runGulp = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(tools, args) {
        var cmd, gulp;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        cmd = findGulpPath();
                        args = args.concat(["--gulpfile=node_modules/" + tools + "/index.js", "--cwd=."]);
                        gulp = spawn(cmd, args, {
                            stdio: [0, process.stdout, process.stderr]
                        });


                        gulp.on("close", function (code) {
                            if (code !== 0) {}
                        });

                        return _context6.abrupt("return", gulp);

                    case 5:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function runGulp(_x2, _x3) {
        return ref.apply(this, arguments);
    };
}();

var determineBuildTools = exports.determineBuildTools = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return pathExists("node_modules/@unumux/ux-build-tools");

                    case 2:
                        if (!_context7.sent) {
                            _context7.next = 6;
                            break;
                        }

                        return _context7.abrupt("return", "@unumux/ux-build-tools");

                    case 6:
                        _context7.next = 8;
                        return pathExists("node_modules/@unumux/ui-framework");

                    case 8:
                        if (!_context7.sent) {
                            _context7.next = 12;
                            break;
                        }

                        return _context7.abrupt("return", "@unumux/ui-framework");

                    case 12:
                        throw "UX Build Tools does not seem to be installed. Try running `npm install -D @unumux/ux-build-tools`";

                    case 13:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function determineBuildTools() {
        return ref.apply(this, arguments);
    };
}();

var watchGulp = exports.watchGulp = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var gulpProcess, debounceTimeout;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return runGulp([]);

                    case 2:
                        gulpProcess = _context9.sent;
                        debounceTimeout = void 0;


                        chokidar.watch("node_modules/@unumux/ui-framework/**/*", {
                            ignored: ["node_modules/@unumux/ui-framework/node_modules", "node_modules/@unumux/ui-framework/.git"],
                            ignoreInitial: true
                        }).on("all", function () {
                            clearTimeout(debounceTimeout);
                            setTimeout(_asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
                                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                    while (1) {
                                        switch (_context8.prev = _context8.next) {
                                            case 0:
                                                gulpProcess.kill("SIGINT");
                                                _context8.next = 3;
                                                return runGulp(["--no-open"]);

                                            case 3:
                                                gulpProcess = _context8.sent;

                                            case 4:
                                            case "end":
                                                return _context8.stop();
                                        }
                                    }
                                }, _callee8, this);
                            })), 100);
                        });

                    case 5:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function watchGulp() {
        return ref.apply(this, arguments);
    };
}();

var findFiles = exports.findFiles = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(globPath, ignorePaths) {
        var allFilesFolders, folders, fileSearchExtensions, folderGlob, files, rootFileGlob, result, scssPaths, jsPaths, otherPaths, scaffoldFullSite, scaffoldPaths, scaffoldStyles, scaffoldScripts, scaffoldMarkup;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        // find all folders in directory, then remove ignoredPaths.
                        // This is faster than using **/* with ignore
                        allFilesFolders = fs.readdirSync(globPath);

                        // filter to include only folders that are not ignored

                        folders = allFilesFolders.filter(function (file) {
                            return fs.statSync(file).isDirectory() && ignorePaths.indexOf(file) < 0;
                        });
                        fileSearchExtensions = ["scss", "sass", "cshtml", "html", "css", "aspx", "js"];
                        folderGlob = "{" + folders.join(",") + "}/**/*.{" + fileSearchExtensions.join(",") + "}";
                        files = glob.sync(folderGlob, {
                            nocase: true
                        });

                        // this will let us watch files in root (only non-sass/js files for now)

                        rootFileGlob = "*.{html,cshtml,aspx,css}";


                        files = files.concat(glob.sync(rootFileGlob, {
                            nocase: true
                        }));

                        result = _.groupBy(files, function (file) {
                            return path.extname(file);
                        });
                        scssPaths = _.uniq(_.union(result[".scss"], result[".sass"]).map(function (file) {
                            return file.split("/")[0];
                        }));
                        jsPaths = _.uniq(_.union(result[".js"], []).map(function (file) {
                            return file.split("/")[0];
                        }));
                        otherPaths = _.uniq(_.flatten(_.values(_.omit(result, [".js", ".scss", ".sass"]))).map(function (file) {
                            return file.split("/")[0];
                        }));


                        otherPaths = otherPaths.filter(function (path) {
                            return scssPaths.indexOf(path) < 0;
                        });

                        if (!(scssPaths.length === 0 && jsPaths.length === 0 && otherPaths.length === 0)) {
                            _context10.next = 19;
                            break;
                        }

                        _context10.next = 15;
                        return question.yesNo("No styles, scripts, or markup were found. Would you like to scaffold a basic site?");

                    case 15:
                        scaffoldFullSite = _context10.sent;

                        if (scaffoldFullSite) {
                            scaffoldPaths = scaffold.fullSite(process.cwd());

                            scssPaths = scaffoldPaths.scss;
                            jsPaths = scaffoldPaths.js;
                            otherPaths = scaffoldPaths.other;
                        }

                        _context10.next = 34;
                        break;

                    case 19:
                        if (!(scssPaths.length === 0)) {
                            _context10.next = 24;
                            break;
                        }

                        _context10.next = 22;
                        return question.yesNo("No styles were found. Would you like to create a site.scss?");

                    case 22:
                        scaffoldStyles = _context10.sent;

                        if (scaffoldStyles) {
                            scssPaths = scaffold.styles(process.cwd());
                        }

                    case 24:
                        if (!(jsPaths.length === 0)) {
                            _context10.next = 29;
                            break;
                        }

                        _context10.next = 27;
                        return question.yesNo("No scripts were found. Would you like to create a site.js?");

                    case 27:
                        scaffoldScripts = _context10.sent;

                        if (scaffoldScripts) {
                            jsPaths = scaffold.scripts(process.cwd());
                        }

                    case 29:
                        if (!(otherPaths.length === 0)) {
                            _context10.next = 34;
                            break;
                        }

                        _context10.next = 32;
                        return question.yesNo("No markup was found. Would you like to create an index.html?");

                    case 32:
                        scaffoldMarkup = _context10.sent;

                        if (scaffoldMarkup) {
                            otherPaths = scaffold.markup(process.cwd());
                        }

                    case 34:
                        return _context10.abrupt("return", {
                            scss: scssPaths,
                            js: jsPaths,
                            other: otherPaths
                        });

                    case 35:
                    case "end":
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    return function findFiles(_x4, _x5) {
        return ref.apply(this, arguments);
    };
}();

var installLibraries = exports.installLibraries = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
        var additionalLibraries;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return question.checkbox("Would you like to install any additional libraries?", libraries.get());

                    case 2:
                        additionalLibraries = _context11.sent;

                        if (!(additionalLibraries.length > 0)) {
                            _context11.next = 6;
                            break;
                        }

                        _context11.next = 6;
                        return libraries.install(additionalLibraries);

                    case 6:
                    case "end":
                        return _context11.stop();
                }
            }
        }, _callee11, this);
    }));

    return function installLibraries() {
        return ref.apply(this, arguments);
    };
}();

var updateLogin = exports.updateLogin = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
        var username, password, home, configPath, config;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return question.text("Username:", process.env["USER"]);

                    case 2:
                        username = _context12.sent;
                        _context12.next = 5;
                        return question.password("Password:", "colonial");

                    case 5:
                        password = _context12.sent;
                        home = getUserHome();
                        configPath = path.join(home, ".ux-global.json");
                        config = fs.existsSync(configPath) ? require(configPath) : {};


                        config.login = {
                            username: username,
                            password: password
                        };

                        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

                    case 11:
                    case "end":
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    }));

    return function updateLogin() {
        return ref.apply(this, arguments);
    };
}();

var checkForUpdates = exports.checkForUpdates = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(packageName, localVersion, globalInstall) {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        return _context14.abrupt("return", new Promise(function (resolve) {
                            packageJson(packageName, "latest").then(function () {
                                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(json) {
                                    var updateAvailable, shouldUpdate;
                                    return regeneratorRuntime.wrap(function _callee13$(_context13) {
                                        while (1) {
                                            switch (_context13.prev = _context13.next) {
                                                case 0:
                                                    updateAvailable = semver.gt(json.version, localVersion);

                                                    if (!updateAvailable) {
                                                        _context13.next = 8;
                                                        break;
                                                    }

                                                    _context13.next = 4;
                                                    return question.yesNo("An update is available to " + packageName + ". Would you like to install it?");

                                                case 4:
                                                    shouldUpdate = _context13.sent;

                                                    if (!shouldUpdate) {
                                                        _context13.next = 8;
                                                        break;
                                                    }

                                                    _context13.next = 8;
                                                    return execCmd("npm install " + packageName + " --loglevel=error " + (globalInstall ? "-g" : "--save-dev"), true);

                                                case 8:
                                                    resolve();

                                                case 9:
                                                case "end":
                                                    return _context13.stop();
                                            }
                                        }
                                    }, _callee13, this);
                                }));

                                return function (_x9) {
                                    return ref.apply(this, arguments);
                                };
                            }());
                        }));

                    case 1:
                    case "end":
                        return _context14.stop();
                }
            }
        }, _callee14, this);
    }));

    return function checkForUpdates(_x6, _x7, _x8) {
        return ref.apply(this, arguments);
    };
}();

exports.execCmd = execCmd;
exports.createPackageJson = createPackageJson;
exports.createBowerJson = createBowerJson;
exports.getVersion = getVersion;

var _uxConfig = require("./ux-config.js");

var UXConfig = _interopRequireWildcard(_uxConfig);

var _uxQuestions = require("@unumux/ux-questions");

var question = _interopRequireWildcard(_uxQuestions);

var _uxDebug = require("@unumux/ux-debug");

var debug = _interopRequireWildcard(_uxDebug);

var _scaffold = require("./scaffold.js");

var scaffold = _interopRequireWildcard(_scaffold);

var _libraries = require("./libraries.js");

var libraries = _interopRequireWildcard(_libraries);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var exec = require("child_process").exec,
    execSync = require("child_process").execSync,
    spawn = require("child_process").spawn,
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    _ = require("lodash"),
    packageJson = require("package-json"),
    semver = require("semver"),
    ux = require("@unumux/lib-ux"),
    chokidar = require("chokidar");

var isWin = process.platform === "win32";

function getUserHome() {
    return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}

function execCmd(cmd, visible) {
    debug.log("Executing command: " + cmd);
    return new Promise(function (resolve) {
        var shell = isWin ? "cmd.exe" : "sh";
        var cmdSwitch = isWin ? "/c" : "-c";
        var stdio = debug.enabled() || visible ? [0, process.stdout, process.stderr] : "ignore";

        spawn(shell, [cmdSwitch, cmd], {
            stdio: stdio
        }).on("close", function () {
            debug.log("Command completed successfully: " + cmd);
            resolve();
        });
    });
}

function createPackageJson() {
    debug.log("Creating package.json...");

    var packageJson = {
        private: true,
        devDependencies: {
            "@unumux/ux-build-tools": "^" + getToolsVersion()
        },
        scripts: {
            start: "gulp --gulpfile=node_modules/@unumux/ux-build-tools/index.js --cwd=."
        }
    };

    fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 4));
    debug.log("package.json created");
}

function createBowerJson() {
    debug.log("Creating bower.json...");
    var bowerJson = {
        private: true,
        name: path.basename(process.cwd())
    };

    fs.writeFileSync("./bower.json", JSON.stringify(bowerJson, null, 4));
    debug.log("bower.json created");
}

function getToolsVersion() {
    var version = execSync("npm show @unumux/ux-build-tools version").toString().trim();
    if (semver.valid(version)) {
        return version;
    } else {
        return "3.0.0";
    }
}

function findGulpPath() {
    var gulpCmd = process.platform === "win32" ? "gulp.cmd" : "gulp";
    var searchPaths = [["node_modules", "@unumux", "ux-build-tools", "node_modules", ".bin", gulpCmd], ["node_modules", ".bin", gulpCmd]];

    searchPaths.forEach(function (searchPathTmp) {
        var searchPath = searchPathTmp.join(path.sep);
        if (fs.existsSync(searchPath)) {
            gulpCmd = searchPath;
        }
    });
    debug.log("Gulp path: " + gulpCmd);

    return gulpCmd;
}

function pathExists(pathName) {
    return new Promise(function (resolve, reject) {
        fs.stat(pathName, function (err, stats) {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

var version;

function getVersion() {
    if (!version) {
        var pkg = require("../../package.json");
        version = pkg.version;
    }
    return version;
}