import fs from "fs";
import path from "path";
import semver from "semver";
import {exec} from "child_process";
import _ from "lodash";

import * as util from "./util.js";

const NM_PATH = path.join(".", "node_modules");
const BOWER_PATH = path.join(".", "bower_components");

function checkDependency(version, name, packagePath, manifestName) {
    return new Promise(function(resolve){
        fs.readFile(path.join(packagePath, name, manifestName), function(err, data) {
            if(!data) {
                resolve(false);
            } else {
                let jsonData = JSON.parse(data);
                if(jsonData && jsonData.version) {
                    resolve(semver.satisfies(jsonData.version, version));
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export function shouldInstallPackages(packagePath, dependencies, manifestName) {
    return new Promise(function(resolve) {
        let depPromises = _.map(dependencies, function(version, name) {
            let parsedVersion = version.split("#");
            return checkDependency(parsedVersion[parsedVersion.length - 1], name, packagePath, manifestName);
        });

        Promise.all(depPromises).then(function(res) {
            let shouldInst = res.reduce(function(prev, curr) {
                return prev || !curr;
            }, false);

            resolve(shouldInst);
        });
    });
}

export function shouldInstallNPMPackages() {
    let packageJson = JSON.parse(fs.readFileSync("./package.json"));
    let dependencies = _.merge(packageJson.devDependencies, packageJson.dependencies);
    return shouldInstallPackages(NM_PATH, dependencies, "package.json");
}

export function shouldInstallBowerPackages() {
    let bowerJson = JSON.parse(fs.readFileSync("./bower.json"));
    return shouldInstallPackages(BOWER_PATH, bowerJson.dependencies, "bower.json");
}

export function npmInstall() {
    return new Promise((resolve) => {
        shouldInstallNPMPackages().then((shouldInstall) => {
            if(shouldInstall) {
                util.execCmd("npm install").then(resolve);
            } else {
                resolve();
            }
        });
    });
}

export function bowerInstall() {
    return new Promise((resolve) => {
        shouldInstallBowerPackages().then((shouldInstall) => {
            if(shouldInstall) {
                util.execCmd("bower install").then(resolve);
            } else {
                resolve();
            }
        });
    });
}
