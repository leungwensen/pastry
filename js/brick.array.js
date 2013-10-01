/**
 * @author      : leungwensen@gmail.com
 * @description : extend for Array
 * @filename    : brick.array.js
 *
 * BR.arr = BR.array:
 */
(function (BR) {
    'use strict';
    BR.array = BR.array || Array;

    // extend of Javascript 1.6
    /**
     * @description : Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @parameters  : searchElement , Element to locate in the array.
     *                fromIndex     , The index to start the search at. Default: 0 (Entire array is searched).
     * @syntax      : array.indexOf(searchElement[, fromIndex])
     */
    BR.array.prototype.indexOf = BR.array.prototype.indexOf || function (searchElement, fromIndex) {
        if (this === null) {
            throw new TypeError();
        }
        var k,
            len = this.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (fromIndex) {
            if (isNaN(fromIndex)) {
                fromIndex = 0;
            } else if (fromIndex !== 0 && fromIndex !== Infinity && fromIndex !== -Infinity) {
                fromIndex = (fromIndex > 0 || -1) * Math.floor(Math.abs(fromIndex));
            }
        }
        if (fromIndex >= len) {
            return -1;
        }
        for (k = fromIndex >= 0 ? fromIndex : Math.max(len - Math.abs(fromIndex), 0); k < len; k++) {
            if (this.hasOwnProperty(k) && this[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
    /**
     * @description : Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.
     * @parameters  : searchElement , Element to locate in the array.
     *                fromIndex     , The index at which to start searching backwards. Defaults to the array's length.
     * @syntax      : array.lastIndexOf(searchElement[, fromIndex])
     */
    BR.array.prototype.lastIndexOf = BR.array.prototype.lastIndexOf || function (searchElement, fromIndex) {
        if (this === null) {
            throw new TypeError();
        }
        var k,
            len = this.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (fromIndex) {
            if (isNaN(fromIndex)) {
                fromIndex = 0;
            } else if (fromIndex !== 0 && fromIndex !== Infinity && fromIndex !== -Infinity) {
                fromIndex = (fromIndex > 0 || -1) * Math.floor(Math.abs(fromIndex));
            }
        } else {
            fromIndex = len;
        }
        for (k = fromIndex >= 0 ? Math.min(fromIndex, len - 1) : len - Math.abs(fromIndex); k >= 0; k--) {
            if (this.hasOwnProperty(k) && this[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
    /**
     * @description : Tests whether all elements in the array pass the test implemented by the provided function.
     * @parameters  : callback , Function to test for each element.
     *                thisObj  , Object to use as this when executing callback.
     * @syntax      : array.every(callback[, thisObj])
     */
    BR.array.prototype.every = BR.array.prototype.every || function (callback, thisObj) {
        if (this === null || typeof callback !== 'function') {
            throw new TypeError();
        }
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i++) {
            if (this.hasOwnProperty(i) && !callback.call(thisObj, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @description : Creates a new array with all elements that pass the test implemented by the provided function.
     * @parameters  : callback , Function to test each element of the array.
     *                thisObj  , Object to use as this when executing callback.
     * @syntax      : array.filter(callback[, thisObj])
     */
    BR.array.prototype.filter = BR.array.prototype.filter || function (callback, thisObj) {
        if (!this || typeof callback !== 'function') {
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
     * @parameters  : callback , Function to execute for each element.
     *                thisObj  , Object to use as this when executing callback.
     * @syntax      : array.forEach(callback[, thisObj])
     */
    BR.array.prototype.forEach = BR.array.prototype.forEach || function(callback, thisObj) {
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i++) {
            if (this.hasOwnProperty(i)) {
                callback.call(thisObj, this[i], i, this);
            }
        }
    };
    /**
     * @description : Creates a new array with the results of calling a provided function on every element in this array.
     * @parameters  : callback , Function that produces an element of the new Array from an element of the current one.
     *                thisObj  , Object to use as this when executing callback.
     * @syntax      : array.map(callback[, thisObj])
     */
    BR.array.prototype.map = BR.array.prototype.map || function(callback, thisObj) {
        if (this === null || typeof callback !== 'function') {
            throw new TypeError();
        }
        var i, kValue, mappedValue,
            res = [],
            len = this.length >>> 0;
        for (i = 0; i < len; i++) {
            if (this.hasOwnProperty(i)) {
                res.push(callback.call(thisObj, this[i], i, this));
            }
        }
        return res;
    };
    /**
     * @description : Tests whether some element in the array passes the test implemented by the provided function.
     * @parameters  : callback , Function to test for each element.
     *                thisObj  , Object to use as this when executing callback.
     * @syntax      : array.some(callback[, thisObj])
     */
    BR.array.prototype.some = BR.array.prototype.some || function (callback, thisObj) {
        if (this === null || typeof callback !== 'function') {
            throw new TypeError();
        }
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i++) {
            if (this.hasOwnProperty(i) && callback.call(thisObj, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };

    // extend of Javascript 1.8
    /**
     * @description : Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
     * @parameters  : callback , Function to execute on each value in the array, taking four arguments:
     *                           previousValue , The value previously returned in the last invocation of the callback, or initialValue, if supplied.
     *                           currentValue  , The current element being processed in the array.
     *                           index         , The index of the current element being processed in the array.
     *                           array         , The array reduce was called upon.
     *                thisObj  , Object to use as the first argument to the first call of the callback.
     * @syntax      : array.reduce(callback[, thisObj])
     */
    BR.array.prototype.reduce = BR.array.prototype.reduce || function (callback, thisObj) {
        if (this === null || typeof this === 'undefined' || typeof callback !== 'function') {
            throw new TypeError();
        }
        var i, value,
            len = this.length >>> 0,
            isValueSet = false;
        if (thisObj !== null) {
            value = thisObj;
            isValueSet = true;
        }
        for (i = 0; i < len; i++) {
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
     * @parameters  : callback , Function to execute on each value in the array.
     *                thisObj  , Object to use as the first argument to the first call of the callback.
     * @syntax      : array.reduceRight(callback[, thisObj])
     */
    BR.array.prototype.reduceRight = BR.array.prototype.reduceRight || function (callback, thisObj) {
        if (this === null || typeof this === 'undefined' || typeof callback !== 'function') {
            throw new TypeError();
        }
        var i, value,
            len = this.length >>> 0,
            isValueSet = false;
        if (thisObj !== null) {
            value = thisObj;
            isValueSet = true;
        }
        for (i = len - 1; i > -1; i--) {
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
    BR.array.prototype.binarySearch = BR.array.prototype.binarySearch || function (element, compareFunc) {};
    BR.array.prototype.remove = BR.array.prototype.remove || function (element) {};
    BR.array.prototype.replace = BR.array.prototype.replace || function (element, withElement) {};

    BR.array.prototype.contain = BR.array.prototype.contain || function (element) {};
    BR.array.prototype.uniquelize = BR.array.prototype.uniquelize || function () {};

    BR.array.prototype.intersect = BR.array.prototype.intersect || function (arr) {};
    BR.array.prototype.minus = BR.array.prototype.minus || function (arr) {};
    BR.array.prototype.union = BR.array.prototype.union || function (arr) {};

    // alias
    BR.arr = BR.array;
}());
