/**
 * @description : validator
 * @filename    : pastry.validator.js
 * @requires    : [pastry.js, pastry.alias.js]
 */
'use strict';

(function (PT) {
    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {unknown} value, value to be tested.
     * @return      : {boolean} if test succeeded.
     * @syntax      : PT.isXxx(value)
     */

    /**
     * @syntax : PT.isDef(value)
     */
    PT.isDef = PT.isDef || function (value) {
        return (typeof value !== 'undefined');
    };

     /**
     * @syntax : PT.isFunc(value)
     */
    PT.isFunc = PT.isFunc || function (value) {
        return (typeof value === 'function');
    };

    /**
     * @syntax : PT.isNum(value)
     */
    PT.isNum = PT.isNum || function (value) {
        return (typeof value === 'number');
    };

    /**
     * @syntax : PT.isObj(value)
     */
    PT.isObj = PT.isObj || function (value) {
        return (typeof value === 'object');
    };

    /**
     * @syntax : PT.isStr(value)
     */
    PT.isStr = PT.isStr || function (value) {
        return (typeof value === 'string');
    };

    // extend of Javascript 1.8.5
    /**
     * @syntax     : PT.isArr(value)
     * @refference : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
     */
    PT.isArr = PT.isArr || Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };
}(PT));
