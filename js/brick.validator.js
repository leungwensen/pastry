/**
 * @description : validator
 * @filename    : brick.validator.js
 * @requires    : [brick.js, brick.alias.js]
 */
'use strict';

(function (BR) {
    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {unknown} value, value to be tested.
     * @return      : {boolean} if test succeeded.
     * @syntax      : BR.isXxx(value)
     */

    /**
     * @syntax : BR.isDef(value)
     */
    BR.isDef = BR.isDef || function (value) {
        return (typeof value !== 'undefined');
    };

     /**
     * @syntax : BR.isFunc(value)
     */
    BR.isFunc = BR.isFunc || function (value) {
        return (typeof value === 'function');
    };

    /**
     * @syntax : BR.isNum(value)
     */
    BR.isNum = BR.isNum || function (value) {
        return (typeof value === 'number');
    };

    /**
     * @syntax : BR.isObj(value)
     */
    BR.isObj = BR.isObj || function (value) {
        return (typeof value === 'object');
    };

    /**
     * @syntax : BR.isStr(value)
     */
    BR.isStr = BR.isStr || function (value) {
        return (typeof value === 'string');
    };

    // extend of Javascript 1.8.5
    /**
     * @syntax     : BR.isArr(value)
     * @refference : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
     */
    BR.isArr = BR.isArr || Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };
}(BR));
