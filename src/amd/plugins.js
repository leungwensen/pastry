/* jshint strict: true, undef: true, unused: true */
/* global define */
define('tAMD/plugins', [
    'tAMD/hooks',
    'tAMD/normalize'
], function(
    hooks,
    normalize
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - plugins
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var started = {},
        exp = /^(.*?)!(.*)/;

    hooks.on('require', function(id, contextId, next) {
        var matches = exp.exec(id), plugin, resource;

        if (!matches) {
            next(id, contextId);
        } else {
            plugin   = normalize(matches[1], contextId);
            resource = matches[2];

            require([plugin], function(p) {
                var normResource;
                if (p.normalize) {
                    normResource = p.normalize(resource, function(r) {
                        return normalize(r, contextId);
                    });
                } else {
                    normResource = normalize(resource, contextId);
                }

                var normDep = plugin +'!'+ normResource;

                if (!started[normDep]) {
                    started[normDep] = true;
                    p.load(normResource, require, function(value) {
                        define(normDep, function() {
                            return value;
                        });
                    });
                }

                next(normDep, contextId);
            });
        }
    });
});
