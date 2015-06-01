var gulp = require('gulp');
var babel = require('gulp-babel');
var jsdoc = require('gulp-jsdoc');

gulp.task('babel', function() {
    return gulp.src('src/**/*.js')
               .pipe(babel({stage: 1}))
               .pipe(gulp.dest('dist'));
});

gulp.task('jsdoc', function() {
    return gulp.src('dist/**/*.js')
               .pipe(jsdoc('./docs', {}, {plugins: ['plugins/markdown']}))
});

gulp.task('default', ['babel'], function() {
    return gulp.watch('src/**/*.js', ['babel']);
});
