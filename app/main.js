import {Spinner} from "cli-spinner";

import {fork} from "child_process";

import {npmInstall, bowerInstall} from "./lib/deps";

export default function(task) {
    const spinner = new Spinner("Installing packages... %s");
    spinner.setSpinnerString(0);
    spinner.start();
    Promise.all([npmInstall(), bowerInstall()]).then(() => {
        spinner.stop();
        run(task);
    });

}

function run(task) {
    const RUN_PROCESS = fork(__dirname + "/run.js");
    const spinner = new Spinner("Starting UX... %s");
    spinner.setSpinnerString(0);
    spinner.start();
    RUN_PROCESS.on("message", function(obj) {
        spinner.stop(true);
        switch(obj.msg) {
        case "ADAPTER_STARTED":
            RUN_PROCESS.send({ cmd: "START", task });
            break;
        case "NO_PROJECT":
            console.log("No project was found. Run `ux --init` to start a new project in this folder.");
            break;
        }
    });
}
