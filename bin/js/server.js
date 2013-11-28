#!/usr/bin/env node
'use strict';

var opt     = require('commander'),
    express = require('express'),
    PT      = require('pastry'),
    app     = express(),
    num     = function (val) { return PT.toInt(val);             },
    arr     = function (val) { return PT.trim(val).split(','); },
    addPrefix = function (arr) {
        return PT.map(arr, function (elem) {
            return elem.match(/^\//) ? elem : '/' + elem;
        });
    };

opt.version('0.0.1')
   .option('-p, --port <s>'        , 'port'        , num)
   .option('-d, --directories <s>' , 'directories' , arr)
   .parse(process.argv);
opt.port = opt.port || 3000;
opt.directories = opt.directories || ['/dist/js', '/example', '/dist/css'];
opt.directories = addPrefix(opt.directories);

app.use(express.favicon())
   .use(express.logger() );

PT.each(opt.directories, function (dir) {
    app.use(dir, express.static('.' + dir));
});

app.listen(opt.port);

console.log('listening to port: ' + opt.port);
console.log('directories serving: ');
PT.each(opt.directories, function (dir) {
    console.log('    ' + dir);
});
