/* jshint strict: true, undef: true, unused: true */
/* global define */
define('amd/normalize', [
    'pastry',
    'amd/hooks'
], function(
    pastry,
    hooks
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - normalize
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var relative = /^\.\.?\//;

    function normalize(id, contextId) {
        if (!id) {
            return id;
        }
        var parts = id.split('/'), contextParts, normalized = [];

        if (relative.test(id)) {
            contextParts = contextId ? contextId.split('/').slice(0, -1) : [];
            parts = contextParts.concat(parts);
        }

        pastry.each(parts, function (part) {
            switch (part) {
                case '.':
                    break;
                case '..':
                    if (normalized.length < 1) {
                        pastry.ERROR("Module id, "+ id +", with context, "+ contextId +", has too many '..' components.");
                    }
                    normalized.pop();
                    break;
                default:
                    normalized.push(part);
            }
        });

        return normalized.join('/');
    }

    hooks.on('define', function(id, dependencies, factory, next) {
        next(id, pastry.map(dependencies, function(d) {
            return normalize(d, id);
        }), factory);
    });
    hooks.on('require', function(id, contextId, next) {
        next(normalize(id, contextId), contextId);
    });

    return normalize;
});
