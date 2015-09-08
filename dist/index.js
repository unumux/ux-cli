#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _libQuestionJs = require('./lib/question.js');

var question = _interopRequireWildcard(_libQuestionJs);

var _libUtilJs = require('./lib/util.js');

var util = _interopRequireWildcard(_libUtilJs);

var _libDebugJs = require('./lib/debug.js');

var debug = _interopRequireWildcard(_libDebugJs);

var _libUxConfigJs = require('./lib/ux-config.js');

var _libUxConfigJs2 = _interopRequireDefault(_libUxConfigJs);

require('babel-core/register');

var fs = require('fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2)),
    colors = require('colors');

function main() {
    var reconfigure, packages, newInstall;
    return regeneratorRuntime.async(function main$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;

                // enabled debug mode if debug or verbose arg set
                if (argv.debug || argv.verbose) {
                    debug.enable();
                }

                // why not
                if (argv.upupdowndownleftrightleftrightbastart) {
                    console.log('Why did you think this would work?'.zalgo.rainbow);
                }

                if (!argv.login) {
                    context$1$0.next = 8;
                    break;
                }

                debug.log('Updating login');
                context$1$0.next = 7;
                return regeneratorRuntime.awrap(util.updateLogin());

            case 7:
                debug.log('Login enabled');

            case 8:
                reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config;

                // if package.json does not exist, create it
                if (!fs.existsSync('./package.json')) {
                    util.createPackageJson();
                }

                // if bower.json does not exist, create it
                if (!fs.existsSync('./bower.json')) {
                    util.createBowerJson();
                }

                // load package.json and check if ui-framework is installed
                debug.log('Loading package.json to check for ui-framework...');
                packages = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

                if (!(!packages.hasOwnProperty('devDependencies') || !packages.devDependencies.hasOwnProperty('@unumux/ui-framework'))) {
                    context$1$0.next = 18;
                    break;
                }

                debug.log('package.json doesn\'t have key for ui-framework. Prompting to install...');
                debug.json(packages);
                context$1$0.next = 18;
                return regeneratorRuntime.awrap(util.installUIFramework());

            case 18:

                debug.log('Checking for ux.json...');
                newInstall = !fs.existsSync('./ux.json');

                if (!(newInstall || reconfigure)) {
                    context$1$0.next = 24;
                    break;
                }

                debug.log('ux.json not found. Prompting to create one...');
                context$1$0.next = 24;
                return regeneratorRuntime.awrap(util.createUXConfig());

            case 24:
                if (!(newInstall || reconfigure || argv.install)) {
                    context$1$0.next = 28;
                    break;
                }

                debug.log('Prompting to install libraries...');
                context$1$0.next = 28;
                return regeneratorRuntime.awrap(util.installLibraries());

            case 28:
                if (!(argv.packages !== false)) {
                    context$1$0.next = 35;
                    break;
                }

                if (!(argv.npm !== false)) {
                    context$1$0.next = 32;
                    break;
                }

                context$1$0.next = 32;
                return regeneratorRuntime.awrap(util.npmInstall());

            case 32:
                if (!(argv.bower !== false)) {
                    context$1$0.next = 35;
                    break;
                }

                context$1$0.next = 35;
                return regeneratorRuntime.awrap(util.bowerInstall());

            case 35:

                util.runGulp(argv._);

                context$1$0.next = 42;
                break;

            case 38:
                context$1$0.prev = 38;
                context$1$0.t0 = context$1$0['catch'](0);

                debug.error('There was an unexpected error. Details: ');
                debug.error(context$1$0.t0);

            case 42:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[0, 38]]);
}

main();
// check for login param

// aliases for reconfigure switch

// create config file, if it does not exist or if reconfigure switch is passed

// install additional libraries, if first setup, if reconfigure switch is passed, or if --install is passed

// install packages if switches to override are not set