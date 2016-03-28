import gulp from "gulp";

import babel from "gulp-babel";

const JS_PATH = ["app/**/*.js"];

function setupWatch() {
    return gulp.watch([JS_PATH], gulp.parallel(build));
}

export function build() {
    return gulp.src(JS_PATH)
        .pipe(babel())
        .pipe(gulp.dest("dist"));
}

export const watch = gulp.parallel(build, setupWatch);
export default gulp.parallel(watch);
