var exec = require("child_process").exec,
    execSync = require("child_process").execSync,
    spawn = require("child_process").spawn,
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    _ = require("lodash"),
    packageJson = require("package-json"),
    semver = require("semver"),
    ux = require("@unumux/lib-ux"),
    chokidar = require("chokidar");


import * as UXConfig from "./ux-config.js";
import * as question from "@unumux/ux-questions";
import * as debug from "@unumux/ux-debug";
import * as scaffold from "./scaffold.js";
import * as libraries from "./libraries.js";

var isWin = process.platform === "win32";

function getUserHome() {
    return process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"];
}

export function execCmd(cmd, visible) {
    debug.log(`Executing command: ${cmd}`);
    return new Promise((resolve) => {
        const shell = isWin ? "cmd.exe" : "sh";
        const cmdSwitch = isWin ? "/c" : "-c";
        const stdio = debug.enabled() || visible ? [0, process.stdout, process.stderr] : "ignore";

        spawn(shell, [cmdSwitch, cmd], {
            stdio: stdio
        }).on("close", function() {
            debug.log(`Command completed successfully: ${cmd}`);
            resolve();
        });
    });
}

export function createPackageJson() {
    debug.log(`Creating package.json...`);

    const packageJson = {
        private: true,
        devDependencies: {
            "@unumux/ux-build-tools": `^${getToolsVersion()}`
        },
        scripts: {
            start: "gulp --gulpfile=node_modules/@unumux/ux-build-tools/index.js --cwd=."
        }
    };

    fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 4));
    debug.log(`package.json created`);
}

export function createBowerJson() {
    debug.log(`Creating bower.json...`);
    const bowerJson = {
        private: true,
        name: path.basename(process.cwd())
    };

    fs.writeFileSync("./bower.json", JSON.stringify(bowerJson, null, 4));
    debug.log(`bower.json created`);
}


export async function bowerInstall() {
    if (await ux.shouldInstallBowerPackages()) {
        console.log("Installing Bower packages...");
        return execCmd("bower install");
    }
}

export async function npmInstall() {
    if (await ux.shouldInstallNPMPackages()) {
        console.log("Installing NPM packages...");
        return execCmd("npm install");
    }
}

function getToolsVersion() {
    let version = execSync("npm show @unumux/ux-build-tools version").toString().trim();
    if (semver.valid(version)) {
        return version;
    } else {
        return "3.0.0";
    }
}

export async function installUIFramework() {
    let shouldInstall = await question.yesNo('UX Build Tools not found. Would you like to install them?');

    if(shouldInstall) {
        console.log('Installing UX Build Tools...')
        debug.log('Getting latest version of ux-build-tools...');
        let version = require("child_process").execSync('npm show @unumux/ux-build-tools version');
        console.log(version.toString())
    }
}

async function generateConfig(paths) {
    var scssPath = await question.list('Where are your SCSS files stored?', paths.scss);
    var jsPath = await question.list('Where are your JS files stored?', paths.js);

    if(paths.other.length > 0) {
        if(paths.other.length === 1 && paths.other[0] === "index.html") {
            var watchPaths = ["index.html"];
        } else {
            var watchPaths = await question.checkbox('What other files/folders should trigger a refresh in the browser when files are changed?', paths.other);
        }
    }
    var compileJs = await question.yesNo('Should Javascript files be processed with Browserify?');

    if(compileJs) {
        var jsFiles = glob.sync(path.join(jsPath, '**/*.js'), {ignore: ['**/*.min.js']});
        var mainJsFile = await question.list('Which JS file is your main (entry) file?', jsFiles);
    } else {
        var mainJsFile = false;
    }


    var staticSite = await question.yesNo('Is this a static site?');

    if(!staticSite) {
        var proxy = await question.text('What is the local url of the site you are working on? (ex: http://my.localhost.com/producers)');
    }

    var config = new UXConfig.Config({ scss: scssPath, js: jsPath, watch: watchPaths }, staticSite, compileJs, mainJsFile, proxy);

    config.write('./ux.json');
}

export async function createUXConfig() {
    let shouldCreate = await question.yesNo("This does not appear to be a UX project. Would you like to install the ux-build-tools?");

    if(shouldCreate) {
        let isSitecoreSite = UXConfig.detectIfSitecoreSite(process.cwd());

        if(isSitecoreSite) {
            let paths = UXConfig.findSitecorePaths(process.cwd());
            let proxy = await question.text('What is the local url of the site you are working on? (ex: http://my.localhost.com/producers)');
            let config = new UXConfig.Config(paths, false, false, '', proxy);
            config.write('./ux.json');
        } else {
            let paths = await UXConfig.findPaths(process.cwd());
            await generateConfig(paths)


        }
    } else {
        process.exit();
    }
}

function findGulpPath() {
    let gulpCmd = (process.platform === "win32" ? "gulp.cmd" : "gulp");
    let searchPaths = [
        ["node_modules", "@unumux", "ux-build-tools", "node_modules", ".bin", gulpCmd],
        ["node_modules", ".bin", gulpCmd],
        ["node_modules", "@unumux", "ui-framework", "node_modules", ".bin", gulpCmd],
    ];

    searchPaths.forEach(function(searchPathTmp) {
        let searchPath = searchPathTmp.join(path.sep);
        if (fs.existsSync(searchPath)) {
            gulpCmd = searchPath;
        }
    });
    debug.log(`Gulp path: ${gulpCmd}`);

    return gulpCmd;
}

