/* brick v0.0.0
*  https://github.com/leungwensen/brick
*  Copyright (c) 2013 BR builders;  Licensed MIT */

"use strict";

var BRICK, BR;
BRICK = BR = {};
(function () {
    BR.GROUND = BR.GROUND || this;
}());

(function (BR, undefined) {
    BR.validator = BR.validator || {};

    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {unknown} value, value to be tested.
     * @return      : {boolean} if test succeeded.
     * @syntax      : BR.validator.isXxx(value)
     */
    BR.validator.isArray = Array.isArray;
    BR.validator.isFunction = function (value) {
        return (typeof value === 'function');
    };
}(BR));

(function (BR, undefined) {
    BR.array = BR.array || Array;

    // prettify array index
    var prettifyArrayIndex = function (index) {
        if (isNaN(index)) {
            index = 0;
        } else if (index !== 0 && index !== Infinity && index !== -Infinity) {
            index = (index > 0 || -1) * Math.floor(Math.abs(index));
        }
        return index;
    };

    // extend of Javascript 1.6
    /**
     * @description : Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @parameters  : {object} searchElement , Element to locate in the array.
     *                {number} fromIndex     , The index to start the search at. Default: 0 (Entire array is searched).
     * @return      : {number} index of element.
     * @syntax      : array.indexOf(searchElement[, fromIndex])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    BR.array.prototype.indexOf = BR.array.prototype.indexOf || function (searchElement, fromIndex) {
        var i,
            len = this.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (fromIndex) {
            fromIndex = prettifyArrayIndex(fromIndex);
        } else {
            fromIndex = 0;
        }
        if (fromIndex >= len) {
            return -1;
        }
        for (i = fromIndex >= 0 ? fromIndex : Math.max(len - Math.abs(fromIndex), 0); i < len; i ++) {
            if (this.hasOwnProperty(i) && this[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @description : Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.
     * @parameters  : {object} searchElement , Element to locate in the array.
     *                {number} fromIndex     , The index at which to start searching backwards. Defaults to the array's length.
     * @return      : {number} index of element.
     * @syntax      : array.lastIndexOf(searchElement[, fromIndex])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
     */
    BR.array.prototype.lastIndexOf = BR.array.prototype.lastIndexOf || function (searchElement, fromIndex) {
        var i,
            len = this.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (fromIndex) {
            fromIndex = prettifyArrayIndex(fromIndex);
        } else {
            fromIndex = len;
        }
        for (i = fromIndex >= 0 ? Math.min(fromIndex, len - 1) : len - Math.abs(fromIndex); i >= 0; i --) {
            if (this.hasOwnProperty(i) && this[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @description : Tests whether all elements in the array pass the test implemented by the provided function.
     * @parameters  : {function} callback , Function to test for each element.
     *                {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {boolean } if test succeeded or not.
     * @syntax      : array.every(callback[, thisObj])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     */
    BR.array.prototype.every = BR.array.prototype.every || function (callback, thisObj) {
        if (!BR.validator.isFunction(callback)) {
            throw new TypeError();
        }
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i ++) {
            if (this.hasOwnProperty(i) && !callback.call(thisObj, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @description : Creates a new array with all elements that pass the test implemented by the provided function.
     * @parameters  : {function} callback , Function to test each element of the array.
     *                {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {array   } result array.
     * @syntax      : array.filter(callback[, thisObj])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    BR.array.prototype.filter = BR.array.prototype.filter || function (callback, thisObj) {
        if (!BR.validator.isFunction(callback)) {
            throw new TypeError();
        }
        var i,
            res = [],
            len = this.length >>> 0;
        for (i in this) {
            if (this.hasOwnProperty(i)) {
                if (callback.call(thisObj, this[i], i, this)) {
                    res.push(this[i]);
                }
            }
        }
        return res;
    };
    /**
     * @description : Executes a provided function once per array element.
     * @parameters  : {function} callback , Function to execute for each element.
     *                {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : array.forEach(callback[, thisObj])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    BR.array.prototype.forEach = BR.array.prototype.forEach || function(callback, thisObj) {
        if (!BR.validator.isFunction(callback)) {
            throw new TypeError();
        }
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i ++) {
            if (this.hasOwnProperty(i)) {
                callback.call(thisObj, this[i], i, this);
            }
        }
    };
    /**
     * @description : Creates a new array with the results of calling a provided function on every element in this array.
     * @parameters  : {function} callback , Function that produces an element of the new Array from an element of the current one.
     *                {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {array   } result array.
     * @syntax      : array.map(callback[, thisObj])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     */
    BR.array.prototype.map = BR.array.prototype.map || function(callback, thisObj) {
        if (!BR.validator.isFunction(callback)) {
            throw new TypeError();
        }
        var i, kValue, mappedValue,
            res = [],
            len = this.length >>> 0;
        for (i = 0; i < len; i ++) {
            if (this.hasOwnProperty(i)) {
                res.push(callback.call(thisObj, this[i], i, this));
            }
        }
        return res;
    };
    /**
     * @description : Tests whether some element in the array passes the test implemented by the provided function.
     * @parameters  : {function} callback , Function to test for each element.
     *                {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {boolean } if test succeeded or not.
     * @syntax      : array.some(callback[, thisObj])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    BR.array.prototype.some = BR.array.prototype.some || function (callback, thisObj) {
        if (!BR.validator.isFunction(callback)) {
            throw new TypeError();
        }
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i ++) {
            if (this.hasOwnProperty(i) && callback.call(thisObj, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };

    // extend of Javascript 1.8
    /**
     * @description : Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
     * @parameters  : {function} callback , Function to execute on each value in the array, taking four arguments:
     *                    {object} previousValue , The value previously returned in the last invocation of the callback, or initialValue, if supplied.
     *                    {object} currentValue  , The current element being processed in the array.
     *                    {number} index         , The index of the current element being processed in the array.
     *                    {array } array         , The array reduce was called upon.
     *                {object  } thisObj  , Object to use as the first argument to the first call of the callback.
     * @return      : {object  } result value.
     * @syntax      : array.reduce(callback[, thisObj])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    BR.array.prototype.reduce = BR.array.prototype.reduce || function (callback, thisObj) {
        if (!BR.validator.isFunction(callback)) {
            throw new TypeError();
        }
        var i, value,
            len = this.length >>> 0,
            isValueSet = false;
        if (thisObj !== null) {
            value = thisObj;
            isValueSet = true;
        }
        for (i = 0; i < len; i ++) {
            if (this.hasOwnProperty(i)) {
                if (isValueSet) {
                    value = callback(value, this[i], i, this);
                } else {
                    value = this[i];
                    isValueSet = true;
                }
            }
        }
        if (!isValueSet) {
            throw new TypeError();
        }
        return value;
    };
    /**
     * @description : Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.
     * @parameters  : {function} callback , Function to execute on each value in the array.
     *                {object  } thisObj  , Object to use as the first argument to the first call of the callback.
     * @return      : {object  } result value.
     * @syntax      : array.reduceRight(callback[, thisObj])
     *
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight
     */
    BR.array.prototype.reduceRight = BR.array.prototype.reduceRight || function (callback, thisObj) {
        if (!BR.validator.isFunction(callback)) {
            throw new TypeError();
        }
        var i, value,
            len = this.length >>> 0,
            isValueSet = false;
        if (thisObj !== null) {
            value = thisObj;
            isValueSet = true;
        }
        for (i = len - 1; i > -1; i --) {
            if (!this.hasOwnProperty(i)) {
                if (isValueSet) {
                    value = callback(value, this[i], i, this);
                } else {
                    value = this[i];
                    isValueSet = true;
                }
            }
        }
        if (!isValueSet) {
            throw new TypeError();
        }
        return value;
    };

    // extend of Brick
    /**
     * @description : binarySearch.
     * @parameters  : {object  } element     , element to be searched.
     *                {function} compareFunc , compare function executed when searching.
     * @return      : {number  } result index.
     * @syntax      : array.binarySearch(element, compareFunc)
     */
    BR.array.prototype.binarySearch = BR.array.prototype.binarySearch || function (element, compareFunc) {
        if (!BR.validator.isFunction(compareFunc)) {
            throw new TypeError();
        }
        var start = 0,
            end = this.length,
            current = Math.floor(this.length/2);
        while (end !== current) {
            if (compareFunc(element, this[current]) > 0) {
                start = current + 1;
            } else {
                end = current;
            }
            current = Math.floor((start + end) / 2);
        }
        current = (current === 0 && compareFunc(element, this[current]) !== 0) ? -1 : current;
        return current;
    };
    /**
     * @description : Remove elements according to the given fromIndex and toIndex, and return the rest array.
     * @parameters  : {number} fromIndex , index to remove from.
     *                {number} toIndex   , index to remove to.
     * @syntax      : array.remove([fromIndex[, toIndex]])
     *
     * @refference  : Array Remove - By John Resig (MIT Licensed)
     */
    BR.array.prototype.remove = BR.array.prototype.remove || function (fromIndex, toIndex) {
        if (fromIndex) {
            fromIndex = prettifyArrayIndex(fromIndex);
        } else {
            return this;
        }
        if (toIndex) {
            toIndex = prettifyArrayIndex(toIndex);
        }
        var rest = this.slice((toIndex || fromIndex) + 1 || this.length);
        this.length = fromIndex < 0 ? this.length + fromIndex : fromIndex;
        this.push.apply(this, rest);
    };
    /**
     * @description : replace.
     * @parameters  : {object} element     , element to be replaced.
     *                {object} withElement , element to replace with.
     * @syntax      : array.replace(element, withElement)
     */
    BR.array.prototype.replace = BR.array.prototype.replace || function (element, withElement) {
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i ++) {
            if (this[i] === element) {
                this[i] = withElement;
            }
        }
    };

    /**
     * @description : test if array has an element.
     * @parameters  : {object } element, element to be tested.
     * @return      : {boolean} if array has the element.
     * @syntax      : array.ifContain
     */
    BR.array.prototype.hasElement = BR.array.prototype.hasElement || function (element) {
        return (this.indexOf(element) > -1);
    };
    /**
     * @description : intersection set of two arrays (this ∩ that)
     * @parameters  : {array} that, the array to get intersection set with.
     * @return      : {array} result array.
     * @syntax      : array.intersection(that)
     */
    BR.array.prototype.intersection = BR.array.prototype.intersection || function (that) {
        if (!BR.validator.isArray(that)) {
            throw new TypeError();
        }
        var i,
            len = this.length >>> 0,
            resultArr = [];
        for (i = 0; i < len; i ++) {
            if (that.hasElement(this[i]) && !resultArr.hasElement(this[i])) {
                resultArr.push(this[i]);
            }
        }
        return resultArr;
    };
    /**
     * @description : complement set of two arrays (this - that)
     * @parameters  : {array} that, the array to get complement set with.
     * @return      : {array} result array.
     * @syntax      : array.complement(that)
     */
    BR.array.prototype.complement = BR.array.prototype.complement || function (that) {
        if (!BR.validator.isArray(that)) {
            throw new TypeError();
        }
        var i,
            len = this.length >>> 0,
            resultArr = [];
        for (i = 0; i < len; i ++) {
            if (!that.hasElement(this[i]) && !resultArr.hasElement(this[i])) {
                resultArr.push(this[i]);
            }
        }
        return resultArr;
    };
    /**
     * @description : union set of two arrays (this U that)
     * @parameters  : {array} that, the array to get union set with.
     * @return      : {array} result array.
     * @syntax      : array.intersection(that)
     */
    BR.array.prototype.union = BR.array.prototype.union || function (that) {
        if (!BR.validator.isArray(that)) {
            throw new TypeError();
        }
        return this.concat(that).uniq();
    };
    /**
     * @description : uniq sub array of an array.
     * @return      : {array} result sub array.
     * @syntax      : array.uniq()
     */
    BR.array.prototype.uniq = BR.array.prototype.uniq || function () {
        var i = 0,
            len = this.length >>> 0,
            resultArr = [];
        for (i = 0; i < len; i ++) {
            if (!resultArr.hasElement(this[i])) {
                resultArr.push(this[i]);
            }
        }
        return resultArr;
    };
}(BR));

(function (BR, undefined) {
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

(function (BR, undefined) {
    BR.number = BR.number || Number;

    /**
     * @description : return stringified number according to given pattern.
     * @parameters  : {object} option, defines pattern for stringify.
     *                    {
     *                        comma   : {1|0},
     *                        decimal : {0-9},
     *                        integer : {0-9},
     *                        zero    : {1|0},
     *                    }
     * @return      : {string} result string.
     * @syntax      : number.toFormatString([option])
     */
    BR.number.prototype.toFormatString = BR.number.prototype.toFormatString || function (option) {
        var i, len, placeHolder,
            str = this.toString(),
            strArr = str.split('.');
        option = option || {
            'comma'   : 1,
            'decimal' : 2,
            'integer' : 5,
            'zero'    : 0
        };
        placeHolder = (option.hasOwnProperty('zero') && option.zero !== 0) ? '0' : ' ';
        if (option.hasOwnProperty('decimal')) {
            strArr[1] = strArr[1] || '';
            strArr[1] = strArr[1].slice(0, option.decimal);
            len = option.decimal - strArr[1].length;
            for (i = 0; i < len; i ++) {
                strArr[1] += '0';
            }
        }
        if (option.hasOwnProperty('integer')) {
            len = option.integer - strArr[0].length;
            for (i = 0; i < len; i ++) {
                strArr[0] = placeHolder + strArr[0];
            }
        }
        if (option.hasOwnProperty('comma') && option.comma !== 0) {
            strArr[0] = strArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        if (strArr[1] !== '') {
            return strArr.join('.');
        }
        return strArr[0];
    };
}(BR));

(function (BR, undefined) {
    BR.date = BR.date || Date;

    var padZero = function (n) {
        return (n < 10 ? '0' : '') + n;
    };
    /**
     * @description : return stringified date according to given pattern.
     * @parameters  : {string} pattern, defines pattern for stringify.
     *                    default : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
     *                    other   : '{YY}-{M}-{D} {h}:{m}:{s}'        => '2013-10-3 0:57::13'
     * @return      : {string} result string.
     * @syntax      : date.toFormatString([pattern])
     */
    BR.date.prototype.toFormatString = BR.date.prototype.toFormatString || function (pattern) {
        var y, mo, d, h, mi, s;
        pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';
        return pattern.replace( '{YYYY}', y = String(this.getFullYear())  )
                      .replace( '{MM}'  , padZero(mo = this.getMonth())   )
                      .replace( '{DD}'  , padZero(d  = this.getDate())    )
                      .replace( '{hh}'  , padZero(h  = this.getHours())   )
                      .replace( '{mm}'  , padZero(mi = this.getMinutes()) )
                      .replace( '{ss}'  , padZero(s  = this.getSeconds()) )
                      .replace( '{YY}'  , y.substring(2) )
                      .replace( '{M}'   , mo             )
                      .replace( '{D}'   , d              )
                      .replace( '{h}'   , h              )
                      .replace( '{m}'   , mi             )
                      .replace( '{s}'   , s              );
    };
}(BR));
