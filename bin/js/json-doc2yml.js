#!/usr/bin/env node

'use strict';

var child, targetFile, command,
    exec = require('child_process').exec,
    fs   = require('fs'),
    PT   = require('pastry'),
    json2yml = function (file) {
        if (!/\.json$/.test(file)) {
            console.error('please check filetype!' + file);
            return;
        }
        targetFile = file.replace(/\.json$/, '.yml');
        command    = 'cat ' + file + ' | ./bin/js/json2yml.js > ' + targetFile;
        child = exec(command, function (err, stdout, stderr) {
            console.log(command);
            if (err !== null) {
                console.error('exec error: ' + err);
            }
        });
    };

if (process.argv.length > 2) {
    PT.each(process.argv.slice(2), function (file) {
        json2yml(file);
    });
} else {
    fs.readdir('doc/', function (err, files) {
        if (err) {
            console.error(err);
        }
        PT.each(files, function (file) {
            json2yml('doc/' + file);
        });
    });
}

