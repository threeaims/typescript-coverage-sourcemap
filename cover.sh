#!/bin/sh

cd build
../node_modules/.bin/istanbul cover ../node_modules/.bin/jasmine init
../node_modules/.bin/istanbul cover ../node_modules/.bin/jasmine one/one.spec.js 
mkdir coverage/remapped
../node_modules/.bin/remap-istanbul -b ../src -i coverage/coverage.json -o coverage/remapped/coverage.json
../node_modules/.bin/istanbul report --root coverage/remapped text
../node_modules/.bin/istanbul report --root coverage/remapped html
