const { src, dest, series } = require('gulp');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const source = 'js/morphhtmlnumber.js';

function lint() {
    return src(source)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
}

function minify() {
    return src(source)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('js'));
}

exports.default = series(lint, minify);
