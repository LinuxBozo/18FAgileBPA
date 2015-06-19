#!/bin/sh
./node_modules/.bin/grunt test
./node_modules/.bin/lcov-result-merger 'coverage/**/lcov.info' 'coverage/lcov-merged.info'
CODECLIMATE_REPO_TOKEN=956a4d32bdd2c3a5c8b09f25797a4ac0032527999f1db84b62dd9e52e20ad054 ./node_modules/.bin/codeclimate < coverage/lcov-merged.info