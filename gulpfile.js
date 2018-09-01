const gulp = require('gulp');
const jsMinify = require('gulp-minify');
const cssMinify = require('gulp-cssmin');
const rename = require("gulp-rename");

const propsJS = {
    targetFiles: "views/assets/js/*.js",
    destFiles: "views/assets/js/*.min.js",
    destFolder: "views/assets/js/"
};
const propsCSS = {
    targetFiles: "views/assets/css/*.css",
    destFolder: "views/assets/css/"
};

gulp.task('js-minify', () => {
    gulp.src([propsJS.targetFiles, propsJS.destFiles])
    .pipe(jsMinify())
    .pipe(gulp.dest(propsJS.destFolder))
});

gulp.task('css-minify', () => {
    gulp.src(propsCSS.targetFiles)
    .pipe(cssMinify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(propsCSS.destFolder))
});
