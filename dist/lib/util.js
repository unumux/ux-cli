'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.execCmd = execCmd;
exports.createPackageJson = createPackageJson;
exports.bowerInstall = bowerInstall;
exports.npmInstall = npmInstall;
exports.installUIFramework = installUIFramework;
exports.createUXConfig = createUXConfig;
exports.runGulp = runGulp;
exports.findFiles = findFiles;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _uxConfigJs = require('./ux-config.js');

var UXConfig = _interopRequireWildcard(_uxConfigJs);

var _questionJs = require('./question.js');

var question = _interopRequireWildcard(_questionJs);

var _scaffoldJs = require('./scaffold.js');

var scaffold = _interopRequireWildcard(_scaffoldJs);

require('babel-core/register');

var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    _ = require('lodash');

function execCmd(cmd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, function () {
            resolve();
        });
    });
}

function createPackageJson() {
    var packageJson = {
        'private': true
    };

    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 4));
}

function bowerInstall() {
    console.log('Installing Bower packages...');
    return execCmd('bower install');
}

function npmInstall() {
    console.log('Installing NPM packages...');
    return execCmd('npm install');
}

function installUIFramework() {
    var shouldInstall;
    return regeneratorRuntime.async(function installUIFramework$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return question.yesNo('UI Framework not found. Would you like to install it?');

            case 2:
                shouldInstall = context$1$0.sent;

                if (!shouldInstall) {
                    context$1$0.next = 7;
                    break;
                }

                console.log('Installing UI Framework...');
                context$1$0.next = 7;
                return execCmd('npm install @unumux/ui-framework --save-dev');

            case 7:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function generateConfig(paths) {
    var scssPath, jsPath, watchPaths, compileJs, jsFiles, mainJsFile, staticSite, config;
    return regeneratorRuntime.async(function generateConfig$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                if (!(paths.scss.length > 1)) {
                    context$1$0.next = 6;
                    break;
                }

                context$1$0.next = 3;
                return question.list('Where are your SCSS files stored?', paths.scss);

            case 3:
                scssPath = context$1$0.sent;
                context$1$0.next = 7;
                break;

            case 6:
                if (paths.scss.length > 0) {
                    scssPath = paths.scss[0];
                }

            case 7:
                if (!(paths.js.length > 1)) {
                    context$1$0.next = 13;
                    break;
                }

                context$1$0.next = 10;
                return question.list('Where are your JS files stored?', paths.js);

            case 10:
                jsPath = context$1$0.sent;
                context$1$0.next = 14;
                break;

            case 13:
                if (paths.js.length > 0) {
                    jsPath = paths.js[0];
                }

            case 14:
                if (!(paths.other.length > 0)) {
                    context$1$0.next = 22;
                    break;
                }

                if (!(paths.other.length === 1 && paths.other[0] === 'index.html')) {
                    context$1$0.next = 19;
                    break;
                }

                watchPaths = ['index.html'];
                context$1$0.next = 22;
                break;

            case 19:
                context$1$0.next = 21;
                return question.checkbox('What other files/folders should trigger a refresh in the browser when files are changed?', paths.other);

            case 21:
                watchPaths = context$1$0.sent;

            case 22:
                context$1$0.next = 24;
                return question.yesNo('Should Javascript files be processed with Browserify?');

            case 24:
                compileJs = context$1$0.sent;

                if (!compileJs) {
                    context$1$0.next = 32;
                    break;
                }

                jsFiles = glob.sync(path.join(jsPath, '**/*.js'), { ignore: ['**/*.min.js'] });
                context$1$0.next = 29;
                return question.list('Which JS file is your main (entry) file?', jsFiles);

            case 29:
                mainJsFile = context$1$0.sent;
                context$1$0.next = 33;
                break;

            case 32:
                mainJsFile = false;

            case 33:
                context$1$0.next = 35;
                return question.yesNo('Is this a static site?');

            case 35:
                staticSite = context$1$0.sent;
                config = new UXConfig.Config({ scss: scssPath, js: jsPath, watch: watchPaths }, staticSite, compileJs, mainJsFile);

                config.write('./ux.json');

            case 38:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function createUXConfig() {
    var shouldCreate, isSitecoreSite, paths, config;
    return regeneratorRuntime.async(function createUXConfig$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return question.yesNo('ux.json not found. Would you like to create one?');

            case 2:
                shouldCreate = context$1$0.sent;

                if (!shouldCreate) {
                    context$1$0.next = 16;
                    break;
                }

                isSitecoreSite = UXConfig.detectIfSitecoreSite(process.cwd());

                if (!isSitecoreSite) {
                    context$1$0.next = 11;
                    break;
                }

                paths = UXConfig.findSitecorePaths(process.cwd());
                config = new UXConfig.Config(paths, false, false);

                config.write('./ux.json');
                context$1$0.next = 16;
                break;

            case 11:
                context$1$0.next = 13;
                return UXConfig.findPaths(process.cwd());

            case 13:
                paths = context$1$0.sent;
                context$1$0.next = 16;
                return generateConfig(paths);

            case 16:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function findGulpPath() {
    var gulpCmd = process.platform === 'win32' ? 'gulp.cmd' : 'gulp';

    var searchPaths = [['node_modules', '@unumux', 'ui-framework', 'node_modules', '.bin', gulpCmd], ['node_modules', '.bin', gulpCmd]];

    searchPaths.forEach(function (searchPathTmp) {
        var searchPath = searchPathTmp.join(path.sep);
        if (fs.existsSync(searchPath)) {
            gulpCmd = searchPath;
        }
    });

    return gulpCmd;
}

function runGulp(args) {
    var gulpCmd, gulpArgs, gulp;
    return regeneratorRuntime.async(function runGulp$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                gulpCmd = findGulpPath();
                gulpArgs = args.concat(['--gulpfile=node_modules/@unumux/ui-framework/index.js', '--cwd=.']);
                gulp = spawn(gulpCmd, gulpArgs, {
                    stdio: [0, process.stdout, process.stderr]
                });

                gulp.on('close', function (code) {
                    console.log(code);
                    if (code !== 0) {}
                });

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function findFiles(globPath, ignorePaths) {
    var allFilesFolders, folders, fileSearchExtensions, folderGlob, files, rootFileGlob, result, scssPaths, jsPaths, otherPaths, scaffoldFullSite, scaffoldPaths, scaffoldStyles, scaffoldScripts, scaffoldMarkup;
    return regeneratorRuntime.async(function findFiles$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                allFilesFolders = fs.readdirSync(globPath);
                folders = allFilesFolders.filter(function (file) {
                    return fs.statSync(file).isDirectory() && ignorePaths.indexOf(file) < 0;
                });
                fileSearchExtensions = ['scss', 'sass', 'cshtml', 'html', 'css', 'aspx', 'js'];
                folderGlob = '{' + folders.join(',') + '}/**/*.{' + fileSearchExtensions.join(',') + '}';
                files = glob.sync(folderGlob, { nocase: true });
                rootFileGlob = '*.{html,cshtml,aspx,css}';

                files = files.concat(glob.sync(rootFileGlob, { nocase: true }));

                result = _.groupBy(files, function (file) {
                    return path.extname(file);
                });
                scssPaths = _.uniq(_.union(result['.scss'], result['.sass']).map(function (file) {
                    return file.split('/')[0];
                }));
                jsPaths = _.uniq(_.union(result['.js'], []).map(function (file) {
                    return file.split('/')[0];
                }));
                otherPaths = _.uniq(_.flatten(_.values(_.omit(result, ['.js', '.scss', '.sass']))).map(function (file) {
                    return file.split('/')[0];
                }));

                otherPaths = otherPaths.filter(function (path) {
                    return scssPaths.indexOf(path) < 0;
                });

                if (!(scssPaths.length === 0 && jsPaths.length === 0 && otherPaths.length === 0)) {
                    context$1$0.next = 19;
                    break;
                }

                context$1$0.next = 15;
                return question.yesNo('No styles, scripts, or markup were found. Would you like to scaffold a basic site?');

            case 15:
                scaffoldFullSite = context$1$0.sent;

                if (scaffoldFullSite) {
                    scaffoldPaths = scaffold.fullSite(process.cwd());

                    scssPaths = scaffoldPaths.scss;
                    jsPaths = scaffoldPaths.js;
                    otherPaths = scaffoldPaths.other;
                }

                context$1$0.next = 34;
                break;

            case 19:
                if (!(scssPaths.length === 0)) {
                    context$1$0.next = 24;
                    break;
                }

                context$1$0.next = 22;
                return question.yesNo('No styles were found. Would you like to create a site.scss?');

            case 22:
                scaffoldStyles = context$1$0.sent;

                if (scaffoldStyles) {
                    scssPaths = scaffold.styles(process.cwd());
                }

            case 24:
                if (!(jsPaths.length === 0)) {
                    context$1$0.next = 29;
                    break;
                }

                context$1$0.next = 27;
                return question.yesNo('No scripts were found. Would you like to create a site.js?');

            case 27:
                scaffoldScripts = context$1$0.sent;

                if (scaffoldScripts) {
                    jsPaths = scaffold.scripts(process.cwd());
                }

            case 29:
                if (!(otherPaths.length === 0)) {
                    context$1$0.next = 34;
                    break;
                }

                context$1$0.next = 32;
                return question.yesNo('No markup was found. Would you like to create an index.html?');

            case 32:
                scaffoldMarkup = context$1$0.sent;

                if (scaffoldMarkup) {
                    otherPaths = scaffold.markup(process.cwd());
                }

            case 34:
                return context$1$0.abrupt('return', { scss: scssPaths, js: jsPaths, other: otherPaths });

            case 35:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

// find all folders in directory, then remove ignoredPaths.
// This is faster than using **/* with ignore

// filter to include only folders that are not ignored

// this will let us watch files in root (only non-sass/js files for now)