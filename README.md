# Getting TypeScript Coverage

This project demonstrates how to set up a TypeScript 2.0 project with the following features:

* Gulp for the build
* Jasmine test runner testing the produced JavaScript
* Source map support
* Istanbul remap on the genreated coverage file
* Coverage report that refers back to lines in the original `.ts` files
* Enforce a minimum coverage level (the rather low 10% in this case)
* Don't need a tsconfig.json (configuration is in gulp)
* Separate source and build directories
* Watch for changes
* Linting that doesn't fail the build
* HTML report in the `coverage/remapped/html` directory
* Separate test and coverage runs from the same build (so you can have separate unit and end to end tests)

The benefit of this approach is that you are actually testing the generated
code, and just getting the report based on the original lines.

You can test the example like this:

```
npm install
time npm test
```

You should see something a bit like this but with prettier colours:

```
> typescript-coverage-sourcemap@0.1.0 test /Users/jgardner/repo/coverage
> gulp clean && gulp

[12:02:16] Using gulpfile ~/repo/coverage/gulpfile.js
[12:02:16] Starting 'clean'...
[12:02:16] Finished 'clean' after 30 ms
[12:02:17] Using gulpfile ~/repo/coverage/gulpfile.js
[12:02:17] Starting 'coverage-all'...
[12:02:17] Starting 'build'...
[12:02:17] Starting 'tslint'...
[12:02:17] Finished 'tslint' after 2.27 ms
(quotemark) e2e.spec.ts[5, 21]: ' should be "

(quotemark) one/one.spec.ts[1, 21]: ' should be "

[12:02:18] Finished 'build' after 1.26 s
[12:02:18] Starting 'pre-test-unit'...
[12:02:18] Finished 'pre-test-unit' after 23 ms
[12:02:18] Starting 'test-unit'...
Running 1 spec.
one
    passes: passed

1 spec, 0 failures
Finished in 0 seconds
[12:02:18] Finished 'test-unit' after 40 ms
[12:02:18] Starting 'coverage-unit'...
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
 src/     |        0 |        0 |      100 |        0 |                |
  e2e.ts  |        0 |        0 |      100 |        0 |          1,3,4 |
 src/one/ |    66.67 |       50 |      100 |    66.67 |                |
  one.ts  |    66.67 |       50 |      100 |    66.67 |              4 |
----------|----------|----------|----------|----------|----------------|
All files |    33.33 |       25 |      100 |    33.33 |                |
----------|----------|----------|----------|----------|----------------|

HTML coverage report is at coverage-unit/remapped/html/index.html
[12:02:18] Finished 'coverage-unit' after 56 ms
[12:02:18] Starting 'pre-test-e2e'...
[12:02:18] Finished 'pre-test-e2e' after 5.1 ms
[12:02:18] Starting 'test-e2e'...
Running 1 spec.
e2e
    passes: passed

1 spec, 0 failures
Finished in 0 seconds
[12:02:18] Finished 'test-e2e' after 5.78 ms
[12:02:18] Starting 'coverage-e2e'...
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
 src/     |    66.67 |       50 |      100 |    66.67 |                |
  e2e.ts  |    66.67 |       50 |      100 |    66.67 |              4 |
 src/one/ |        0 |        0 |      100 |        0 |                |
  one.ts  |        0 |        0 |      100 |        0 |          1,3,4 |
----------|----------|----------|----------|----------|----------------|
All files |    33.33 |       25 |      100 |    33.33 |                |
----------|----------|----------|----------|----------|----------------|

HTML coverage report is at coverage-e2e/remapped/html/index.html
[12:02:18] Finished 'coverage-e2e' after 9.66 ms
[12:02:18] Finished 'coverage-all' after 1.4 s
[12:02:18] Starting 'default'...
[12:02:18] Finished 'default' after 2.85 μs
```

Notice the lint warnings:

```
(quotemark) one/one.spec.ts[1, 21]: ' should be "
```

and the uncovered lines.

As an excercise you could try fixing these and running again.

To watch for changes you can run:

```
npm run watch
```

This will re-run the coverage check on every change (it uses a gulp watch which
TypeScript supports so not everything needs re-scanning).


Caution:

If you have any `.ts` files that compile to empty `.js` files (for example if
they contain only interfaces), then a sourcemap won't be generated for them,
and remap-istanbul will complain like this when it tries to map them back:

```
path.js:7
    throw new TypeError('Path must be a string. Received ' + inspect(path));
    ^

TypeError: Path must be a string. Received undefined
    at assertPath (path.js:7:11)
    at Object.extname (path.js:1431:5)
    at /Users/jgardner/repo/api/node_modules/remap-istanbul/lib/remap.js:289:14
    at Array.forEach (native)
    at /Users/jgardner/repo/api/node_modules/remap-istanbul/lib/remap.js:215:22
    at Array.forEach (native)
    at remap (/Users/jgardner/repo/api/node_modules/remap-istanbul/lib/remap.js:213:12)
    at DestroyableTransform._transform (/Users/jgardner/repo/api/node_modules/remap-istanbul/lib/gulpRemapIstanbul.js:41:20)
    at DestroyableTransform.Transform._read (/Users/jgardner/repo/api/node_modules/remap-istanbul/node_modules/readable-stream/lib/_stream_transform.js:159:10)
    at DestroyableTransform.Transform._write (/Users/jgardner/repo/api/node_modules/remap-istanbul/node_modules/readable-stream/lib/_stream_transform.js:147:83)
```

It would be nice if remap-istanbul gave a nicer error, but a good solution is
to rename the offending file from `.ts` to `.d.ts` so that it is correctly
treated a TypeScript definition file (which it is) rather than as code to
convert to JavaScript.

A slightly more hacky workaround is to add something like this to every file
that compiles to an empty `.js` file so that it isn't empty any more:

```
export const one = 1;
```

Then make sure you import and use the constant somewhere in the rest of the
project.

Another problem that can occur is if you copy `.js` files into the `build`
directory for some other purpose (such as to serve to the browser as part of a
front end). If you do this you'll need to exclude these paths, otherwise you'll
see the coverage check fail even though the tests have passed:

```
11 specs, 0 failures
Finished in 0.7 seconds
[18:39:45] 'test' errored after 1.56 s
[18:39:45] Error in plugin 'gulp-istanbul'
Message:
    Coverage failed
```

Here's an example that excludes all front-end files in the `build/static`
directory from the coverage check:

```
gulp.task("pre-test", ["build"], function () {
    return gulp.src(["build/**/*.js", "!build/*.spec.js", "!build/**/*.spec.js", "!build/static/*.js", "!build/static/**/*.js"])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});
```