export async function runGulp(tools, args) {
    var cmd = findGulpPath();
    var args = args.concat([`--gulpfile=node_modules/${tools}/index.js`, "--cwd=."]);

    var gulp = spawn(cmd, args, {
        stdio: [0, process.stdout, process.stderr]
    });

    gulp.on("close", function(code) {
        if (code !== 0) {

        }
    });

    return gulp;

}

function pathExists(pathName) {
    return new Promise((resolve, reject) => {
        fs.stat(pathName, (err, stats) => {
            if(err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });     
    });
}

export async function determineBuildTools() {
    if(await pathExists("node_modules/@unumux/ux-build-tools")) {
        return "@unumux/ux-build-tools";
    } else if(await pathExists("node_modules/@unumux/ui-framework")) {
        return "@unumux/ui-framework";
    } else {
        throw "UX Build Tools does not seem to be installed. Try running `npm install -D @unumux/ux-build-tools`";
    }        
}

export async function watchGulp() {
    let gulpProcess = await runGulp([]);
    let debounceTimeout;

    chokidar.watch("node_modules/@unumux/ui-framework/**/*", {
        ignored: ["node_modules/@unumux/ui-framework/node_modules", "node_modules/@unumux/ui-framework/.git"],
        ignoreInitial: true
    }).on("all", () => {
        clearTimeout(debounceTimeout);
        setTimeout(async function() {
            gulpProcess.kill("SIGINT");
            gulpProcess = await runGulp(["--no-open"]);
        }, 100);
    });
}

export async function findFiles(globPath, ignorePaths) {
    // find all folders in directory, then remove ignoredPaths.
    // This is faster than using **/* with ignore
    let allFilesFolders = fs.readdirSync(globPath);

    // filter to include only folders that are not ignored
    let folders = allFilesFolders.filter(function(file) {
        return fs.statSync(file).isDirectory() && ignorePaths.indexOf(file) < 0;
    });

    let fileSearchExtensions = ["scss", "sass", "cshtml", "html", "css", "aspx", "js"];

    let folderGlob = `{${folders.join(",")}}/**/*.{${fileSearchExtensions.join(",")}}`;

    var files = glob.sync(folderGlob, {
        nocase: true
    });

    // this will let us watch files in root (only non-sass/js files for now)
    let rootFileGlob = "*.{html,cshtml,aspx,css}";

    files = files.concat(glob.sync(rootFileGlob, {
        nocase: true
    }));

    var result = _.groupBy(files, function(file) {
        return path.extname(file);
    });

    var scssPaths = _.uniq(_.union(result[".scss"], result[".sass"]).map(function(file) {
        return file.split("/")[0];
    }));

    var jsPaths = _.uniq(_.union(result[".js"], []).map(function(file) {
        return file.split("/")[0];
    }));

    var otherPaths = _.uniq(_.flatten(_.values(_.omit(result, [".js", ".scss", ".sass"]))).map(function(file) {
        return file.split("/")[0];
    }));

    otherPaths = otherPaths.filter(function(path) {
        return scssPaths.indexOf(path) < 0;
    });

    if (scssPaths.length === 0 && jsPaths.length === 0 && otherPaths.length === 0) {

        var scaffoldFullSite = await question.yesNo("No styles, scripts, or markup were found. Would you like to scaffold a basic site?");
        if (scaffoldFullSite) {
            let scaffoldPaths = scaffold.fullSite(process.cwd());
            scssPaths = scaffoldPaths.scss;
            jsPaths = scaffoldPaths.js;
            otherPaths = scaffoldPaths.other;
        }

    } else {

        if (scssPaths.length === 0) {
            var scaffoldStyles = await question.yesNo("No styles were found. Would you like to create a site.scss?");
            if (scaffoldStyles) {
                scssPaths = scaffold.styles(process.cwd());
            }
        }

        if (jsPaths.length === 0) {
            var scaffoldScripts = await question.yesNo("No scripts were found. Would you like to create a site.js?");
            if (scaffoldScripts) {
                jsPaths = scaffold.scripts(process.cwd());
            }
        }

        if (otherPaths.length === 0) {
            var scaffoldMarkup = await question.yesNo("No markup was found. Would you like to create an index.html?");
            if (scaffoldMarkup) {
                otherPaths = scaffold.markup(process.cwd());
            }
        }
    }

    return {
        scss: scssPaths,
        js: jsPaths,
        other: otherPaths
    };
}

export async function installLibraries() {
    var additionalLibraries = await question.checkbox("Would you like to install any additional libraries?", libraries.get());

    if (additionalLibraries.length > 0) {
        await libraries.install(additionalLibraries);
    }
}

export async function updateLogin() {
    var username = await question.text("Username:", process.env["USER"]);
    var password = await question.password("Password:", "colonial");

    var home = getUserHome();
    var configPath = path.join(home, ".ux-global.json");

    var config = fs.existsSync(configPath) ? require(configPath) : {};

    config.login = {
        username: username,
        password: password
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

}

export async function checkForUpdates(packageName, localVersion, globalInstall) {
    return new Promise((resolve) => {
        packageJson(packageName, "latest").then(async function(json) {
            var updateAvailable = semver.gt(json.version, localVersion);
            if (updateAvailable) {
                var shouldUpdate = await question.yesNo(`An update is available to ${packageName}. Would you like to install it?`);
                if (shouldUpdate) {
                    await execCmd(`npm install ${packageName} --loglevel=error ${globalInstall ? "-g" : "--save-dev"}`, true);
                }
            }
            resolve();
        });
    });
}

var version;

export function getVersion() {
    if (!version) {
        var pkg = require("../../package.json");
        version = pkg.version;
    }
    return version;
}
