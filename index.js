#!/usr/bin/env node

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var gulpCmd = (process.platform === "win32" ? "gulp.cmd" : "gulp");


function bowerInstall() {
    console.log("Installing bower packages...")
    exec('bower install', function() {
        runGulp();
    });
}

function npmInstall() {
    console.log("Installing npm packages...")
    exec('npm install', function() {
        bowerInstall();
    });
}

function runGulp() {
    spawn(gulpCmd, ['--gulpfile=node_modules/@unumux/ui-framework/index.js', '--cwd=.'], {
        stdio: [0, process.stdout, process.stderr]
    });
}

npmInstall();
