var colors = require("colors");
var stackTrace = require("stack-trace");
var path = require("path");

var enabled = false;

function log(msg) {
    var trace = stackTrace.get()[2];
    var line = trace.getLineNumber();
    var file = path.basename(trace.getFileName());

    if(enabled) {
        console.log(`[${file}:${line}] `.grey + msg);
    }
}

module.exports = {
    enable: function() {
        enabled = true;
    },
    disable: function() {
        enabled = false;
    },
    warn: function(msg) {
        log(msg.yellow);
    },
    log: function(msg) {
        log(msg.cyan);
    },
    error: function(msg) {
        log(msg.red);
    },
    json: function(obj) {
        if(enabled) {
            console.log(obj);
        }
    },
    enabled: function() {
        return enabled;
    }
};
