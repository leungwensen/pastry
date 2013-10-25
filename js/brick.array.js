/**
 * @description : extend for Array
 * @filename    : brick.array.js
 * @requires    : [brick.js, brick.validator.js, brick.object.js]
 */
'use strict';

(function (BR) {
    var p = Array.prototype;

    // extend of Javascript 1.6
    /**
     * @description : Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @param       : {object} searchElement , Element to locate in the array.
     * @param       : {number} fromIndex     , The index to start the search at. Default: 0 (Entire array is searched).
     * @return      : {number} index of element.
     * @syntax      : array.indexOf(searchElement[, fromIndex])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    p.indexOf = p.indexOf || function (searchElement, fromIndex) {
        var i,
            a = this,
            len = a.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (!BR.isDef(fromIndex)) {
            fromIndex = 0;
        }
        if (fromIndex >= len) {
            return -1;
        }
        for (i = fromIndex >= 0 ? fromIndex : Math.max(len - Math.abs(fromIndex), 0); i < len; i ++) {
            if (a.has(i) && a[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @description : Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.
     * @param       : {object} searchElement , Element to locate in the array.
     * @param       : {number} fromIndex     , The index at which to start searching backwards. Defaults to the array's length.
     * @return      : {number} index of element.
     * @syntax      : array.lastIndexOf(searchElement[, fromIndex])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
     */
    p.lastIndexOf = p.lastIndexOf || function (searchElement, fromIndex) {
        var i,
            a = this,
            len = a.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (!BR.isDef(fromIndex)) {
            fromIndex = len;
        }
        for (i = fromIndex >= 0 ? Math.min(fromIndex, len - 1) : len - Math.abs(fromIndex); i >= 0; i --) {
            if (a.has(i) && a[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @description : Tests whether all elements in the array pass the test implemented by the provided function.
     * @param       : {function} callback , Function to test for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {boolean } if test succeeded or not.
     * @syntax      : array.every(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     */
    p.every = p.every || function (callback, thisObj) {
        var i,
            a = this;
        for (i = 0; i < a.length; i ++) {
            if (a.has(i) && !callback.call(thisObj, a[i], i, a)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @description : Creates a new array with all elements that pass the test implemented by the provided function.
     * @param       : {function} callback , Function to test each element of the array.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {array   } result array.
     * @syntax      : array.filter(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    p.filter = p.filter || function (callback, thisObj) {
        var a = this,
            res = [];
        a.each(function (element, key) {
            if (callback.call(thisObj, element, key, a)) {
                res.push(element);
            }
        });
        return res;
    };
    /**
     * @description : Executes a provided function once per array element.
     * @param       : {function} callback , Function to execute for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : array.forEach(callback[, thisObj]) || array.each(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    // see brick.object.js: object.forEach || object.each
    /**
     * @description : Creates a new array with the results of calling a provided function on every element in this array.
     * @param       : {function} callback , Function that produces an element of the new Array from an element of the current one.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {array   } result array.
     * @syntax      : array.map(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     */
    p.map = p.map || function(callback, thisObj) {
        var a = this,
            res = [];
        a.each(function (element, key) {
            res.push(callback.call(thisObj, element, key, a));
        });
        return res;
    };
    /**
     * @description : Tests whether some element in the array passes the test implemented by the provided function.
     * @param       : {function} callback , Function to test for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {boolean } if test succeeded or not.
     * @syntax      : array.some(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    p.some = p.some || function (callback, thisObj) {
        var i,
            a = this;
        for (i = 0; i < a.length; i ++) {
            if (a.has(i) && callback.call(thisObj, a[i], i, a)) {
                return true;
            }
        }
        return false;
    };

    // extend of Javascript 1.8
    /**
     * @description     : Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
     * @param           : {function} callback      , Function to execute on each value in the array, taking four arguments:
     * @param           : {object  } thisObj       , Object to use as the first argument to the first call of the callback.
     * @paramOfCallback : {object  } previousValue , The value previously returned in the last invocation of the callback, or initialValue, if supplied.
     * @paramOfCallback : {object  } currentValue  , The current element being processed in the array.
     * @paramOfCallback : {number  } index         , The index of the current element being processed in the array.
     * @paramOfCallback : {array   } array         , The array reduce was called upon.
     * @return          : {object  } result value.
     * @syntax          : array.reduce(callback[, thisObj])
     * @refference      : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    p.reduce = p.reduce || function (callback, thisObj) {
        var i, value,
            a = this,
            isValueSet = false;
        if (BR.isDef(thisObj)) {
            value = thisObj;
            isValueSet = true;
        }
        for (i = 0; i < a.length; i ++) {
            if (a.has(i)) {
                if (isValueSet) {
                    value = callback(value, a[i], i, a);
                } else {
                    value = a[i];
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
     * @param       : {function} callback , Function to execute on each value in the array.
     * @param       : {object  } thisObj  , Object to use as the first argument to the first call of the callback.
     * @return      : {object  } result value.
     * @syntax      : array.reduceRight(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight
     */
    p.reduceRight = p.reduceRight || function (callback, thisObj) {
        var i, value,
            a = this,
            isValueSet = false;
        if (BR.isDef(thisObj)) {
            value = thisObj;
            isValueSet = true;
        }
        for (i = a.length - 1; i >= 0; i --) {
            if (a.has(i)) {
                if (isValueSet) {
                    value = callback(value, a[i], i, a);
                } else {
                    value = a[i];
                    isValueSet = true;
                }
            }
        }
        if (!isValueSet) {
            throw new TypeError();
        }
        return value;
    };

    // extend of BR.ick
    /**
     * @description : binarySearch.
     * @param       : {object  } element     , element to be searched.
     * @param       : {function} compareFunc , compare function executed when searching.
     * @return      : {number  } result index.
     * @syntax      : array.binarySearch(element, compareFunc)
     */
    p.binarySearch = p.binarySearch || function (element, compareFunc) {
        var start = 0,
            a = this,
            end = a.length,
            current = Math.floor(end/2);
        while (end !== current) {
            if (compareFunc(element, a[current]) > 0) {
                start = current + 1;
            } else {
                end = current;
            }
            current = Math.floor((start + end) / 2);
        }
        current = (current === 0 && compareFunc(element, a[current]) !== 0) ? -1 : current;
        return current;
    };
    /**
     * @description : Remove elements according to the given fromIndex and toIndex, and return the rest array.
     * @param       : {number} fromIndex , index to remove from.
     * @param       : {number} toIndex   , index to remove to.
     * @syntax      : array.remove([fromIndex[, toIndex]])
     * @refference  : Array Remove - B. John Resig (MIT Licensed)
     */
    p.remove = p.remove || function (fromIndex, toIndex) {
        var rest,
            a = this,
            len = a.length;
        if (!BR.isDef(fromIndex)) {
            return a;
        }
        rest = a.slice((toIndex || fromIndex) + 1 || len);
        a.length = fromIndex < 0 ? len + fromIndex : fromIndex;
        a.push.apply(a, rest);
    };
    /**
     * @description : replace.
     * @param       : {object} element     , element to be replaced.
     * @param       : {object} withElement , element to replace with.
     * @syntax      : array.replace(element, withElement)
     */
    p.replace = p.replace || function (element, withElement) {
        var i,
            a = this;
        a.each(function (elem, i) {
            if (elem === element) {
                a[i] = withElement;
            }
        });
    };

    /**
     * @description : intersection set of two arrays (this ∩ that)
     * @param       : {array} that, the array to get intersection set with.
     * @return      : {array} result array.
     * @syntax      : array.intersection(that)
     */
    p.intersection = p.intersection || function (that) {
        var a = this,
            resultArr = [];
        a.each(function (element) {
            if (that.hasVal(element) && !resultArr.hasVal(element)) {
                resultArr.push(element);
            }
        });
        return resultArr;
    };
    /**
     * @description : complement set of two arrays (this - that)
     * @param       : {array} that, the array to get complement set with.
     * @return      : {array} result array.
     * @syntax      : array.complement(that)
     */
    p.complement = p.complement || function (that) {
        var a = this,
            resultArr = [];
        a.each(function (element) {
            if (!that.hasVal(element) && !resultArr.hasVal(element)) {
                resultArr.push(element);
            }
        });
        return resultArr;
    };
    /**
     * @description : union set of two arrays (this U that)
     * @param       : {array} that, the array to get union set with.
     * @return      : {array} result array.
     * @syntax      : array.intersection(that)
     */
    p.union = p.union || function (that) {
        return this.concat(that).uniq();
    };
    /**
     * @description : uniq sub array of an array.
     * @return      : {array} result sub array.
     * @syntax      : array.uniq()
     */
    p.uniq = p.uniq || function () {
        var a = this,
            resultArr = [];
        a.each(function (element) {
            if (!resultArr.hasVal(element)) {
                resultArr.push(element);
            }
        });
        return resultArr;
    };
}(BR));
