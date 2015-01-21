#!/usr/bin/env node

'use strict';

var fs     = require('fs'),
    path   = require('path'),

    pastry = require('../../dist/node-debug.js'),
    utils  = require('./utils.js'),
    prefix = 'src/ui/',

    RE = {
        acceptSuffix: /\.(html|htm|ztmpl)$/,
    },

    argv = require('optimist')
        .alias('t', 'template')
        .alias('a', 'all')
        .default('a' , true)
        .argv;

console.log(pastry);

function compileTemplateByName (template) {
    try {
        utils.walkFiles(prefix + template + '/template', function (file) {
            if (!RE.acceptSuffix.test(file)) { // 只接受 template 文件
                return;
            }
            var content = fs.readFileSync(file).toString(),
                outputFilename = file
                    .replace(RE.acceptSuffix, function (/* suffix */) {
                        return '.js';
                    }),
                outputTemplateId = outputFilename
                    .replace(/^src\//, '')
                    .replace(/\.js$/, ''),
                moduleStr = '/* jshint ignore:start */\n' +
                    'define("%s", [' +
                        '"pastry",' +
                        '"html/utils"' +
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
                outputFilename,
                outputTemplateId,
                content,
                pastry.template.compile(content),
                resultStr
            );
            fs.writeFileSync(outputFilename, pastry.sprintf(
                moduleStr,
                outputTemplateId, resultStr
            ));
        });
    } catch(e) {
        console.log(e);
    }
}
function getDirectories(srcpath) {
    return pastry.filter(fs.readdirSync(srcpath), function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

if (argv.template) {
    argv.all = false;
    compileTemplateByName(argv.template);
}
if (argv.all) {
    var moduleNames = getDirectories(prefix);
console.log(moduleNames);
    pastry.each(moduleNames, function (name) {
        compileTemplateByName(name);
    });
}

