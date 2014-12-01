/* jshint strict: true, undef: true, unused: true */
/* global define */

define('color/cssByName', [
    'pastry',
    'color/hexByName'
], function(
    pastry,
    hexByName
) {
    'use strict';
    /*
     * @author      :  author
     * @description :  description
     */
    var preffix = '#',
        colorByName = {};

    pastry.each(hexByName, function (hex, name) {
        colorByName[name] = preffix + hex;
    });
    return colorByName;
});

