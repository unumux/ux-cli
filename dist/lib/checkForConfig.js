'use strict';

var _uxConfigJs = require('./ux-config.js');

var fs = require('fs'),
    path = require('path'),
    inquirer = require('inquirer'),
    _ = require('lodash'),
    glob = require('glob');

function determineSiteType(cb) {
    var cwd = process.cwd();
    var pathParts = cwd.split(path.sep);

    // check if sitecore site
    if (pathParts.indexOf('AllSites') >= 0 && pathParts.indexOf('SiteCore') >= 0) {
        // this is a Sitecore site
        setFoldersForSitecoreSite(cwd);
    }

    // try to find paths automatically
    else {
        var ignorePaths = ['node_modules/**/*', 'bower_components/**/*', 'bin/**/*', 'dist/**/*', 'App_Data/**/*', 'App_Start/**/*', 'obj/**/*', '*.js', '*.css'];

        var filesPromise = findFiles('**/*.{scss,sass,cshtml,html,css,aspx,js}', ignorePaths);

        filesPromise.then(function (paths) {
            inquirer.prompt([{
                type: 'list',
                name: 'scssFolder',
                message: 'Which folder are your scss files stored in?',
                choices: paths.scss
            }, {
                type: 'list',
                name: 'jsFolder',
                message: 'Which folder are your JS files stored in?',
                choices: paths.js
            }, {
                type: 'confirm',
                name: 'compileJs',
                message: 'Should Javascript files be minified?',
                'default': true
            }, {
                type: 'checkbox',
                name: 'watchFolders',
                message: 'Which other folders should be watched for changes? The webpage will refresh automatically when these files are changed.',
                choices: paths.other
            }, {
                type: 'confirm',
                name: 'server',
                message: 'Is this a static site?',
                'default': false
            }], function (answers) {
                var config = new _uxConfigJs.UXConfig({
                    scss: answers.scssFolder,
                    js: answers.jsFolder,
                    compileJs: answers.compileJs,
                    watch: answers.watchFolders,
                    server: answers.server
                });

                config.write('./ux.json');

                cb();
            });
        });
    }
}

function findFiles(globPath, ignorePaths) {
    return new Promise(function (resolve, reject) {
        glob(globPath, { ignore: ignorePaths, nocase: true }, function (err, files) {
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
    });
}

function setFoldersForSitecoreSite(cwd) {
    console.log('sitecore');
}

function checkForConfig(cb) {
    fs.readFile('./ux.json', function (err, contents) {
        if (contents && contents.length > 0) {
            cb();
        } else {
            inquirer.prompt([{
                type: 'confirm',
                name: 'continue',
                message: 'A config file (ux.json) was not found. Would you like to create one?' }], function (answers) {
                if (answers['continue']) {
                    console.log('Creating config file...');
                    determineSiteType(cb);
                } else {
                    process.exit();
                }
            });
        }
    });
}

module.exports = checkForConfig;