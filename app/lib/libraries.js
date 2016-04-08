import _ from "lodash";
import {execCmd} from "./util.js";
import * as debug from "@unumux/ux-debug";

const NPM_LIBRARIES = [{
    name: "jQuery",
    value: "jquery"
}, {
    name: "Angular 1.x",
    value: "angular"
}, {
    name: "Knockout",
    value: "knockout"
}, {
    name: "React",
    value: "react react-dom"
}, {
    name: "Lodash",
    value: "lodash"
}];

const BOWER_LIBRARIES = [{
    name: "Colonial Life: Branding & Styles",
    value: "unumux/colonial-branding"
}];

function convertLibrariesToQuestion(list, engine) {
    return list.map((lib) => {
        return {
            name: lib.name,
            value: {
                installName: lib.value,
                engine: engine
            }
        }
    });
}

export function get() {
    const AVAILABLE_LIBRARIES = [
        ...convertLibrariesToQuestion(NPM_LIBRARIES, "npm"),
        ...convertLibrariesToQuestion(BOWER_LIBRARIES, "bower")
    ];
    debug.log("Returning available libraries");
    debug.json(AVAILABLE_LIBRARIES);
    return AVAILABLE_LIBRARIES;
}

export function install(libs) {
    const groupedLibs = _.groupBy(libs, "engine");
    const tasks = [];
    debug.json(groupedLibs);
    
    if(groupedLibs.bower) {
        tasks.push(installBower(groupedLibs.bower));
    }
    
    if(groupedLibs.npm) {
        tasks.push(installNpm(groupedLibs.npm));
    }
    
    return Promise.all(tasks);
}

function installBower(libs) {
    debug.log("Installing user requested bower packages");
    return execCmd(`bower install --save ${_.map(libs, "installName").join(" ")}`);
}

function installNpm(libs) {
    debug.log("Installing user requested npm packages");
    return execCmd(`npm install --save ${_.map(libs, "installName").join(" ")}`);
}