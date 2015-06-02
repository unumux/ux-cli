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
    var reconfigure, packages;
    return regeneratorRuntime.async(function main$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config;

                // if package.json does not exist, create it
                if (!fs.existsSync('./package.json')) {
                    util.createPackageJson();
                }

                packages = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

                if (!(!packages.hasOwnProperty('devDependencies') || !packages.devDependencies.hasOwnProperty('@unumux/ui-framework'))) {
                    context$1$0.next = 7;
                    break;
                }

                context$1$0.next = 7;
                return util.installUIFramework();

            case 7:
                if (!(!fs.existsSync('./ux.json') || reconfigure)) {
                    context$1$0.next = 10;
                    break;
                }

                context$1$0.next = 10;
                return util.createUXConfig();

            case 10:
                if (!(argv.packages !== false)) {
                    context$1$0.next = 17;
                    break;
                }

                if (!(argv.npm !== false)) {
                    context$1$0.next = 14;
                    break;
                }

                context$1$0.next = 14;
                return util.npmInstall();

            case 14:
                if (!(argv.bower !== false)) {
                    context$1$0.next = 17;
                    break;
                }

                context$1$0.next = 17;
                return util.bowerInstall();

            case 17:

                util.runGulp(argv._);

                context$1$0.next = 23;
                break;

            case 20:
                context$1$0.prev = 20;
                context$1$0.t0 = context$1$0['catch'](0);

                console.log(context$1$0.t0);

            case 23:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[0, 20]]);
}

main();

// aliases for reconfigure switch
// load package.json and check if ui-framework is installed

// create config file, if it does not exist or if reconfigure switch is passed

// install packages if switches to override are not set