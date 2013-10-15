/* brick v0.0.0
*  https://github.com/leungwensen/brick
*  Copyright (c) 2013 BR builders;  Licensed MIT */

"use strict";

var BRICK, BR;
BRICK = BR = {};
(function () {
    // getting the environment
    /*
     * @syntax : BR.GROUND
     */
    BR.GROUND = BR.GROUND || this;
}());

(function (BR) {
    BR.origin = BR.origin || {};

    /*
     * @param  : {array  } callbackList, list of callback functions.
     * @return : {unknown} value the callback functions try to return.
     * @syntax : BR.origin.tryOneOf(callbackList)
     */
    BR.origin.tryOneOf = BR.origin.tryOneOf || function (callbackList) {
        var i, callback, returnValue;

        for (i = 0; i < callbackList.length; i ++) {
            callback = callbackList[i];
            try {
                returnValue = callback();
                break;
            } catch (e) {
            }
        }
        return returnValue;
    };
}(BR));

(function (BR) {
    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {unknown} value, value to be tested.
     * @return      : {boolean} if test succeeded.
     * @syntax      : BR.isXxx(value)
     */

    /**
     * @syntax : BR.isDefined(value)
     */
    BR.isDefined = BR.isDefined || function (value) {
        return (typeof value !== 'undefined');
    };
    /**
     * @syntax : BR.isUndefined(value)
     */
    BR.isUndefined = BR.isUndefined || function (value) {
        return (typeof value === 'undefined');
    };

    /**
     * @syntax : BR.isFunction(value)
     */
    BR.isFunction = BR.isFunction || function (value) {
        return (typeof value === 'function');
    };

    /**
     * @syntax : BR.isFunction(value)
     */
    BR.isNumber = BR.isNumber || function (value) {
        return (typeof value === 'number');
    };

    /**
     * @syntax : BR.isObject(value)
     */
    BR.isObject = BR.isObject || function (value) {
        return (typeof value === 'object');
    };

    /**
     * @syntax : BR.isString(value)
     */
    BR.isString = BR.isString || function (value) {
        return (typeof value === 'string');
    };

    // extend of Javascript 1.8.5
    /**
     * @syntax     : BR.isArray(value)
     * @refference : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
     */
    BR.isArray = BR.isArray || Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };

}(BR));

