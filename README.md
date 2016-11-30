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

The benefit of this approach is that you are actually testing the generated
code, and just getting the report based on the original lines.

You can test the example like this:

```
npm install
time npm test
```

You should see something a bit like this but with prettier colours: 

```
> coverage@1.0.0 test ./
> gulp

[16:00:12] Using gulpfile ./gulpfile.js
[16:00:12] Starting 'clean'...
[16:00:12] Starting 'tslint'...
[16:00:12] Finished 'tslint' after 1.91 ms
(quotemark) one/one.spec.ts[1, 21]: ' should be "

[16:00:12] Starting 'pre-test'...
[16:00:12] Finished 'pre-test' after 49 ms
[16:00:12] Finished 'clean' after 62 ms
[16:00:12] Starting 'build'...
[16:00:13] Finished 'build' after 1.14 s
[16:00:13] Starting 'test'...
Running 1 spec.
one
    passes: passed

1 spec, 0 failures
Finished in 0 seconds
[16:00:13] Finished 'test' after 45 ms
[16:00:13] Starting 'coverage'...
--------------|----------|----------|----------|----------|----------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
 one/         |     87.5 |       50 |      100 |     87.5 |                |
  one.spec.ts |      100 |      100 |      100 |      100 |                |
  one.ts      |    66.67 |       50 |      100 |    66.67 |              4 |
--------------|----------|----------|----------|----------|----------------|
All files     |     87.5 |       50 |      100 |     87.5 |                |
--------------|----------|----------|----------|----------|----------------|

[16:00:13] Finished 'coverage' after 20 ms
[16:00:13] Starting 'default'...
[16:00:13] Finished 'default' after 3.66 μs

real	0m2.684s
user	0m2.686s
sys	0m0.264s
```

Notice the lint warning:

```
(quotemark) one/one.spec.ts[1, 21]: ' should be "
```

and the uncovered line:

```
...
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
...
  one.ts      |    66.67 |       50 |      100 |    66.67 |              4 |
...
```

As an excercise you could try fixing these and running again.

To watch for changes you can run:

```
npm run watch
```

This will re-run the coverage check on every change.
