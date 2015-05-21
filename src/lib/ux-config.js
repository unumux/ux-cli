var fs = require('fs'),
    path = require('path');

export class UXConfig {
    constructor(config) {

        this.scss = {
            src: this.appendGlobs(config.scss, 'scss'),
            dest: config.scss
        }

        this.js = {
            src: this.appendGlobs(config.js, 'js'),
            dest: config.js
        }

        this.watch = config.watch.map((folder) => {
            return this.appendGlobs(folder);
        });

        this.server = config.server;
        this.compileJs = config.compileJs;

        // if we aren't compiling JS, set it to be a watched folder as well
        if(!this.compileJs) {
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
