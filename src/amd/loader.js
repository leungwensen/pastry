/* jshint strict: true, undef: true, unused: true */
/* global define, document */
define('amd/loader', [
    'pastry',
    'require',
    'amd/hooks'
], function(
    pastry,
    require,
    hooks
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - hooks
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var mappings  = {},
        callbacks = {},
        loaded    = {},
        requested = {};

    function noop () {}
    function maybeLoad (id) {
        var urls, callback;
        if (!require(id) && (urls = mappings[id])) {
            delete mappings[id];
            callback = callbacks[id];
            clearValue(callbacks, callback);
            loadInOrder(urls, callback);
        } else {
            requested[id] = true;
        }
    }
    function loadInOrder (urls, callback) {
        if (urls[0]) {
            load(urls[0], function() {
                loadInOrder(urls.slice(1), callback);
            });
        } else if (callback) {
            callback();
        }
    }
    function load (src, callback) {
        var prevCallback = loaded[src];

        if (true === prevCallback) {
            if (pastry.isFunction(callback)) {
                callback();
            }
        } else if (callback) {
            loaded[src] = chain(prevCallback, callback);
        }
        if (prevCallback) {
            return;
        }

        var firstScript = document.getElementsByTagName('script')[0],
            head        = firstScript.parentNode,
            script      = document.createElement('script');

        script.src   = src;
        script.async = true;
        script.onreadystatechange = script.onload = function() {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = noop;
                head.removeChild(script);

                (loaded[src] || noop)();
                loaded[src] = true;
            }
        };
        head.insertBefore(script, firstScript);
    }
    function clearValue (map, value) {
        for (var k in map) {
            if (map.hasOwnProperty(k) && map[k] === value) {
                delete map[k];
            }
        }
    }
    function chain (f, g) {
        return function() {
            if (pastry.isFunction(f)) {
                f();
            }
            g();
        };
    }
    function map (ids, urls, callback) {
        pastry.each(ids, function (id) {
            mappings[id] = urls;
            callbacks[id] = callback;
            if (requested[id]) {
                maybeLoad(id);
            }
        });
    }

    hooks.on('define', function(id, dependencies, factory, next) {
        for (var i = 0; i < dependencies.length; i++) {
            maybeLoad(dependencies[i]);
        }
        next(id, dependencies, factory);
    });

    return {
        map: map
    };
});
