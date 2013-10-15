/**
 * @description : extend for String
 * @filename    : brick.string.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR) {
    BR.string = BR.string || String;

    // extend of Javascript 1.8.1
    /**
     * @description : Removes whitespace from both ends of the string.
     * @return      : {string} result string.
     * @syntax      : string.trim()
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
     */
    BR.string.prototype.trim = BR.string.prototype.trim || function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}(BR));
