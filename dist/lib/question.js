'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.yesNo = yesNo;
exports.text = text;
exports.password = password;
exports.list = list;
exports.checkbox = checkbox;
var inquirer = require('inquirer');

function inquirerPromisify(options) {
    options.name = 'answer';
    return new Promise(function (resolve, reject) {
        inquirer.prompt([options], function (answers) {
            resolve(answers.answer);
        });
    });
}

function yesNo(question) {
    var defaultAns = arguments[1] === undefined ? true : arguments[1];

    return inquirerPromisify({
        type: 'confirm',
        message: question,
        'default': defaultAns
    });
}

function text(question) {
    var defaultAns = arguments[1] === undefined ? null : arguments[1];

    return inquirerPromisify({
        type: 'input',
        message: question,
        'default': defaultAns
    });
}

function password(question) {
    var defaultAns = arguments[1] === undefined ? null : arguments[1];

    return inquirerPromisify({
        type: 'password',
        message: question,
        'default': defaultAns
    });
}

function list(question, choices) {
    var defaultAns = arguments[2] === undefined ? 0 : arguments[2];

    return inquirerPromisify({
        type: 'list',
        message: question,
        'default': defaultAns,
        choices: choices
    });
}

function checkbox(question, choices) {
    return inquirerPromisify({
        type: 'checkbox',
        choices: choices,
        message: question
    });
}