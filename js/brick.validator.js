/**
 * @description : validator
 * @filename    : brick.validator.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR) {
    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {unknown} value, value to be tested.
     * @return      : {boolean} if test succeeded.
     * @syntax      : BR.validator.isXxx(value)
     */

    BR.isDefined = BR.isDefined || function (value) {
        return (typeof value !== 'undefined');
    };
    BR.isUndefined = BR.isUndefined || function (value) {
        return (typeof value === 'undefined');
    };

    BR.isFunction = BR.isFunction || function (value) {
        return (typeof value === 'function');
    };

    BR.isNumber = BR.isNumber || function (value) {
        return (typeof value === 'number');
    };

    BR.isObject = BR.isObject || function (value) {
        return (typeof value === 'object');
    };

    BR.isString = BR.isString || function (value) {
        return (typeof value === 'string');
    };

    // extend of Javascript 1.8.5
    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
     */
    BR.isArray = BR.isArray || Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };

}(BR));
