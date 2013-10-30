#!/usr/bin/env node

'use strict';

var yaml    = require('js-yaml'),
    PT      = require('pastry');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
    process.stdout.write(
            yaml.dump(PT.JSON.parse(chunk), {
                styles    : {
                  '!!int'  : 'hexadecimal',
                  '!!null' : 'camelcase'
                }
            })
        );
});