(function (BR) {
    BR.array = BR.array || Array;

    // extend of Javascript 1.6
    /**
     * @description : Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @param       : {object} searchElement , Element to locate in the array.
     * @param       : {number} fromIndex     , The index to start the search at. Default: 0 (Entire array is searched).
     * @return      : {number} index of element.
     * @syntax      : array.indexOf(searchElement[, fromIndex])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    BR.array.prototype.indexOf = BR.array.prototype.indexOf || function (searchElement, fromIndex) {
        var i,
            len = this.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (BR.isUndefined(fromIndex)) {
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
     * @param       : {object} searchElement , Element to locate in the array.
     * @param       : {number} fromIndex     , The index at which to start searching backwards. Defaults to the array's length.
     * @return      : {number} index of element.
     * @syntax      : array.lastIndexOf(searchElement[, fromIndex])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
     */
    BR.array.prototype.lastIndexOf = BR.array.prototype.lastIndexOf || function (searchElement, fromIndex) {
        var i,
            len = this.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (BR.isUndefined(fromIndex)) {
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
     * @param       : {function} callback , Function to test for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {boolean } if test succeeded or not.
     * @syntax      : array.every(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     */
    BR.array.prototype.every = BR.array.prototype.every || function (callback, thisObj) {
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
     * @param       : {function} callback , Function to test each element of the array.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {array   } result array.
     * @syntax      : array.filter(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    BR.array.prototype.filter = BR.array.prototype.filter || function (callback, thisObj) {
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
     * @param       : {function} callback , Function to execute for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : array.forEach(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    BR.array.prototype.forEach = BR.array.prototype.forEach || function(callback, thisObj) {
        var i,
            len = this.length >>> 0;
        for (i = 0; i < len; i ++) {
            if (this.hasOwnProperty(i)) {
                callback.call(thisObj, this[i], i, this);
            }
        }
    };
    // alias
    BR.array.prototype.each = BR.array.prototype.each || BR.array.prototype.forEach;
    /**
     * @description : Creates a new array with the results of calling a provided function on every element in this array.
     * @param       : {function} callback , Function that produces an element of the new Array from an element of the current one.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {array   } result array.
     * @syntax      : array.map(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     */
    BR.array.prototype.map = BR.array.prototype.map || function(callback, thisObj) {
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
     * @param       : {function} callback , Function to test for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {boolean } if test succeeded or not.
     * @syntax      : array.some(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    BR.array.prototype.some = BR.array.prototype.some || function (callback, thisObj) {
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
    BR.array.prototype.reduce = BR.array.prototype.reduce || function (callback, thisObj) {
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
     * @param       : {function} callback , Function to execute on each value in the array.
     * @param       : {object  } thisObj  , Object to use as the first argument to the first call of the callback.
     * @return      : {object  } result value.
     * @syntax      : array.reduceRight(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight
     */
    BR.array.prototype.reduceRight = BR.array.prototype.reduceRight || function (callback, thisObj) {
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
     * @param       : {object  } element     , element to be searched.
     * @param       : {function} compareFunc , compare function executed when searching.
     * @return      : {number  } result index.
     * @syntax      : array.binarySearch(element, compareFunc)
     */
    BR.array.prototype.binarySearch = BR.array.prototype.binarySearch || function (element, compareFunc) {
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
     * @param       : {number} fromIndex , index to remove from.
     * @param       : {number} toIndex   , index to remove to.
     * @syntax      : array.remove([fromIndex[, toIndex]])
     * @refference  : Array Remove - By John Resig (MIT Licensed)
     */
    BR.array.prototype.remove = BR.array.prototype.remove || function (fromIndex, toIndex) {
        if (BR.isUndefined(fromIndex)) {
            return this;
        }
        var rest = this.slice((toIndex || fromIndex) + 1 || this.length);
        this.length = fromIndex < 0 ? this.length + fromIndex : fromIndex;
        this.push.apply(this, rest);
    };
    /**
     * @description : replace.
     * @param       : {object} element     , element to be replaced.
     * @param       : {object} withElement , element to replace with.
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
     * @param       : {object } element, element to be tested.
     * @return      : {boolean} if array has the element.
     * @syntax      : array.hasElement(element)
     */
    BR.array.prototype.hasElement = BR.array.prototype.hasElement || function (element) {
        return (this.indexOf(element) > -1);
    };
    /**
     * @description : intersection set of two arrays (this ∩ that)
     * @param       : {array} that, the array to get intersection set with.
     * @return      : {array} result array.
     * @syntax      : array.intersection(that)
     */
    BR.array.prototype.intersection = BR.array.prototype.intersection || function (that) {
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
     * @param       : {array} that, the array to get complement set with.
     * @return      : {array} result array.
     * @syntax      : array.complement(that)
     */
    BR.array.prototype.complement = BR.array.prototype.complement || function (that) {
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
     * @param       : {array} that, the array to get union set with.
     * @return      : {array} result array.
     * @syntax      : array.intersection(that)
     */
    BR.array.prototype.union = BR.array.prototype.union || function (that) {
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

(function (BR) {
    BR.bool = BR.bool || Boolean;
}(BR));

(function (BR) {
    BR.number = BR.number || Number;

    /**
     * @description : return stringified number according to given pattern.
     * @param       : {object} option, defines pattern for stringify.
     * @example     : {"comma": "1|0", "decimal": ">=0", "integer" : ">=0", "zero": "1|0"}
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
        placeHolder = (option.hasOwnProperty('zero') && option.zero > 0) ? '0' : ' ';
        if (option.hasOwnProperty('decimal') && option.decimal > 0) {
            strArr[1] = strArr[1] || '';
            strArr[1] = strArr[1].slice(0, option.decimal);
            len = option.decimal - strArr[1].length;
            for (i = 0; i < len; i ++) {
                strArr[1] += '0';
            }
        }
        if (option.hasOwnProperty('integer') && option.integer > 0) {
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

(function (BR) {
    BR.date = BR.date || Date;

    var padZero = function (n) {
        return (n < 10 ? '0' : '') + n;
    };
    /**
     * @description : return stringified date according to given pattern.
     * @param       : {string} pattern, defines pattern for stringify.
     * @return      : {string} result string.
     * @syntax      : date.toFormatString([pattern])
     * @example     : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
     * @example     : '{YY}-{M}-{D} {h}:{m}:{s}'        => '2013-10-3 0:57::13'
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
                      .replace( '{M}'   , mo )
                      .replace( '{D}'   , d  )
                      .replace( '{h}'   , h  )
                      .replace( '{m}'   , mi )
                      .replace( '{s}'   , s  );
    };
}(BR));

(function (BR) {
    BR.string = BR.string || String;

    // extend of Javascript 1.8.1
    /**
     * @description : Removes whitespace from both ends of the string.
     * @return      : {string} result string.
     * @syntax      : string.trim()
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
     */
    BR.string.prototype.trim = BR.string.prototype.trim || function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}(BR));

(function (BR) {
    BR.object = BR.object || Object;

    // extend of Javascript 1.8.x
    /**
     * @description : Executes a provided function once per object element.
     * @param       : {function} callback , Function to execute for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : object.forEach(callback[, thisObj])
     */
    BR.object.prototype.forEach = BR.object.prototype.forEach || function (callback, thisObj) {
        var key;
        for (key in this){
            if (this.hasOwnProperty(key)) {
                callback.call(thisObj, this[key], key, this);
            }
        }
    };
    // alias
    BR.object.prototype.each = BR.object.prototype.each || BR.object.prototype.forEach;
    /**
     * @description : returns an array whose elements are strings corresponding to the enumerable properties found directly upon object.
     * @param       : {object} obj, Object to get keys from.
     * @syntax      : BR.object.keys(obj)
     */
    BR.object.keys = BR.object.keys || function (obj) {
        var i, key,
            keys = [];
        if (BR.isFunction(obj)) {
            for (key in obj) {
                if (obj.hasOwnProperty(key) && key !== 'prototype') {
                    keys.push(key);
                }
            }
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        return keys;
    };

    // extend of Brick
    /**
     * @description : returns keys of an object
     * @syntax      : object.keys()
     */
    BR.object.prototype.keys = BR.object.prototype.keys || function () {
        return Object.keys(this);
    };
    /**
     * @description : returns an array whose elements are values of the object.
     * @param       : {object} obj, Object to get values from.
     * @syntax      : BR.object.values(obj)
     */
    BR.object.values = BR.object.values || function (obj) {
        var i,
            keys = BR.object.keys(obj),
            len = keys.length,
            values = [];
        for (i = 0; i < len; i ++) {
            values.push(obj[keys[i]]);
        }
        return values;
    };
    /**
     * @description : returns values of an object
     * @syntax      : object.values()
     */
    BR.object.prototype.values = BR.object.prototype.values || function () {
        return Object.values(this);
    };
    /**
     * @description : check if the object has the key
     * @param       : {string} key, key to check
     * @syntax      : object.hasKey(key)
     */
    BR.object.prototype.hasKey = BR.object.prototype.hasKey || function (key) {
        return this.hasOwnProperty(key);
    };
    /**
     * @description : check if the object has the value
     * @param       : {unknown} value, value to check.
     * @syntax      : object.hasValue(value)
     */
    BR.object.prototype.hasValue = BR.object.prototype.hasValue || function (value) {
        return (this.values().indexOf(value) > -1);
    };
}(BR));

(function (BR) {
    BR.JSON = BR.JSON || {};
    var _originJSON = BR.origin.tryOneOf([
            function () { return JSON; },
            function () { return BR.GROUND.JSON; }
        ]);
    if (BR.isDefined(_originJSON)) {
        BR.JSON = _originJSON;
        return;
    }

    var gap, indent, rep,
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        _toJSON = function () {
            return this.valueOf();
        },
        quote = function (string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return BR.isString(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },
        str = function (key, holder) {
            var i, k, v, length, partial,
                mind = gap,
                value = holder[key];
            if (value && BR.isObject(value) && BR.isFunction(value.toJSON)) {
                value = value.toJSON(key);
            }
            if (BR.isFunction(rep)) {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    return isFinite(value) ? String(value) : 'null';
                case 'boolean':
                case 'null':
                    return String(value);
                case 'object':
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = (partial.length === 0) ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && BR.isObject(rep)) {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (BR.isString(rep[i])) {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = (partial.length === 0) ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

    String.prototype.toJSON  = String.prototype.toJSON  || _toJSON;
    Number.prototype.toJSON  = Number.prototype.toJSON  || _toJSON;
    Boolean.prototype.toJSON = Boolean.prototype.toJSON || _toJSON;
    Date.prototype.toJSON    = Date.prototype.toJSON    || function () {
        return isFinite(this.valueOf()) ? this.toFormatString('{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
    };

    /**
     * @description : stringify a JSON object.
     * @param       : {unknown} value, value to be stringified
     * @return      : {string } result string.
     * @syntax      : BR.JSON.stringify(value).
     */
    BR.JSON.stringify = BR.JSON.stringify || function (value, replacer, space) {
        var i;
        gap = '';
        indent = '';
        rep = replacer;

        if (BR.isNumber(space)) {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (BR.isString(space)) {
            indent = space;
        }
        if (replacer && !BR.isFunction(replacer) && (!BR.isObject(replacer) || !BR.isNumber(replacer.length))) {
            throw new Error('JSON.stringify');
        }
        return str('', {'': value});
    };

    /**
     * @description : parse a string to JSON object
     * @param       : {string } string, string to parse
     * @return      : {unknown} result object.
     * @syntax      : BR.JSON.parse(string).
     */
    BR.JSON.parse = BR.JSON.parse || function (text, reviver) {
        var j,
            walk = function (holder, key) {
                var k, v,
                    value = holder[key];
                if (value && BR.isObject(value)) {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            };
        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                                     .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                                     .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            /* jshint -W061 */ j = eval('(' + text + ')');
            return (BR.isFunction(reviver)) ? walk({'': j}, '') : j;
        }
        throw new SyntaxError('JSON.parse');
    };
}(BR));
