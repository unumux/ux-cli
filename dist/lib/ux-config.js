'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs'),
    path = require('path');

var UXConfig = (function () {
    function UXConfig(config) {
        var _this = this;

        _classCallCheck(this, UXConfig);

        this.scss = {
            src: this.appendGlobs(config.scss, 'scss'),
            dest: config.scss
        };

        this.js = {
            src: this.appendGlobs(config.js, 'js'),
            dest: config.js
        };

        this.watch = config.watch.map(function (folder) {
            return _this.appendGlobs(folder);
        });

        this.server = config.server;
        this.compileJs = config.compileJs;

        // if we aren't compiling JS, set it to be a watched folder as well
        if (!this.compileJs) {
            this.watch.push(this.js.src);
        }
    }

    _createClass(UXConfig, [{
        key: 'appendGlobs',
        value: function appendGlobs(folder) {
            var ext = arguments[1] === undefined ? '*' : arguments[1];

            // check if folder is actually a folder
            if (fs.statSync(folder).isDirectory()) {
                return folder + '/**/*.' + ext;
            } else {
                // if it isn't a folder, don't append globs
                return folder;
            }
        }
    }, {
        key: 'write',
        value: function write(writePath) {
            if (writePath) {
                fs.writeFile(writePath, JSON.stringify(this, null, 4));
            }
        }
    }]);

    return UXConfig;
})();

exports.UXConfig = UXConfig;
