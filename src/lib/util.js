require('babel-core/register');

var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    _ = require('lodash');

import * as UXConfig from './ux-config.js';
import * as question from './question.js';


export function execCmd(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, function() {
            resolve();
        });
    });
}

export function createPackageJson() {
    let packageJson = {
        private: true
    }

    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 4));
}

export function bowerInstall() {
    console.log('Installing Bower packages...');
    return execCmd('bower install');
}

export function npmInstall() {
    console.log('Installing NPM packages...');
    return execCmd('npm install');
}

export async function installUIFramework() {
    let shouldInstall = await question.yesNo('UI Framework not found. Would you like to install it?');

    if(shouldInstall) {
        console.log('Installing UI Framework...')
        await execCmd('npm install @unumux/ui-framework --save-dev');
    }
}

export async function createUXConfig() {
    let shouldCreate = await question.yesNo('ux.json not found. Would you like to create one?');

    if(shouldCreate) {
        let isSitecoreSite = UXConfig.detectIfSitecoreSite(process.cwd());

        if(isSitecoreSite) {
            let paths = UXConfig.findSitecorePaths(process.cwd());
            let config = new UXConfig.Config(paths, false, false);
            config.write('./ux.json');
        } else {
            let paths = await UXConfig.findPaths(process.cwd());
            var scssPath = await question.list('Where are your SCSS files stored?', paths.scss);
            var jsPath = await question.list('Where are your JS files stored?', paths.js);
            var watchPaths = await question.checkbox('What other files/folders should trigger a refresh in the browser when files are changed?', paths.other);
            var compileJs = await question.yesNo('Should Javascript files be automatically concatenated/minified?');
            var staticSite = await question.yesNo('Is this a static site?');
            let config = new UXConfig.Config({ scss: scssPath, js: jsPath, watch: watchPaths }, staticSite, compileJs);
            config.write('./ux.json');
        }
    }
}

function findGulpPath() {
    let gulpCmd = (process.platform === "win32" ? "gulp.cmd" : "gulp");

    let searchPaths = [
        ['node_modules', '@unumux', 'ui-framework', 'node_modules', '.bin', gulpCmd],
        ['node_modules', '.bin', gulpCmd]
    ];

    searchPaths.forEach(function(searchPathTmp) {
        let searchPath = searchPathTmp.join(path.sep);
        if(fs.existsSync(searchPath)) {
            gulpCmd = searchPath;
        }
    });

    return gulpCmd;
}

export async function runGulp() {
    let gulpCmd = findGulpPath();

    var gulp = spawn(gulpCmd, ['--gulpfile=node_modules/@unumux/ui-framework/index.js', '--cwd=.'], {
        stdio: [0, process.stdout, process.stderr]
    });

    gulp.on('close', function(code) {
        console.log(code)
        if (code !== 0) {

        }

    });
}

export function findFiles(globPath, ignorePaths) {
    return new Promise((resolve,reject) => {
        // find all folders in directory, then remove ignoredPaths.
        // This is faster than using **/* with ignore
        let allFilesFolders = fs.readdirSync(globPath);

        // filter to include only folders that are not ignored
        let folders = allFilesFolders.filter(function(file) {
            return fs.statSync(file).isDirectory() && ignorePaths.indexOf(file) < 0;
        });

        let fileSearchExtensions = ['scss', 'sass', 'cshtml', 'html', 'css', 'aspx', 'js'];

        let folderGlob = `{${folders.join(',')}}/**/*.{${fileSearchExtensions.join(',')}}`;

        var files = glob.sync(folderGlob, { nocase: true });

        // this will let us watch files in root (only non-sass/js files for now)
        let rootFileGlob = "*.{html,cshtml,aspx,css}";

        files = files.concat(glob.sync(rootFileGlob, { nocase: true }))

        var result = _.groupBy(files, function(file) {
            return path.extname(file);
        });

        var scssPaths = _.uniq(_.union(result['.scss'], result['.sass']).map(function(file) {
            return file.split(path.sep)[0];
        }));

        var jsPaths = _.uniq(result['.js'].map(function(file) {
            return file.split(path.sep)[0];
        }));

        var otherPaths = _.uniq(_.flatten(_.values(_.omit(result, ['.js', '.scss', '.sass']))).map(function(file) {
            return file.split(path.sep)[0];
        }));

        otherPaths = otherPaths.filter(function(path) {
            return scssPaths.indexOf(path) < 0;
        });

        resolve({scss: scssPaths, js: jsPaths, other: otherPaths});
    })
}
