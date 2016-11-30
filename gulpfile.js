const clean = require("gulp-clean");
const gulp = require("gulp");
const istanbul = require("gulp-istanbul");
const istanbulReport = require("gulp-istanbul-report");
const jasmine = require("gulp-jasmine");
const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");

gulp.task("tslint", function() {
    gulp.src("./src/**/*.ts")
    .pipe(tslint({
        formatter: "verbose",
        extends: "tslint:latest",
        rules: {
            "no-console": [false]
        }
    }))
    .pipe(tslint.report({
        // Remove this if you want to fail the build on lint error
        emitError: false
    }))
});

gulp.task("clean", () => {
    return gulp.src(["./coverage", "./build"])
    .pipe(clean());
});

gulp.task("build", ["clean"], function() {
    return gulp.src("./src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(ts())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build"));
});

gulp.task("pre-test", ["build"], function () {
  return gulp.src(["build/**/*.js"])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task("test", ["pre-test"], function() {
     return gulp.src("./build/**/*.spec.js", { base: "." })
     .pipe(jasmine({verbose: true}))
     .pipe(istanbul.writeReports({
         reporters: [ "json" ] // Create the non-sourcemapped coverage-final.json file to use in coverage
     }))
     .pipe(istanbul.enforceThresholds({ thresholds: { global: 10 } }));
});

gulp.task("coverage", ["test"], function () {
    return gulp.src("./coverage/coverage-final.json")
        .pipe(remapIstanbul())
        .pipe(gulp.dest("./coverage/remapped"))
        .pipe(istanbulReport());
});

gulp.task("watch", ["coverage"], function() {
    gulp.watch("src/**/*.ts", ["coverage", "tslint"]);
});

gulp.task("default", ["coverage", "tslint"]);
