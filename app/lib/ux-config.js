var fs = require('fs'),
    path = require('path');

import * as util from "./util.js";

export class Config {
    constructor(paths, server=false, compileJs=true, mainJsFile, proxy=false) {

        if(paths.scss) {
            this.scss = {
                src: this.appendGlobs(paths.scss, 'scss'),
                dest: paths.scss
            }
        }

        if(paths.js) {
            this.js = {
                src: this.appendGlobs(paths.js, 'js'),
                dest: paths.js
            }
        }

        if(paths.watch) {
            this.watch = paths.watch.map((folder) => {
                return this.appendGlobs(folder);
            });
        }

        this.server = server;
        this.compileJs = compileJs;
        this.proxy = proxy;

        // if we aren't compiling JS, set it to be a watched folder as well
        if(this.compileJs && mainJsFile) {
            this.js.main = mainJsFile;
        } else if(this.js && this.js.src) {
            this.watch.push(this.js.src);
        }


    }

    appendGlobs(folder, ext='*') {

        // check if folder is actually a folder
        if(fs.statSync(folder).isDirectory()) {
            return folder + "/**/*." + ext;
        } else {
            // if it isn't a folder, don't append globs
            return folder;
        }

    }

    write(writePath) {
        if(writePath) {
            fs.writeFile(writePath, JSON.stringify(this, null, 4))
        }
    }
}


/**
 * detectIfSitecoreSite - determines if a given folder is inside of a Sitecore site
 *
 * @param  {string} dir
 * @return {boolean}     is this a Sitecore site?
 */

export function detectIfSitecoreSite(dir) {
    var pathParts = dir.split(path.sep);

    // check if sitecore site
    if(pathParts.indexOf('AllSites') >= 0 && pathParts.indexOf('SiteCore') >= 0 && pathParts.indexOf('UI') >= 0) {
        // this is a Sitecore site
        return true;
    }

    // this is not a Sitecore site
    return false;
}


/**
 * findSitecorePaths - determine paths of styles/scripts/other watchable files
 *                     for a Sitecore site
 *
 * @param  {string} dir current directory
 * @return {object}     paths
 */

export function findSitecorePaths(dir) {
    var pathParts = dir.split(path.sep);

    // make sure we are in the correct spot
    if(pathParts[pathParts.length - 3] === 'UI') {
        var pathSuffix = pathParts.slice(-2).join(path.sep);

        var relativePrefix = ["..", "..", ".."].join(path.sep);

        var scss = [relativePrefix, "styles", pathSuffix].join(path.sep);
        var js = [relativePrefix, "scripts", pathSuffix].join(path.sep);
        var watch = [
            [relativePrefix, "layouts", pathSuffix].join(path.sep),
            [relativePrefix, "images", pathSuffix].join(path.sep)
        ];

        return {
            scss: scss,
            js: js,
            watch: watch
        };
    }
}


/**
 * findPaths - determine paths of styles/scripts/other watchable files
 *             fot a non-Sitecore site
 *
 * @param  {string} dir current directory
 * @return {object}     paths
 */

export async function findPaths(dir) {
    var ignorePaths = ['node_modules', 'bower_components', 'bin', 'dist', 'App_Data', 'App_Start', 'obj'];
    return await util.findFiles(path.join(dir), ignorePaths);
}
