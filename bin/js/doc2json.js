#!/usr/bin/env node

'use strict';

var genJSON  = require('commander'),
    PT       = require('pastry'),
    fs       = require('fs'),

    list = function (val) {      // for commander, get an array of strings
        var list = val.split(',');
        list.each(function (val, i) {
            list[i] = val.trim();
        });
        return list;
    },
    stringify = function (val) { // for commander, get a string
        return val.trim();
    },
    str2arr = function (str) {   // '[xxx, xxx]' => ['xxx', 'xxx']
        return str.replace(/\[|\]/gm, '').split(',').map(function (val) {
            return val.trim();
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
            'type'        : type.replace(/\{|\}/gm, '').trim(),
            'name'        : parts[0].trim(),
            'description' : parts.slice(1).join('').trim()
        };
    },
    /*
     * @return : {type} description
     */
    embellishReturn = function (val) {
        var type = val.match(/\{\w+\s*\}/)[0],
            description = val.replace(type, '');
        return {
            'type'        : type.replace(/\{|\}/gm, '').trim(),
            'description' : description.trim()
        };
    },
    /*
     * @any : {this is what will be dealed with}
     */
    embellishValue = function (val) {
        val = PT.S(val);
        try {
            var jsonObj = PT.JSON.parse(val);
            if (PT.isObj(jsonObj) || PT.isArr(jsonObj) || PT.isFunc(jsonObj)) {
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
        switch (true) {
        case /^param/.test(key):
            ret[key] = ret[key] || [];
            ret[key].push(embellishParam(value));
            break;
        case /^return/.test(key):
            ret[key] = ret[key] || [];
            ret[key].push(embellishReturn(value));
            break;
        case /^require/.test(key):
            if (!ret.has(key)) {
                ret[key] = [];
            }
            ret[key] = ret[key].concat(str2arr(value));
            break;
        default:
            if (ret.has(key)) {
                var oldValue = ret[key],
                    newValue = embellishValue(value);
                if (PT.isArr(oldValue) && !PT.isArr(newValue)) {
                    ret[key].push(newValue);
                } else {
                    ret[key] = [];
                    ret[key].push(oldValue, newValue);
                }
            } else {
                ret[key] = embellishValue(value);
            }
            break;
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
        stringList.each(function (str) {
            str = str.trim();
            if (str === '' || str === null) {
                return;
            }
            var key, value;
            try {
                key = str.match(/^\w+\s*:\s*/)[0];
                value = str.replace(key, '');
                key = key.trim().replace(/\s*\:\s*/ , '');
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
                fileContent = PT.S(data),
                docs = fileContent.match(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm),
                targetContent = [];
            docs.each(function (doc) {
                targetContent.push(doc2JSON(doc));
            });
            fs.writeFile(targetFilename, PT.JSON.stringify(targetContent, undefined, 2), function (err) {
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
genJSON.files.each(function (path) {
    if (/\.js$/.test(path)) {
        // when path is a .js source file already
        genJSONFromFile(path);
    } else {
        // when path is a directory
        fs.readdir(path, function (err, files) {
            if (err) {
                console.log('reading directory ' + path + " failed:\n" + err);
            }
            files.each(function (file) {
                if (/\.js$/.test(file)) {
                    genJSONFromFile(path + file);
                }
            });
        });
    }
});

