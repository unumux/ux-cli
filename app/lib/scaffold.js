var fs = require('fs-extra'),
    path = require('path');

export function styles(dest) {
    fs.copySync(path.join(__dirname, '../../template/styles'), path.join(dest, 'styles'));
    return ["styles"];
}

export function scripts(dest) {
    fs.copySync(path.join(__dirname, '../../template/scripts'), path.join(dest, 'scripts'));
    return ["scripts"];
}

export function markup(dest) {
    fs.copySync(path.join(__dirname, '../../template/index.html'), path.join(dest, 'index.html'));
    return ["index.html"];
}

export function fullSite(dest) {
    let scssPaths = styles(dest);
    let jsPaths = scripts(dest);
    let otherPaths = markup(dest);

    return {
        scss: scssPaths,
        js: jsPaths,
        other: otherPaths
    };
}
