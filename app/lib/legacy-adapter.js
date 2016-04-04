import path from "path";
import fs from "fs";
import util from "util";
import {EventEmitter} from "events";
import {spawn} from "child_process";
import Liftoff from "liftoff";

import * as debug from "@unumux/ux-debug";

function Adapter() {
    EventEmitter.call(this);
}

Adapter.prototype.start = function(modulePath, task) {
    const gulpPath = new Liftoff({
        name: "ux",
        moduleName: "gulp",
        configName: "ux",
        extensions: {
            ".json": null
        }
    }).launch({}, function(env) {
        const gulp = require(env.modulePath);
        require(modulePath);

        gulp.start("default");
    });
};

util.inherits(Adapter, EventEmitter);

module.exports = new Adapter();
