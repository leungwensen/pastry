#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path'),

    pastry = require('../../build/nodejs.js'),
    utils = require('./utils.js'),

    requirejs = require('requirejs'),

    argv = require('optimist')
        .alias('s', 'source')
        .alias('t', 'target')
        .default('s', 'src/all-ui-modules.js')
        .default('t', 'dist/custom')
        .argv;

