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

function createUXConfig() {
    var shouldCreate, isSitecoreSite, paths, config, scssPath, jsPath, watchPaths;
    return regeneratorRuntime.async(function createUXConfig$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return question.yesNo('ux.json not found. Would you like to create one?');

            case 2:
                shouldCreate = context$1$0.sent;

                if (!shouldCreate) {
                    context$1$0.next = 25;
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
                context$1$0.next = 25;
                break;

            case 11:
                context$1$0.next = 13;
                return UXConfig.findPaths(process.cwd());

            case 13:
                paths = context$1$0.sent;
                context$1$0.next = 16;
                return question.list('Where are your SCSS files stored?', paths.scss);

            case 16:
                scssPath = context$1$0.sent;
                context$1$0.next = 19;
                return question.list('Where are your JS files stored?', paths.js);

            case 19:
                jsPath = context$1$0.sent;
                context$1$0.next = 22;
                return question.checkbox('What other files/folders should trigger a refresh in the browser when files are changed?', paths.other);

            case 22:
                watchPaths = context$1$0.sent;
                config = new UXConfig.Config({ scss: scssPath, js: jsPath, watch: watchPaths }, false, false);

                config.write('./ux.json');

            case 25:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function findGulpPath() {
    var gulpCmd = process.platform === 'win32' ? 'gulp.cmd' : 'gulp';

    var searchPaths = ['node_modules/@unumux/ui-framework/node_modules/.bin/' + gulpCmd, 'node_modules/.bin/' + gulpCmd];

    searchPaths.forEach(function (path) {
        if (fs.existsSync(path)) {
            gulpCmd = path;
        }
    });

    return gulpCmd;
}

function runGulp() {
    var gulpCmd, gulp;
    return regeneratorRuntime.async(function runGulp$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                gulpCmd = findGulpPath();
                gulp = spawn(gulpCmd, ['--gulpfile=node_modules/@unumux/ui-framework/index.js', '--cwd=.'], {
                    stdio: [0, process.stdout, process.stderr]
                });

                gulp.on('close', function (code) {
                    console.log(code);
                    if (code !== 0) {}
                });

            case 3:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function findFiles(globPath, ignorePaths) {
    return new Promise(function (resolve, reject) {
        // find all folders in directory, then remove ignoredPaths.
        // This is faster than using **/* with ignore
        var allFilesFolders = fs.readdirSync(globPath);

        // filter to include only folders that are not ignored
        var folders = allFilesFolders.filter(function (file) {
            return fs.statSync(file).isDirectory() && ignorePaths.indexOf(file) < 0;
        });

        var fileSearchExtensions = ['scss', 'sass', 'cshtml', 'html', 'css', 'aspx', 'js'];

        var folderGlob = '{' + folders.join(',') + '}/**/*.{' + fileSearchExtensions.join(',') + '}';

        var files = glob.sync(folderGlob, { nocase: true });

        // this will let us watch files in root (only non-sass/js files for now)
        var rootFileGlob = '*.{html,cshtml,aspx,css}';

        files = files.concat(glob.sync(rootFileGlob, { nocase: true }));

        var result = _.groupBy(files, function (file) {
            return path.extname(file);
        });

        var scssPaths = _.uniq(_.union(result['.scss'], result['.sass']).map(function (file) {
            return file.split(path.sep)[0];
        }));

        var jsPaths = _.uniq(result['.js'].map(function (file) {
            return file.split(path.sep)[0];
        }));

        var otherPaths = _.uniq(_.flatten(_.values(_.omit(result, ['.js', '.scss', '.sass']))).map(function (file) {
            return file.split(path.sep)[0];
        }));

        otherPaths = otherPaths.filter(function (path) {
            return scssPaths.indexOf(path) < 0;
        });

        resolve({ scss: scssPaths, js: jsPaths, other: otherPaths });
    });
}