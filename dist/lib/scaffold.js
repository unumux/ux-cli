'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.styles = styles;
exports.scripts = scripts;
exports.markup = markup;
exports.fullSite = fullSite;
var fs = require('fs-extra'),
    path = require('path');

function styles(dest) {
    fs.copySync(path.join(__dirname, '../../template/styles'), path.join(dest, 'styles'));
    return ['styles'];
}

function scripts(dest) {
    fs.copySync(path.join(__dirname, '../../template/scripts'), path.join(dest, 'scripts'));
    return ['scripts'];
}

function markup(dest) {
    fs.copySync(path.join(__dirname, '../../template/index.html'), path.join(dest, 'index.html'));
    return ['index.html'];
}

function fullSite(dest) {
    var scssPaths = styles(dest);
    var jsPaths = scripts(dest);
    var otherPaths = markup(dest);

    return {
        scss: scssPaths,
        js: jsPaths,
        other: otherPaths
    };
}