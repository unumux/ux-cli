var fs = require('fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2)),
    colors = require('colors');

import * as question from "./lib/question.js";

import * as util from './lib/util.js';
import * as debug from './lib/debug.js';
import createUXConfig from './lib/ux-config.js';


export default async function main() {
    try {
        // enabled debug mode if debug or verbose arg set
        if(argv.debug || argv.verbose) {
            debug.enable();
        }

        // print the current version
        if(argv.v || argv.version) {
          console.log(util.getVersion());
          process.kill();
        }

        // enable experimental update notifications support
        if(!argv['disable-updates']) {
          debug.log('Update support enabled');
          await util.checkForUpdates();
        }

        // why not
        if(argv.upupdowndownleftrightleftrightbastart) {
            console.log('Why did you think this would work?'.zalgo.rainbow);
        }

        // check for login param
        if(argv.login) {
            debug.log("Updating login");
            await util.updateLogin();
            debug.log("Login enabled");
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
        debug.log("Loading package.json to check for ui-framework...");
        var packages = JSON.parse(fs.readFileSync('./package.json','utf8'));

        if(!packages.hasOwnProperty('devDependencies') || !packages.devDependencies.hasOwnProperty('@unumux/ui-framework')) {
            debug.log("package.json doesn't have key for ui-framework. Prompting to install...");
            debug.json(packages);
            await util.installUIFramework();
        }

        debug.log('Checking for ux.json...');
        var newInstall = !fs.existsSync('./ux.json');

        // create config file, if it does not exist or if reconfigure switch is passed
        if(newInstall || reconfigure) {
            debug.log('ux.json not found. Prompting to create one...');
            await util.createUXConfig();
        }

        // install additional libraries, if first setup, if reconfigure switch is passed, or if --install is passed
        if(newInstall || reconfigure || argv.install) {
            debug.log('Prompting to install libraries...');
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
        debug.error("There was an unexpected error. Details: " );
        debug.error(e);
    }
}
