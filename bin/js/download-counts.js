#!/usr/bin/env node

'use strict';

var PT       = require('pastry'),
    assert   = require('assert'),
    moment   = require('moment'),
    pkg      = 'pastry',
    start    = moment().subtract('months', 6).toDate(),
    end      = new Date(),
    counts   = require('npm-download-counts');

counts(pkg, start, end, function (err, data) {
        var result = {
            'pkg'       : pkg,
            'downloads' : []
        };
        PT.each(data, function (d) {
            result.downloads.push(d);
        });
        process.stdout.write(PT.JSON.stringify(result, undefined, 2));
    });

