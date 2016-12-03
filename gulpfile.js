const clean = require("gulp-clean");
const gulp = require("gulp");
const istanbul = require("gulp-istanbul");
const istanbulReport = require("gulp-istanbul-report");
const jasmine = require("gulp-jasmine");
const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
const runSequence = require("run-sequence");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");


gulp.task("tslint", function() {
    gulp.src(["src/*.ts", "src/**/*.ts"])
    .pipe(tslint({
        // Specifying config directly here doesn't seem to work,
        // only leaving this empty or specifying a file works
        configuration: "tslint.json",
        formatter: "verbose"
    }))
    .pipe(tslint.report({
        // Remove this to make tests fail on lint errors
        emitError: false
    }));
});

gulp.task("clean", () => {
    return gulp.src([
        "build",
        "coverage-e2e",
        "coverage-unit"
    ])
    .pipe(clean());
});

gulp.task("build", function() {
    return gulp.src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(ts())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build"));
});

gulp.task("coverage-all", function (done) {
    // These run in one at a time
    runSequence("build", "coverage-unit", "coverage-e2e", done);
});

gulp.task("pre-test-unit", function () {
    return gulp.src(["build/*.js", "build/**/*.js", "!build/*.spec.js", "!build/**/*.spec.js"])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task("test-unit", ["pre-test-unit"], function() {
    return gulp.src(["build/**/*.spec.js", "!build/e2e.spec.js"], { base: "." })
    .pipe(jasmine({verbose: true}))
    .pipe(istanbul.writeReports({
        reportOpts: { dir: "coverage-unit" },
        reporters: [ "json" ]
    }))
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 10 } }));
});

gulp.task("coverage-unit", ["test-unit"], function () {
    return gulp.src("coverage-unit/coverage-final.json")
    .pipe(remapIstanbul({basePath: "src"}))
    .pipe(gulp.dest("coverage-unit/remapped"))
    .pipe(istanbulReport({
        reporters: [
            {"name": "text"},
            {"name": "html", "dir": "coverage-unit/remapped/html"}
        ]
    }))
    .on("end", function() {
        console.log("HTML coverage report is at coverage-unit/remapped/html/index.html");
    });
});

gulp.task("pre-test-e2e", function () {
    return gulp.src(["build/*.js", "build/**/*.js", "!build/*.spec.js", "!build/**/*.spec.js"])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task("test-e2e", ["pre-test-e2e"], function() {
    return gulp.src("build/e2e.spec.js", { base: "." })
    .pipe(jasmine({verbose: true}))
    .pipe(istanbul.writeReports({
        reportOpts: { dir: "coverage-e2e" },
        reporters: [ "json" ]
    }))
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 10 } }));
});

gulp.task("coverage-e2e", ["test-e2e"], function () {
    return gulp.src("coverage-e2e/coverage-final.json")
    .pipe(remapIstanbul({basePath: "src"}))
    .pipe(gulp.dest("coverage-e2e/remapped"))
    .pipe(istanbulReport({
        reporters: [
            {"name": "text"},
            {"name": "html", "dir": "coverage-e2e/remapped/html"}
        ]
    }))
    .on("end", function() {
        console.log("HTML coverage report is at coverage-e2e/remapped/html/index.html");
    });
});

gulp.task("watch", ["coverage-all", "tslint"], function() {
    gulp.watch("src/**/*.ts", ["coverage-all", "tslint"]);
});

// These run in parallel
gulp.task("default", ["coverage-all", "tslint"]);
