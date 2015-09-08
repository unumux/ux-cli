'use strict';

var colors = require('colors');
var stackTrace = require('stack-trace');
var path = require('path');

var _enabled = false;

function _log(msg) {
    var trace = stackTrace.get()[2];
    var line = trace.getLineNumber();
    var file = path.basename(trace.getFileName());

    if (_enabled) {
        console.log(('[' + file + ':' + line + '] ').grey + msg);
    }
}

module.exports = {
    enable: function enable() {
        _enabled = true;
    },
    disable: function disable() {
        _enabled = false;
    },
    warn: function warn(msg) {
        _log(msg.yellow);
    },
    log: function log(msg) {
        _log(msg.cyan);
    },
    error: function error(msg) {
        _log(msg.red);
    },
    json: function json(obj) {
        console.log(obj);
    },
    enabled: function enabled() {
        return _enabled;
    }
};