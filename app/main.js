var fs = require("fs"),
    argv = require("minimist")(process.argv.slice(2));

import * as util from "./lib/util.js";
import * as debug from "@unumux/ux-debug";

module.exports = async function main() {
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

        // experimental update notifications support
        // if(!argv['disable-updates']) {
        //   debug.log('Update support enabled');
        //   var pkg = require('../package.json');
        //   await util.checkForUpdates(pkg.name, pkg.version, true);
        // }

        // check for login param
        if(argv.login) {
            debug.log("Updating login");
            await util.updateLogin();
            debug.log("Login enabled");
        }

        // aliases for reconfigure switch
        var reconfigure = argv.reconfigure || argv.reconfig || argv.configure || argv.config;

        // if package.json does not exist, create it
        if(!fs.existsSync("./package.json")) {
            util.createPackageJson();
        }

        // if bower.json does not exist, create it
        if(!fs.existsSync("./bower.json")) {
            util.createBowerJson();
        }

        // if(!argv['disable-updates']) {
        //   packages = JSON.parse(fs.readFileSync('./package.json','utf8'));
        //
        //   // experimental update notifications for framework build tools
        //   await util.checkForUpdates("@unumux/ui-framework", packages.devDependencies['@unumux/ui-framework'].replace('^', ''), false);
        // }

        debug.log("Checking for ux.json...");
        var newInstall = !fs.existsSync("./ux.json");

        // create config file, if it does not exist or if reconfigure switch is passed
        if(newInstall || reconfigure) {
            debug.log("ux.json not found. Prompting to create one...");
            await util.createUXConfig();
        }

        // install additional libraries, if first setup, if reconfigure switch is passed, or if --install is passed
        if(newInstall || reconfigure || argv.install) {
            debug.log("Prompting to install libraries...");
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

        if(argv.dev || argv.develop || argv.development) {
            util.watchGulp();
        } else {
            util.runGulp(argv._);
        }

    } catch(e) {
        debug.error("There was an unexpected error. Details: " );
        debug.error(e);
    }
};
