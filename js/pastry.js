/**
 * @author      : https://github.com/leungwensen/pastry/graphs/contributors
 * @description : first pastry of the building
 * @filename    : pastry.js
 */
'use strict';

var PASTRY, PT, P;
PASTRY  = PT = P = {};
/* jshint -W040 */ P.OVEN  = P.ON = this;

(function () {
    // alias. oh yeah, this is UNREADABLE !!
    // just for saving bits.
    /*
     * @description : alias of Array
     */
    P.A  = Array;
    P.AP = P.A.prototype;
    /*
     * @description : alias of Boolean
     */
    P.B  = Boolean;
    P.BP = P.B.prototype;
    /*
     * @description : alias of Date
     */
    P.D  = Date;
    P.DP = P.D.prototype;
    /*
     * @description : alias of Function
     */
    P.F  = Function;
    P.FP = P.F.prototype;
    /*
     * @description : alias of Function
     */
    P.N  = Number;
    P.NP = P.N.prototype;
    /*
     * @description : alias of Object
     */
    P.O  = Object;
    P.OP = P.O.prototype;
    /*
     * @description : alias of String
     */
    P.S  = String;
    P.SP = P.S.prototype;
    /*
     * @description : alias of Object.prototype.toString
     */
    P.toStr = P.OP.toString;

    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {unknown} value, value to be tested.
     * @return      : {boolean} if test succeeded.
     * @syntax      : PT.isXxx(value)
     */
    /**
     * @syntax : PT.isBool(value)
     */
    P.isBool = function (value) {
        return (typeof value === 'boolean');
    };
    /**
     * @syntax : PT.isDef(value)
     */
    P.isDef = function (value) {
        return (typeof value !== 'undefined');
    };
     /**
     * @syntax : PT.isFunc(value)
     */
    P.isFunc = function (value) {
        return (typeof value === 'function');
    };
    /**
     * @syntax : PT.isNum(value)
     */
    P.isNum = function (value) {
        return (typeof value === 'number');
    };
    /**
     * @syntax : PT.isStr(value)
     */
    P.isStr = function (value) {
        return (typeof value === 'string');
    };
    /**
     * @syntax : PT.isObj(value)
     */
    P.isObj = function (value) {
        return (value !== null && typeof value === 'object');
    };
    // extend of Javascript 1.8.5
    /**
     * @syntax     : PT.isArr(value)
     * @refference : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
     */
    P.isArr = P.A.isArray || function (value) {
        return P.toStr.call(value) === "[object Array]";
    };
    /**
     * @syntax : PT.isDate(value)
     */
    P.isDate = function (value) {
        return P.toStr.call(value) === '[object Date]';
    };
    /**
     * @syntax : PT.isErr(value)
     */
    P.isErr = function (value) {
        return P.toStr.call(value) === '[object Error]';
    };
    /**
     * @syntax : PT.isRegExp(value)
     */
    P.isRegExp = function (value) {
        return P.toStr.call(value) === '[object RegExp]';
    };

    /**
     * @syntax : PT.toInt(value[, base])
     */
    P.toInt = function (value, base) {
        return parseInt(value, base || 10);
    };

    /*
     * @description : try to load original edition of global variables
     * @param       : {array  } callbackList, list of callback functions.
     * @return      : {unknown} value the callback functions try to return.
     * @syntax      : PT.tryEach(callbackList) || PT.tryEach(callbackList)
     */
    P.tryAny = function (callbackList) {
        var i, callback, returnValue;

        for (i = 0; i < callbackList.length; i ++) {
            callback = callbackList[i];
            try {
                returnValue = callback();
                break;
            } catch (e) {}
        }
        return returnValue;
    };

    // export PT
    /*
     * @description : the environment global variable.
     * @syntax      : PT.OVEN
     * @return      : {browser} window.
     * @return      : {nodejs } exports.
     */
    if (P.isDef(exports)) {
        if (P.isDef(module) && module.exports) {
            exports = module.exports = P;
        }
        exports.PASTRY = exports.PT = P;
        P.NODEJS     = 1;
        P.ON.process = process;
    } else {
        P.ON.PASTRY = P.ON.PT = P;
        P.BROWSER = 1;
    }

    // ready for cooking!
}());

