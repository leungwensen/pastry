#!/usr/bin/env node

'use strict';

String.prototype.trim = String.prototype.trim || function () {
    return this.replace(/^\s+|\s+$/g, '');
};

var genJSON = require('commander'),
    fs = require('fs'),
    list = function (val) {
        return val.split(' ');
    },
    stringify = function (val) {
        return val;
    },
    str2arr = function (str) {
        var i,
            arr = str.replace(/\[|\]/gm, '').split(','),
            len = arr.length;
        for (i = 0; i < len; i ++) {
            arr[i] = arr[i].trim();
        }
        return arr;
    },
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
    embellishReturn = function (val) {
        var type = val.match(/\{\w+\s*\}/)[0],
            description = val.replace(type, '');
        return {
            'type'        : type.replace(/\{|\}/gm, '').trim(),
            'description' : description.trim()
        };
    },
    embellishValue = function (val) {
        val = String(val);
        try {
            var jsonObj = JSON.parse(val);
            var type = typeof jsonObj;
            if (type === 'object' || type === 'array' || type === 'function') {
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
    addComment = function (ret, key, value) {
        switch (key) {
            case 'param':
                ret[key] = ret[key] || [];
                ret[key].push(embellishParam(value));
                break;
            case 'return':
                ret[key] = embellishReturn(value);
                break;
            case 'requires':
                if (!ret.hasOwnProperty(key)) {
                    ret[key] = [];
                }
                ret[key] = ret[key].concat(str2arr(value));
                break;
            default:
                if (ret.hasOwnProperty(key)) {
                    var oldValue = ret[key],
                        newValue = embellishValue(value);
                    if (typeof oldValue === 'array' && typeof newValue !== 'array') {
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
        stringList = doc.split('@');                 // params[i]: xxxx : xxxx xxx, xxx.
        stringList.forEach(function (str) {
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
    genJSONFromFile = function (filename) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                console.log('reading from ' + filename + " failed:\n" + err );
                return;
            }
            var i,
                targetFilename = genJSON.directory + filename.replace(/^.*[\\\/]|\.js$/gm, '') + '.doc.json',
                fileContent = String(data),
                docs = fileContent.match(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm),
                len = docs.length,
                targetContent = [];
            for (i = 0; i < len; i ++) {
                targetContent.push(doc2JSON(docs[i]));
            }
            fs.writeFile(targetFilename, JSON.stringify(targetContent), function (err) {
                if (err) {
                    console.log('writting into ' + targetFilename + " failed:\n" + err);
                }
            });
        });
    };

genJSON.version('0.0.1')
      .option('-f, --files <items>', 'source files'    , list)
      .option('-d, --directory <s>', 'output directory', stringify)
      .parse(process.argv);
genJSON.files      = genJSON.files     || ['js/'];
genJSON.directory  = genJSON.directory || 'doc';
genJSON.directory += /\/$/.test(genJSON.directory) ? '' : '/';

genJSON.files.forEach(function (path) {
    if (/\.js$/.test(path)) {
        genJSONFromFile(path);
    } else {
        fs.readdir(path, function (err, files) {
            if (err) {
                console.log('reading directory ' + path + " failed:\n" + err);
            }
            files.forEach(function (file) {
                if (/\.js$/.test(file)) {
                    genJSONFromFile(path + file);
                }
            });
        });
    }
});

