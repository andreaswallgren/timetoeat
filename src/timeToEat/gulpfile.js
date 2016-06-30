/// <binding BeforeBuild='build' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    _ = require('lodash'),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),

    gulpTypings = require("gulp-typings"),
    ts = require('gulp-typescript'),
    merge = require('merge2');

var webroot = "./wwwroot/";

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    scss: './styles/',
    scssOutput: webroot + "css/",

    minVendor: "vendor.js",
    minVendorPath: webroot + "js/",

    tsSource: './scripts/**/*.ts',
    appRoot: webroot + "js/",
    appPath: webroot + "js/app",
    viewSource: './scripts/**/*.html',
    plugins: webroot + 'js/'
};

var fonts = [
    './node_modules/bootstrap/dist/fonts/*.*'
];

/****** NPM Dependencies *******/
var angularJs = [
    './node_modules/@angular/core/bundles/core.umd.min.js',
    './node_modules/@angular/common/bundles/common.umd.min.js',
    './node_modules/@angular/compiler/bundles/compiler.umd.min.js',
    './node_modules/@angular/http/bundles/http.umd.min.js',
    './node_modules/@angular/router/bundles/router.umd.min.js',
    './node_modules/@angular/platform-browser/bundles/platform-browser.umd.min.js',
    './node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js'
];

var js = [
    './node_modules/rxjs/bundles/Rx.min.js',
    './node_modules/rxjs/bundles/Rx.umd.min.js',
    './node_modules/reflect-metadata/reflect.js',
    './node_modules/zone.js/dist/zone.min.js',
    './node_modules/core-js/client/shim.min.js',
    './node_modules/systemjs/dist/system.src.js',
    './node_modules/systemjs/dist/system.js']

var bundle = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/tether/dist/js/tether.js',
    './node_modules/bootstrap/dist/js/bootstrap.js'
    /* Insert other third party libs here */
];

// Copies NPM dependencies to wwwroot
gulp.task('copy-dependencies', function () {

    _.forEach(js, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest(paths.appRoot));
        gulp.src(file + '.map')
            .pipe(gulp.dest(paths.appRoot));
    });
    _.forEach(angularJs, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest(paths.appRoot + '@angular'))
        gulp.src(file + '.map')
            .pipe(gulp.dest(paths.appRoot + '@angular'));
    });

    return gulp.src(bundle)
        .pipe(sourcemaps.init())
        .pipe(concat(paths.minVendor))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.minVendorPath));
});

// Downloads typings
gulp.task('download-types', function () {
    return gulp.src("./typings.json")
        .pipe(gulpTypings()); //will install all typingsfiles in pipeline. 
});

// Copy angular html views to wwwroot
gulp.task('update-angular-views', function () {
    gulp.src(paths.viewSource)
        .pipe(gulp.dest(paths.appPath))
});

// Compiles all typescript into .js
gulp.task('compile-scripts', ["download-types", "update-angular-views"], function () {
    var tsFiles = gulp.src(paths.tsSource);

    return merge(tsFiles, gulp.src('typings/browser.d.ts'))
        .pipe(ts({
            target: "es5",
            module: "system",
            moduleResolution: "node",
            sourceMap: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: false,
            outFile: "main.js",
            //outDir: paths.appPath
            //out: "app.js"
        }))
        .pipe(gulp.dest(paths.appPath))
});



// Compiles SASS files into css/
gulp.task('compile-sass', function () {
    gulp.src([paths.scss + 'app.scss', paths.scss + 'vendor.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.scssOutput));

});

gulp.task("clean:js", function (cb) {
    rimraf(paths.appRoot, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.scssOutput, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", ['compile-scripts', 'copy-dependencies'], function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("."));
});

gulp.task("min:css", ["compile-sass"], function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.scssOutput));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task('build', ['compile-scripts', 'copy-dependencies', 'min:css'])