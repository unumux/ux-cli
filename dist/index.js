#!/usr/bin/env node
'use strict';

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');

var argv = require('minimist')(process.argv.slice(2));

var gulpCmd = process.platform === 'win32' ? 'gulp.cmd' : 'gulp';

var checkForConfig = require('./lib/checkForConfig.js');

function checkForUiFramework() {
    fs.readFile('./package.json', function (err, contents) {

        // if package.json doesn't exist, create it
        if (err && err.code === 'ENOENT') {
            fs.writeFileSync('./package.json', JSON.stringify({}, null, 4));
            installUiFramework();
        } else {
            var packagejson = JSON.parse(contents.toString());

            if (packagejson.hasOwnProperty('devDependencies') && packagejson.devDependencies.hasOwnProperty('@unumux/ui-framework')) {
                checkForConfig(npmInstall);
            } else {
                installUiFramework();
            }
        }
    });
}

function installUiFramework() {
    inquirer.prompt([{
        type: 'list',
        name: 'continue',
        message: 'UI Framework not found. Would you like to install it?',
        choices: [{
            name: 'Yes',
            value: true
        }, {
            name: 'No',
            value: false
        }]
    }], function (answers) {
        if (answers['continue']) {
            console.log('Installing UI Framework...');
            exec('npm install @unumux/ui-framework --save-dev', function () {
                checkForConfig(npmInstall);
            });
        } else {
            process.exit();
        }
    });
}

function bowerInstall() {
    if (argv.packages === false || argv.bower === false) {
        runGulp();
        return;
    }

    console.log('Installing bower packages...');
    exec('bower install', function () {
        runGulp();
    });
}

function npmInstall() {
    if (argv.packages === false || argv.npm === false) {
        bowerInstall();
        return;
    }

    console.log('Installing npm packages...');
    exec('npm install', function () {
        bowerInstall();
    });
}

function runGulp() {
    var gulp = spawn(gulpCmd, ['--gulpfile=node_modules/@unumux/ui-framework/index.js', '--cwd=.'], {
        stdio: [0, process.stdout, process.stderr]
    });

    gulp.on('close', function (code) {
        if (code !== 0) {}
    });
}

checkForUiFramework();