/* jshint strict: true, undef: true, unused: true */
/* global define, document, location */

define('module/path', [
    'pastry',
    'Module'
], function (
    pastry,
    Module
) {
    'use strict';
    /*
     * @author      : wensen.lws
     * @description : 模块路径问题
     * @reference   : https://github.com/seajs/seajs/blob/master/src/util-path.js
     * @note        : browser only
     */
    var re = {
            absolute       : /^\/\/.|:\//,
            dirname        : /[^?#]*\//,
            dot            : /\/\.\//g,
            doubleDot      : /\/[^/]+\/\.\.\//,
            ignoreLocation : /^(about|blob):/,
            multiSlash     : /([^:/])\/+\//g,
            path           : /^([^/:]+)(\/.+)$/,
            rootDir        : /^.*?\/\/.*?\//
        },
        data         = Module._data,
        doc          = document,
        lc           = location,
        href         = lc.href,
        scripts      = doc.scripts,
        loaderScript = doc.getElementById('moduleLoader') || scripts[scripts.length - 1],
        loaderPath   = loaderScript.hasAttribute ? /* non-IE6/7 */ loaderScript.src : loaderScript.getAttribute('src', 4);

    function dirname(path) {
        // dirname('a/b/c.js?t=123#xx/zz') ==> 'a/b/'
        return path.match(re.dirname)[0];
    }
    function realpath(path) {
        path = path.replace(re.dot, '/'); // /a/b/./c/./d ==> /a/b/c/d
        // a//b/c ==> a/b/c
        // a///b/////c ==> a/b/c
        // DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
        path = path.replace(re.multiSlash, '$1/');
        while (path.match(re.doubleDot)) {
            // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
            path = path.replace(re.doubleDot, '/');
        }
        return path;
    }
    function normalize(path) {
        // normalize('path/to/a') ==> 'path/to/a.js'
        var last  = path.length - 1,
            lastC = path.charCodeAt(last);
        if (lastC === 35 /* '#' */) {
            // If the uri ends with `#`, just return it without '#'
            return path.substring(0, last);
        }
        return (path.substring(last - 2) === '.js' || path.indexOf('?') > 0 || lastC === 47 /* '/' */) ?
            path : (path + '.js');
    }
    function parseAlias(id) {
        var alias = data.alias;
        return alias && pastry.isString(alias[id]) ? alias[id] : id;
    }
    function parsePaths(id) {
        var m,
            paths = data.paths;
        if (paths && (m = id.match(re.path)) && pastry.isString(paths[m[1]])) {
            id = paths[m[1]] + m[2];
        }
        return id;
    }
    function addBase(id, refUri) {
        var ret,
            first = id.charCodeAt(0);

        if (re.absolute.test(id)) { // Absolute
            ret = id;
        } else if (first === 46 /* '.' */) { // Relative
            ret = (refUri ? dirname(refUri) : data.cwd) + id;
        } else if (first === 47 /* '/' */) { // Root
            var m = data.cwd.match(re.rootDir);
            ret = m ? m[0] + id.substring(1) : id;
        } else { // Top-level
            ret = data.base + id;
        }
        if (ret.indexOf('//') === 0) { // Add default protocol when uri begins with '//'
            ret = lc.protocol + ret;
        }
        return realpath(ret);
    }
    function id2Uri(id, refUri) {
        if (!id) {
            return '';
        }
        id = parseAlias(id);
        id = parsePaths(id);
        id = parseAlias(id);
        id = normalize(id);
        id = parseAlias(id);

        var uri = addBase(id, refUri);
        uri = parseAlias(uri);
        return uri;
    }

    data.cwd  = (!href || re.ignoreLocation.test(href)) ? '' : dirname(href);
    data.path = loaderPath;
    data.dir  = data.base = dirname(loaderPath || data.cwd);

    return {
        id2Uri: id2Uri
    };
});

