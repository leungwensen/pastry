/**
 * @description : extend for String
 * @filename    : pastry.string.js
 * @requires    : [pastry.js]
 */
'use strict';

(function (PT) {
    var sp = PT.SP;
    // extend of Javascript 1.8.1
    /**
     * @description : Removes whitespace from both ends of the string.
     * @return      : {string} result string.
     * @syntax      : string.trim()
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
     */
    sp.trim = sp.trim || function () {
        return this.replace(/^\s+|\s+$/g, '');
    };

    // alias. black pastries again
    /*
     * @syntax : string.uc()
     */
    sp.uc = sp.toUpperCase;
    /*
     * @syntax : string.lc()
     */
    sp.lc = sp.toLowerCase;

    /*
     * @syntax : string.toInt()
     */
    sp.toInt = function (base){
        return parseInt(this, base || 10);
    };

    /*
     * @description : check if string has a given sub string.
     * @syntax      : string.has(subStr)
     * @param       : {String} subStr, given sub string.
     * @return      : {Boolean} result.
     */
    sp.has = function (subStr) {
        return (this.indexOf(subStr) > -1);
    };
}(PT));
