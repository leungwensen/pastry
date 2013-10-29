#!/usr/bin/env node

'use strict';

var resultStr,
    concat  = require('commander'),
    PT      = require('pastry'),
    uglify = require('uglify-js'),
    fs      = require('fs'),
    list = function (val) {      // for commander, get an array of strings
        return val.split(',');
    },
    stringify = function (val) { // for commander, get a string
        return val.trim();
    },
    names = [
        'bool'       ,
        'string'     ,
        'date'       ,
        'object'     ,
        'number'     ,
        'function'   ,
        'array'      ,
        'json'       ,
        'enviroment' ,
    ],
    isRoot = function (filename) {
        return (/^[js\/p|p]astry\.js$/).test(filename);
    },
    getFullPath = function (file) {
        var path = /\.js$/.test(file) ? file : file + '.js';
        if (!/^js\//.test(path)) {
            path = /^pastry\./.test(path) ? path : 'pastry.' + path;
            path = 'js/' + path;
        }
        return path;
    },
    getRequireFiles = function (fileJSON) {
        var requireFiles, data;
        try {
            data = fs.readFileSync(fileJSON);
            requireFiles = PT.JSON.parse(data)[0].requires;
        } catch (err) {
            console.log('cannot read document file: ' + fileJSON + err);
            process.exit(1);
        }
        return requireFiles;
    },
    getFromFiles = function (files) {
        var i, fileJSON, requireFile, reg,
            tempfiles    = [],
            requireFiles = ['js/pastry.js'];
        files.each(function (file) {
            if (isRoot(file)) {
                return;
            }
            if (!names.some(function (name) {
                    reg = new RegExp(name);
                    return reg.test(file);
                })){
                console.error('concat failed: cannot validate this file: ' + file);
                process.exit(1);
            }
            file = getFullPath(file);
            fileJSON = './' + file.replace(/^js\//, 'doc/').replace(/\.js$/, '.doc.json');
            getRequireFiles(fileJSON).each( function (requireFile) {
                tempfiles.push(getFullPath(requireFile));
            });
            tempfiles.push(file);
        });
        for (i = 0; i < names.length; i ++) {
            requireFile = getFullPath(names[i]);
            if (tempfiles.hasVal(requireFile)) {
                requireFiles.push(requireFile);
            }
        }
        return requireFiles;
    },
    concatFileContents = function (files) {
        var resultStr = '';
        files.each(function (file) {
            resultStr += fs.readFileSync(file);
        });
        return resultStr;
    };

// parse argv
concat.version('0.0.1')
      .option('-f, --files <items>' , 'files', list)
      .option('-m, --minify'        , 'if minify file')
      .option('-t, --targetFile <s>', 'target file', stringify)
      .parse(process.argv);

if (!PT.isDef(concat.files) || !PT.isArr(concat.files)) {
    console.error('please tell me which cookies you like!');
    process.exit(1);
}

concat.fromFiles = getFromFiles(concat.files);
resultStr = concatFileContents(concat.fromFiles);
if (concat.minify) {
    resultStr = uglify.minify(resultStr, {fromString: true}).code;
}

if (concat.targetFile) {
    fs.writeFile(concat.targetFile, resultStr, function (err) {
        if (err) {
            console.error('writting into ' + concat.targetFile + " failed:\n" + err);
        }
    });
} else {
    process.stdout.write(resultStr);
}

