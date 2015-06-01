'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.yesNo = yesNo;

function yesNo(question) {
    var defaultAns = arguments[1] === undefined ? true : arguments[1];

    return new Promise(function (resolve, reject) {
        inquirer.prompt([{
            type: 'confirm',
            name: 'answer',
            message: question,
            'default': defaultAns
        }], function (answers) {
            resolve(answers.answer);
        });
    });
}