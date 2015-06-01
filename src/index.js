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

        // aliases for reconfigure switch
        var reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config;

        // if package.json does not exist, create it
        if(!fs.existsSync('./package.json')) {
            util.createPackageJson();
        }

        // load package.json and check if ui-framework is installed
        var packages = JSON.parse(fs.readFileSync('./package.json','utf8'));

        if(!packages.hasOwnProperty('devDependencies') || !packages.devDependencies.hasOwnProperty('@unumux/ui-framework')) {
            await util.installUIFramework();
        }

        // create config file, if it does not exist or if reconfigure switch is passed
        if(!fs.existsSync('./ux.json') || reconfigure) {
            await util.createUXConfig();
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

        util.runGulp();

    } catch(e) {
        console.log(e);
    }
}

main();
