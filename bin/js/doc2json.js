#!/usr/bin/env node

'use strict';

var genJSON  = require('commander'),
    pastry   = require('../../dist/node-debug.js'),
    fs       = require('fs'),

    list = function (val) {      // for commander, get an array of strings
        var list = val.split(',');
        pastry.each(list, function (val, i) {
            list[i] = pastry.trim(val);
        });
        return list;
    },
    stringify = function (val) { // for commander, get a string
        return pastry.trim(val);
    },
    str2arr = function (str) {   // '[xxx, xxx]' => ['xxx', 'xxx']
        return pastry.map(str.replace(/\[|\]/gm, '').split(','), function (val) {
            return pastry.trim(val);
        });
    },

    /*
     * @param : {type} name , description
     */
    embellishParam = function (val) {
        var parts,
            type = val.match(/\{\w+\s*\}/)[0];
        val = val.replace(type, '');
        parts = val.split(',');
        return {
            'type'        : pastry.trim(type.replace(/\{|\}/gm, '')),
            'name'        : pastry.trim(parts[0]),
            'description' : pastry.trim(parts.slice(1).join(''))
        };
    },
    /*
     * @return : {type} description
     */
    embellishReturn = function (val) {
        var type = val.match(/\{\w+\s*\}/)[0],
            description = val.replace(type, '');
        return {
            'type'        : pastry.trim(type.replace(/\{|\}/gm, '')),
            'description' : pastry.trim(description)
        };
    },
    /*
     * @any : {this is what will be dealed with}
     */
    embellishValue = function (val) {
        val = pastry.S(val);
        try {
            var jsonObj = pastry.JSON.parse(val);
            if (pastry.isObj(jsonObj) || pastry.isArr(jsonObj) || pastry.isFunc(jsonObj)) {
                return jsonObj;
            }
        } catch (e) {
        }
        var urlPattern = /(http|ftp|https):\/\/[\w\-]+(\.[\w\-]+)+([\w.,@?\^=%&amp;:\/~+#\-]*[\w@?\^=%&amp;\/~+#\-])?/;
        if (val.match(urlPattern)) {
            return {
                'type' : 'link',
                'url'  : val
            };
        }
        return val;
    },
    /*
     * @description: every line of comment like this one would be parsed as an object and added into the result list
     */
    addComment = function (ret, key, value) {
        if (/^param/.test(key)) {
            ret[key] = ret[key] || [];
            ret[key].push(embellishParam(value));
        } else if (/^return/.test(key)) {
            ret[key] = ret[key] || [];
            ret[key].push(embellishReturn(value));
        } else if (/^require/.test(key)) {
            if (!pastry.has(ret, key)) {
                ret[key] = [];
            }
            ret[key] = ret[key].concat(str2arr(value));
        } else {
            if (pastry.has(ret, key)) {
                var oldValue = ret[key],
                    newValue = embellishValue(value);
                if (pastry.isArr(oldValue) && !pastry.isArr(newValue)) {
                    ret[key].push(newValue);
                } else {
                    ret[key] = [];
                    ret[key].push(oldValue, newValue);
                }
            } else {
                ret[key] = embellishValue(value);
            }
        }
    },
    /*
     * @name        : doc2JSON
     * @description : turn comments like this into a JSON-string
     */
    doc2JSON = function (doc) {
        if (doc.match(/\/\/(.*)$/)) {
            return doc.replace(/\/\/\s+/, '');
        }
        var stringList,
            ret = {};
        doc = doc.replace(/(\/\*\*)|(\*\/)/gm, '' )  // remove '/**' '*/'
                 .replace(/(\r\n|\n|\r)/gm   , '' )  // reomve '\r\n'
                 .replace(/\*\s+/gm          , '' )  // remove '*'
                 .replace(/\s+/gm            , ' '); // '\s+' => '\s'
        stringList = doc.split('@'); // params[i]: xxxx : xxxx xxx, xxx.
        pastry.each(stringList, function (str) {
            str = pastry.trim(str);
            if (str === '' || str === null) {
                return;
            }
            var key, value;
            try {
                key = str.match(/^\w+\s*:\s*/)[0];
                value = str.replace(key, '');
                key = pastry.trim(key).replace(/\s*\:\s*/ , '');
                addComment(ret, key, value);
            } catch (e) {
                console.log(e, str);
            }
        });
        return ret;
    },
    /*
     * @description : generate JSON-format string from a single file
     */
    genJSONFromFile = function (filename) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                console.log('reading from ' + filename + " failed:\n" + err );
                return;
            }
            var targetFilename = genJSON.directory + filename.replace(/^.*[\\\/]|\.js$/gm, '') + '.doc.json',
                fileContent = pastry.S(data),
                docs = fileContent.match(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm),
                targetContent = [];
            pastry.each(docs, function (doc) {
                targetContent.push(doc2JSON(doc));
            });
            fs.writeFile(targetFilename, pastry.JSON.stringify(targetContent, undefined, 2), function (err) {
                if (err) {
                    console.log('writting into ' + targetFilename + " failed:\n" + err);
                }
            });
        });
    };

// parse argv
genJSON.version('0.0.1')
       .option('-f, --files <items>', 'source files', list)
       .option('-d, --directory <s>', 'output directory', stringify)
       .parse(process.argv);

// prepare source files and target directory
genJSON.files      = genJSON.files     || ['js/'];
genJSON.directory  = genJSON.directory || 'doc';
genJSON.directory += /\/$/.test(genJSON.directory) ? '' : '/';

// deal with each source file
pastry.each(genJSON.files, function (path) {
    if (/\.js$/.test(path)) {
        // when path is a .js source file already
        genJSONFromFile(path);
    } else {
        // when path is a directory
        fs.readdir(path, function (err, files) {
            if (err) {
                console.log('reading directory ' + path + " failed:\n" + err);
            }
            pastry.each(files, function (file) {
                if (/\.js$/.test(file)) {
                    genJSONFromFile(path + file);
                }
            });
        });
    }
});

