#!/usr/bin/env node

'use strict';

var assert = require('assert'),
    moment = require('moment'),
    pkg    = 'pastry',
    start  = moment().subtract('months', 6).toDate(),
    end    = new Date(),
    downloadCounts = require('npm-download-counts');

downloadCounts(pkg, start, end, function (err, data) {
        data.forEach(function (d, i) {
            console.log('On %s, %s was downloaded ~%d times', d.day, pkg, d.count);
        });
    }
);
