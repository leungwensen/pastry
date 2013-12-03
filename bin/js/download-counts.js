#!/usr/bin/env node

'use strict';

var PT       = require('pastry'),
    assert   = require('assert'),
    moment   = require('moment'),
    pkg      = 'pastry',
    start    = moment().subtract('months', 6).toDate(),
    end      = new Date(),
    counts   = require('npm-download-counts'),
    result   = {
        'pkg'       : pkg,
        'downloads' : [],
        'total'     : 0
    };

counts(pkg, start, end, function (err, data) {
        PT.each(data, function (d) {
            result.downloads.push(d);
            result.total += d.count;
        });
        process.stdout.write(PT.JSON.stringify(result, undefined, 2));
    });

