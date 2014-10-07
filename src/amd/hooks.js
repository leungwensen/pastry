/* jshint strict: true, undef: true, unused: true */
/* global define */
define('amd/hooks', [
    'amd',
    'pastry'
], function(
    amd,
    pastry,
    undef
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - hooks
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var allId  = '**',
        queues = {};

    function getQueue (eventType, id) {
        var typeSpecific = queues[eventType] = queues[eventType] || {},
            queue = typeSpecific[id] = typeSpecific[id] || [];
        return queue;
    }
    function runCallbacks (eventType, args, callback) {
        var callbacks = getQueue(eventType, allId).concat(getQueue(eventType, args[0]));
        (function run(as) {
            if (callbacks.length) {
                callbacks.shift().apply(undef, as.concat(function() {
                    run([].slice.call(arguments));
                }));
            } else {
                callback.apply(undef, as);
            }
        }(args));
    }
    function on (eventType, id, callback) {
        if (!callback) {
            callback = id;
            id = allId; // hook runs on every module
        }
        getQueue(eventType, id).push(callback);
    }
    function off (eventType, id, callback) {
        if (pastry.isFunction(id)) {
            callback = id;
            id = allId; // hook runs on every module
        }
        var queue = getQueue(eventType, id || allId);
        for (var i = 0; i < queue.length; i++) {
            if (queue[i] === callback || !callback) {
                queue.splice(i, 1); // Removes the matching callback from the array.
                i -= 1; // Compensate for array length changing within the loop.
            }
        }
    }

    pastry.extend(amd, {
        _pre: function(callback, id, dependencies, factory) {
            runCallbacks('define', [
                id,
                dependencies,
                factory
            ], function(
                id_,
                deps_,
                factory_
            ) {
                var finalDeps = [],
                    count = deps_.length,
                    len = count,
                    getDep = function (n) {
                        return function(dep) {
                            finalDeps[n] = dep;
                            if (!--count) {
                                callback(id_, finalDeps, factory_);
                            }
                        };
                    };

                pastry.each(deps_, function (dep, i) {
                    runCallbacks('require', [
                        dep,
                        id_
                    ], getDep(i));
                });
                if (!len) {
                    callback(id_, finalDeps, factory_);
                }
            });

        },
        _post: function(callback, id, moduleValue) {
            if (id) {
                runCallbacks('publish', [
                    id,
                    moduleValue
                ], callback);
            } else {
                callback(id, moduleValue);
            }
        },
        _req: function(callback, id, contextId) {
            runCallbacks('require', [
                id,
                contextId
            ], callback);
        }
    });

    return {
        on  : on,
        off : off
    };
});
