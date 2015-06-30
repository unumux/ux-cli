#!/usr/bin/env node
require('babel-core/register');

var fs = require('fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2));

import * as question from "./lib/question.js";

import * as util from './lib/util.js';
import createUXConfig from './lib/ux-config.js';


async function main() {
    try {
        // check for login param
        if(argv.login) {
            await util.updateLogin();
        }

        // aliases for reconfigure switch
        var reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config;

        // if package.json does not exist, create it
        if(!fs.existsSync('./package.json')) {
            util.createPackageJson();
        }

        // if bower.json does not exist, create it
        if(!fs.existsSync('./bower.json')) {
            util.createBowerJson();
        }

        // load package.json and check if ui-framework is installed
        var packages = JSON.parse(fs.readFileSync('./package.json','utf8'));

        if(!packages.hasOwnProperty('devDependencies') || !packages.devDependencies.hasOwnProperty('@unumux/ui-framework')) {
            await util.installUIFramework();
        }

        var newInstall = !fs.existsSync('./ux.json');

        // create config file, if it does not exist or if reconfigure switch is passed
        if(newInstall || reconfigure) {
            await util.createUXConfig();
        }

        // install additional libraries, if first setup, if reconfigure switch is passed, or if --install is passed
        if(newInstall || reconfigure || argv.install) {
            await util.installLibraries();
        }

        // install packages if switches to override are not set
        if(argv.packages !== false) {

            if(argv.npm !== false) {
                await util.npmInstall();
            }

            if(argv.bower !== false) {
                await util.bowerInstall();
            }

        }

        util.runGulp(argv._);

    } catch(e) {
        console.log(e);
    }
}

main();
