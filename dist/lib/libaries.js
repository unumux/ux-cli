"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLibraries = getLibraries;
exports.installLibrary = installLibrary;
var AVAILABLE_LIBRARIES = [{
    "label": "jQuery",
    "value": "jquery",
    "engine": "npm"
}, {
    "label": "Angular 1.x",
    "value": "angular"
}, {
    "label": "Knockout",
    "value": "knockout"
}, {
    "label": "React",
    "value": "react react-dom"
}, {
    "label": "Colonial Life branding styles",
    "value": "unumux/colonial-branding"
}];

function getLibraries() {
    return AVAILABLE_LIBRARIES;
}

function installLibrary(lib) {
    console.log(lib);
}