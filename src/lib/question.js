var inquirer = require("inquirer");

function inquirerPromisify(options) {
    options.name = 'answer';
    return new Promise((resolve, reject) => {
        inquirer.prompt([options], function(answers) {
            resolve(answers.answer);
        });
    });
}


export function yesNo(question, defaultAns=true) {
    return inquirerPromisify({
        type: 'confirm',
        message: question,
        default: defaultAns
    });
}

export function list(question, choices, defaultAns=0) {
    return inquirerPromisify({
        type: 'list',
        message: question,
        default: defaultAns,
        choices: choices
    });
}

export function checkbox(question, choices) {
    return inquirerPromisify({
        type: 'checkbox',
        choices: choices,
        message: question
    });
}
