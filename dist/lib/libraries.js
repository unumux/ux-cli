"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = get;
exports.install = install;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require("./util.js");

var _uxDebug = require("@unumux/ux-debug");

var debug = _interopRequireWildcard(_uxDebug);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var NPM_LIBRARIES = [{
    name: "jQuery",
    value: "jquery"
}, {
    name: "Angular 1.x",
    value: "angular"
}, {
    name: "Knockout",
    value: "knockout"
}, {
    name: "React",
    value: "react react-dom"
}, {
    name: "Lodash",
    value: "lodash"
}];

var BOWER_LIBRARIES = [{
    name: "Colonial Life: Branding & Styles",
    value: "unumux/colonial-branding"
}];

function convertLibrariesToQuestion(list, engine) {
    return list.map(function (lib) {
        return {
            name: lib.name,
            value: {
                installName: lib.value,
                engine: engine
            }
        };
    });
}

function get() {
    var AVAILABLE_LIBRARIES = [].concat(_toConsumableArray(convertLibrariesToQuestion(NPM_LIBRARIES, "npm")), _toConsumableArray(convertLibrariesToQuestion(BOWER_LIBRARIES, "bower")));
    debug.log("Returning available libraries");
    debug.json(AVAILABLE_LIBRARIES);
    return AVAILABLE_LIBRARIES;
}

function install(libs) {
    var groupedLibs = _lodash2.default.groupBy(libs, "engine");
    var tasks = [];
    debug.json(groupedLibs);

    if (groupedLibs.bower) {
        tasks.push(installBower(groupedLibs.bower));
    }

    if (groupedLibs.npm) {
        tasks.push(installNpm(groupedLibs.npm));
    }

    return Promise.all(tasks);
}

function installBower(libs) {
    debug.log("Installing user requested bower packages");
    return (0, _util.execCmd)("bower install --save " + _lodash2.default.map(libs, "installName").join(" "));
}

function installNpm(libs) {
    debug.log("Installing user requested npm packages");
    return (0, _util.execCmd)("npm install --save " + _lodash2.default.map(libs, "installName").join(" "));
}