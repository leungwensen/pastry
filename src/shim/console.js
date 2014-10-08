/* jshint strict: true, undef: true, unused: true */
/* global define */
define('shim/console', [
    'pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-08
     * @description : shim 模块 - console
     * @reference   : https://github.com/douglascrockford/JSON-js
     */
    if (console && !!console.log && !!console.error && console.warn) {
        return console;
    }
    var noop = function () {},
        shim = {
            log   : noop,
            warn  : noop,
            error : noop
        };

    pastry.setGLOBAL('console', shim);
    return shim;
});
