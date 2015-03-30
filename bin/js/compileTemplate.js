#!/usr/bin/env node

'use strict';

var fs     = require('fs'),
    path   = require('path'),

    pastry = require('../../build/nodejs.js'),
    utils  = require('./utils.js'),
    prefix = 'src/pastry/template/',

    RE_acceptSuffix = /\.(html|htm|ptmpl)$/;

function getFilename (path) {
    var result = path.replace(RE_acceptSuffix, '');
    return result.match(/(\w*)$/)[0];
}

function compileTemplates () {
    try {
        utils.walkFiles(prefix, function (file) {
            if (!RE_acceptSuffix.test(file)) { // 只接受 template 文件
                return;
            }
            var content = fs.readFileSync(file).toString(),

                outputFilename = file
                    .replace(RE_acceptSuffix, function (/* suffix */) {
                        return '.js';
                    }),

                outputFileId = prefix.replace('src/', '') + getFilename(file),

                moduleStr = '/* jshint ignore:start */\n' +
                    'define("%s", [' +
                        '"pastry/pastry",' +
                        '"pastry/html/escape"' +
                    '], function (' +
                        'helper' +
                    ') {' +
                        'return %s' +
                    '});' +
                    '\n/* jshint ignore:end */',
                resultStr = pastry.template.compile(content).toString()
                    .replace(/^\s*function\s+anonymous\(\s*obj\,\s*helper\s*\,\s*ne\s*\)\s*\{/, 'function(obj, ne){')
                    .replace(/\\n\s*/g, '');

            console.log(
                file,
                outputFilename// ,
                // outputFileId,
                // content,
                // pastry.template.compile(content),
                // resultStr
            );

            fs.writeFileSync(outputFilename, pastry.sprintf(moduleStr, outputFileId, resultStr));
        });
    } catch(e) {
        console.log(e);
    }
}

compileTemplates();

