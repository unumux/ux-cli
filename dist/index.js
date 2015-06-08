#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _libQuestionJs = require('./lib/question.js');

var question = _interopRequireWildcard(_libQuestionJs);

var _libUtilJs = require('./lib/util.js');

var util = _interopRequireWildcard(_libUtilJs);

var _libUxConfigJs = require('./lib/ux-config.js');

var _libUxConfigJs2 = _interopRequireDefault(_libUxConfigJs);

require('babel-core/register');

var fs = require('fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2));

function main() {
    var reconfigure, packages, newInstall;
    return regeneratorRuntime.async(function main$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config;

                // if package.json does not exist, create it
                if (!fs.existsSync('./package.json')) {
                    util.createPackageJson();
                }

                // if package.json does not exist, create it
                if (!fs.existsSync('./bower.json')) {
                    util.createBowerJson();
                }

                packages = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

                if (!(!packages.hasOwnProperty('devDependencies') || !packages.devDependencies.hasOwnProperty('@unumux/ui-framework'))) {
                    context$1$0.next = 8;
                    break;
                }

                context$1$0.next = 8;
                return util.installUIFramework();

            case 8:
                newInstall = !fs.existsSync('./ux.json');

                if (!(newInstall || reconfigure)) {
                    context$1$0.next = 12;
                    break;
                }

                context$1$0.next = 12;
                return util.createUXConfig();

            case 12:
                if (!(newInstall || reconfigure || argv.install)) {
                    context$1$0.next = 15;
                    break;
                }

                context$1$0.next = 15;
                return util.installLibraries();

            case 15:
                if (!(argv.packages !== false)) {
                    context$1$0.next = 22;
                    break;
                }

                if (!(argv.npm !== false)) {
                    context$1$0.next = 19;
                    break;
                }

                context$1$0.next = 19;
                return util.npmInstall();

            case 19:
                if (!(argv.bower !== false)) {
                    context$1$0.next = 22;
                    break;
                }

                context$1$0.next = 22;
                return util.bowerInstall();

            case 22:

                util.runGulp(argv._);

                context$1$0.next = 28;
                break;

            case 25:
                context$1$0.prev = 25;
                context$1$0.t0 = context$1$0['catch'](0);

                console.log(context$1$0.t0);

            case 28:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[0, 25]]);
}

main();

// aliases for reconfigure switch
// load package.json and check if ui-framework is installed

// create config file, if it does not exist or if reconfigure switch is passed

// install additional libraries, if first setup, if reconfigure switch is passed, or if --install is passed

// install packages if switches to override are not set