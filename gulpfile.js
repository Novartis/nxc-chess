/*
    eslint
    no-var: 0,
    prefer-arrow-callback: 0,
    prefer-template: 0,
    no-console: 0
*/

// browserify transform for transpiling es6/jsx (used during bundling)
var babelify = require('babelify');

var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var watchify = require('watchify');

// babel config from `projectRoot/.babelrc`
var babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf-8'));

var browserifyConfig = {
    entries: ['./src/js/index.js'],
    debug: true, // enable sourcemaps by default
    transform: [[babelify, babelrc]],
};
var watchifyConfig = Object.assign({}, browserifyConfig, {
    cache: {},
    packageCache: {},
    plugin: [watchify],
});

/* bundlers:
    `b` is vanilla browserify
    `w` watches + caches packages */
var b = browserify(browserifyConfig);
var w = browserify(watchifyConfig)
        .on('update', function (changes) {
            console.log('File(s) changed...', changes);
            runSequence(['bundle:watch']);
        });

var doBundle = function (done) {
    return (this.watchify ? w : b)
        .bundle()
        .on('error', function (err) {
            gutil.log('Browserify error\n' + err.toString() + '\n' + err.codeFrame);
            done();
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js'));
};

/**
 * GENERAL BUILD TASKS
 */

// bundle task for single builds, no watchify
gulp.task('bundle', doBundle.bind({ watchify: false }));

gulp.task('bundle:watch', doBundle.bind({ watchify: true }));

gulp.task('watch', function () {
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./dist/**/*', browserSync.reload);
});

gulp.task('html', function () {
    gulp.src('./src/*.html').pipe(gulp.dest('./dist/'));
});

gulp.task('serve', function () {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: '.',
        },
        ghostMode: false,
    });
});

gulp.task('lint', function () {
    return gulp.src(['./src/js/**/*.js', '!./node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * DEFAULT TASKS
 */

gulp.task('default', function (cb) {
    runSequence('watch', 'bundle:watch', 'serve', cb);
});
