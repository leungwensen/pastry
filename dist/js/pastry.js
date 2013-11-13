/* pastry v0.0.6
*  https://github.com/leungwensen/pastry
*  Copyright (c) 2013 cookers;  Licensed MIT */

"use strict";

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
        return (value !== null && value !== void 0);
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
        var i, returnValue;

        for (i = 0; i < callbackList.length; i ++) {
            try {
                returnValue = callbackList[i]();
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
    try {
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
    } catch (e) {
    }

    // ready for cooking!
}());



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

(function (PT) {
    var dp = PT.DP,
        f = function (n) {
            return n < 10 ? '0' + n : n;
        },
        lms = function (ms) {
            var str = ms.toString(),
                len = str.length;
            return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
        };
    /**
     * @description : return stringified date according to given pattern.
     * @param       : {string} pattern, defines pattern for stringify.
     * @return      : {string} result string.
     * @syntax      : date.stringf([pattern])
     * @example     : '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{lms}Z' => '2013-10-03T00:57::13.180Z'
     * @example     : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
     * @example     : '{YY}-{M}-{D} {h}:{m}:{s}' => '13-10-3 0:57::13'
     */
    dp.stringf = function (pattern) {
        var y, mo, d, h, mi, s, ms;
        pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';
        return pattern.replace( '{YYYY}', y = PT.S(this.getFullYear())     )
                      .replace( '{MM}'  , f(mo   = this.getMonth() + 1   ) )
                      .replace( '{DD}'  , f(d    = this.getDate()        ) )
                      .replace( '{hh}'  , f(h    = this.getHours()       ) )
                      .replace( '{mm}'  , f(mi   = this.getMinutes()     ) )
                      .replace( '{ss}'  , f(s    = this.getSeconds()     ) )
                      .replace( '{lms}' , lms(ms = this.getMilliseconds()) )
                      .replace( '{YY}'  , y.substring(2) )
                      .replace( '{M}'   , mo )
                      .replace( '{D}'   , d  )
                      .replace( '{h}'   , h  )
                      .replace( '{m}'   , mi )
                      .replace( '{s}'   , s  )
                      .replace( '{ms}'  , ms );
    };
}(PT));

(function (PT) {
    var o = PT.O, op = PT.OP;

    // Javascript 1.5
    /**
     * @description : check if the object has the key
     * @param       : {string} key, key to check
     * @syntax      : object.hasKey(key) || object.has(key)
     */
    op.has = op.hasKey = op.hasOwnProperty;

    // extend of Javascript 1.8.x
    /**
     * @description : Executes a provided function once per object element.
     * @param       : {function} callback , Function to execute for each element.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : object.forEach(callback[, thisObj]) || object.each(callback[, thisObj])
     */
    op.each = op.forEach = op.forEach || function (callback, thisObj) {
        var key,
            obj = this;
        for (key in obj){
            if (obj.has(key)) {
                callback.call(thisObj, obj[key], key, obj);
            }
        }
    };
    /**
     * @description : returns an array whose elements are strings corresponding to the enumerable properties found directly upon object.
     * @param       : {object} obj, Object to get keys from.
     * @syntax      : o.keys(obj)
     */
    o.keys = o.keys || function (obj) {
        var key,
            result = [];
        if (PT.isFunc(obj)) {
            obj.each(function (value, key) {
                if (key !== 'prototype') {
                    result.push(key);
                }
            });
        } else {
            obj.each(function (value, key) {
                result.push(key);
            });
        }
        return result;
    };

    // extend of pastry
    /**
     * @description : returns keys of an object
     * @syntax      : object.keys()
     */
    op.keys = function () {
        return o.keys(this);
    };
    /**
     * @description : returns an array whose elements are values of the object.
     * @param       : {object} obj, Object to get values from.
     * @syntax      : o.values(obj)
     */
    o.values = function (obj) {
        var values = [];
        obj.each(function (value) {
            values.push(value);
        });
        return values;
    };
    /**
     * @description : returns values of an object
     * @syntax      : object.values()
     */
    op.values = function () {
        return o.values(this);
    };
    /**
     * @description : check if the object has the value
     * @param       : {unknown} value, value to check.
     * @syntax      : object.hasValue(value) || object.hasVal(value)
     */
    op.hasVal = op.hasValue = function (value) {
        return (this.values().indexOf(value) > -1);
    };

    /**
     * @description : merge another object
     * @param       : {object} that, object to merge with.
     * @syntax      : object.merge(that)
     */
    op.merge = function (that) {
        var result = {};
        this.each(function (value, key) {
            result[key] = value;
        });
        that.each(function (value, key) {
            result[key] = value;
        });
        return result;
    };

}(PT));

(function (PT) {
    var np = PT.NP;

    /**
     * @description : return stringified number according to given pattern.
     * @param       : {object} option, defines pattern for stringify.
     * @example     : {"comma": "1|0", "decimal": ">=0", "integer" : ">=0", "zero": "1|0"}
     * @return      : {string} result string.
     * @syntax      : number.stringf([option])
     */
    np.stringf = function (option) {
        var i, len, placeHolder,
            str = this.toString(),
            strArr = str.split('.');
        option = option || {
            'comma'   : 1,
            'decimal' : 2,
            'integer' : 5,
            'zero'    : 0
        };
        placeHolder = (option.has('zero') && option.zero > 0) ? '0' : ' ';
        if (option.has('decimal') && option.decimal > 0) {
            strArr[1] = strArr[1] || '';
            strArr[1] = strArr[1].slice(0, option.decimal);
            len = option.decimal - strArr[1].length;
            for (i = 0; i < len; i ++) {
                strArr[1] += '0';
            }
        }
        if (option.has('integer') && option.integer > 0) {
            len = option.integer - strArr[0].length;
            for (i = 0; i < len; i ++) {
                strArr[0] = placeHolder + strArr[0];
            }
        }
        if (option.has('comma') && option.comma !== 0) {
            strArr[0] = strArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        if (strArr[1] !== '') {
            return strArr.join('.');
        }
        return strArr[0];
    };
}(PT));


(function (PT) {
    var ap = PT.AP;

    // extend of Javascript 1.6
    /**
     * @description : Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @param       : {object} searchElement , Element to locate in the array.
     * @param       : {number} fromIndex     , The index to start the search at. Default: 0 (Entire array is searched).
     * @return      : {number} index of element.
     * @syntax      : array.indexOf(searchElement[, fromIndex])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    ap.indexOf = ap.indexOf || function (searchElement, fromIndex) {
        var i,
            a = this,
            len = a.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (!PT.isDef(fromIndex)) {
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
    ap.lastIndexOf = ap.lastIndexOf || function (searchElement, fromIndex) {
        var i,
            a = this,
            len = a.length >>> 0;
        if (len === 0) {
            return -1;
        }
        if (!PT.isDef(fromIndex)) {
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
    ap.every = ap.every || function (callback, thisObj) {
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
    ap.filter = ap.filter || function (callback, thisObj) {
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
    // see pastry.object.js: object.forEach || object.each
    /**
     * @description : Creates a new array with the results of calling a provided function on every element in this array.
     * @param       : {function} callback , Function that produces an element of the new Array from an element of the current one.
     * @param       : {object  } thisObj  , Object to use as this when executing callback.
     * @return      : {array   } result array.
     * @syntax      : array.map(callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     */
    ap.map = ap.map || function(callback, thisObj) {
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
    ap.some = ap.some || function (callback, thisObj) {
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
    ap.reduce = ap.reduce || function (callback, thisObj) {
        var i, value,
            a = this,
            isValueSet = false;
        if (PT.isDef(thisObj)) {
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
    ap.reduceRight = ap.reduceRight || function (callback, thisObj) {
        var i, value,
            a = this,
            isValueSet = false;
        if (PT.isDef(thisObj)) {
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

    // extend of pastry
    /**
     * @description : binarySearch.
     * @param       : {object  } element     , element to be searched.
     * @param       : {function} compareFunc , compare function executed when searching.
     * @return      : {number  } result index.
     * @syntax      : array.binarySearch(element, compareFunc)
     */
    ap.binarySearch = function (element, compareFunc) {
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
    ap.remove = function (fromIndex, toIndex) {
        var rest,
            a = this,
            len = a.length;
        if (!PT.isDef(fromIndex)) {
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
    ap.replace = function (element, withElement) {
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
    ap.intersection = function (that) {
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
    ap.complement = function (that) {
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
    ap.union = function (that) {
        return this.concat(that).uniq();
    };
    /**
     * @description : uniq sub array of an array.
     * @return      : {array} result sub array.
     * @syntax      : array.uniq()
     */
    ap.uniq = function () {
        var a = this,
            resultArr = [];
        a.each(function (element) {
            if (!resultArr.hasVal(element)) {
                resultArr.push(element);
            }
        });
        return resultArr;
    };
}(PT));

(function (PT) {
    PT.JSON = PT.tryAny([
            function () { return JSON;         },
            function () { return PT.OVEN.JSON; }
        ]);
    if (PT.isDef(PT.JSON)) {
        return;
    }

    var D2JSON = PT.DP.toJSON,
        S = PT.S;
    if (!PT.isFunc(D2JSON)) {
        [PT.SP, PT.NP, PT.BP].each(function (p) {
            p.toJSON = function () {
                return this.valueOf();
            };
        });
        D2JSON = function () {
            return isFinite(this.valueOf()) ? this.stringf('{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
        };
    }

    var gap, indent, rep, J = PT.JSON,
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        quote = function (string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return PT.isStr(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },
        str = function (key, holder) {
            var i, k, v, partial,
                mind = gap,
                value = holder[key];
            if (value && PT.isObj(value) && PT.isFunc(value.toJSON)) {
                value = value.toJSON(key);
            }
            if (PT.isFunc(rep)) {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    return isFinite(value) ? S(value) : 'null';
                case 'boolean':
                case 'null':
                    return S(value);
                case 'object':
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (PT.OP.toString.apply(value) === '[object Array]') {
                        for (i = 0; i < value.length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = (partial.length === 0) ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && PT.isObj(rep)) {
                        rep.each(function (element) {
                            if (PT.isStr(element)) {
                                k = element;
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        });
                    } else {
                        value.each(function (element, k) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        });
                    }
                    v = (partial.length === 0) ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

    /**
     * @description : stringify a JSON object.
     * @param       : {unknown} value, value to be stringified
     * @return      : {string } result string.
     * @syntax      : PT.JSON.stringify(value).
     */
    J.stringify = function (value, replacer, space) {
        var i;
        gap = '';
        indent = '';
        rep = replacer;

        if (PT.isNum(space)) {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (PT.isStr(space)) {
            indent = space;
        }
        rep = replacer;
        if (replacer && !PT.isFunc(replacer) && (!PT.isObj(replacer) || !PT.isNum(replacer.length))) {
            throw new Error('JSON.stringify');
        }
        return str('', {'': value});
    };

    /**
     * @description : parse a string to JSON object
     * @param       : {string } string, string to parse
     * @return      : {unknown} result object.
     * @syntax      : PT.JSON.parse(string).
     */
    J.parse = function (text, reviver) {
        var j;
        function walk(holder, key) {
            var k, v,
                value = holder[key];
            if (value && PT.isObj(value)) {
                value.each(function (element, k) {
                    v = walk(value, k);
                    if (PT.isDef(v)) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                });
            }
            return reviver.call(holder, key, value);
        }
        text = S(text);
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
            return PT.isFunc(reviver) ? walk({'': j}, '') : j;
        }
        throw new SyntaxError('JSON.parse');
    };
}(PT));

(function (PT) {
    var matched,
        win     = PT.ON,
        process = win.process   || {},
        nav     = win.navigator || {},
        plStr   = nav.platform,
        plugs   = nav.plugins,
        uaStr   = nav.userAgent;

    /*
     * @description : init PT.PL | PT.PLUG | PT.VER for current enviroment
     * @syntax      : PT.initUA()
     */
    PT.initUA = function () {
        /*
         * @description : platform
         * @alias       : PT.platform
         * @syntax      : PT.PL
         */
        /*
         * @description : plugins
         * @alias       : PT.plugins
         * @syntax      : PT.PLUG
         */
        /*
         * @description : versions of browser or nodejs
         * @alias       : PT.versions
         * @syntax      : PT.VER
         */
        /*
         * @description : host of the window
         * @syntax      : PT.HOST
         */
        /*
         * @description : document of the window
         * @syntax      : PT.DOC
         */
        /*
         * @description : userAgent of the browser
         * @alias       : PT.userAgent
         * @syntax      : PT.UA
         */

        if (PT.NODEJS) {
            PT.VER  = PT.versions = process.versions;
        } else {
            PT.HOST = win.location.host;
            PT.DOC  = win.document;
            PT.UA   = PT.userAgent = uaStr;
            PT.PL   = PT.platform  = PT.detectPL(plStr);
            PT.PLUG = PT.plugins   = PT.detectPLUG(plugs);
            PT.VER  = PT.versions  = PT.detectVER(uaStr);
        }
    };

    function setVerInt(versions, key, strVal) {
        versions[key] = PT.toInt(strVal);
    }
    function setVer(versions, str, reg) {
        matched = str.match(reg);
        if (matched) {
            setVerInt(versions, matched[0].match(/\w*/)[0], matched[1] || 0);
        }
    }

    /*
     * @description : detect platform
     * @param       : {string} platformStr, platform defined string.
     * @syntax      : PT.detectPL(platformStr)
     * @return      : {string} platform. (mac|windows|linux...)
     */
    PT.detectPL = function (str) {
        if (!PT.isDef(str)) {
            return;
        }
        return str.lc().match(/mac|windows|linux|ipad|ipod|iphone|android/)[0] || 'unknown';
    };

    /*
     * @description : detect plugins (now flash only)
     * @param       : {array } plugins, plugin list
     * @syntax      : PT.detectPLUG(plugins)
     * @return      : {object} { 'flash' : 0|xx }
     */
    PT.detectPLUG = function (arr) {
        return {
            flash: (function () {
                var flash,
                    v      = 0,
                    startV = 13;
                if (arr && arr.length) {
                    flash = arr['Shockwave Flash'];
                    if (flash && flash.description) {
                        v = flash.description.match(/\b(\d+)\.\d+\b/)[1] || v;
                    }
                } else {
                    while (startV --) {
                        try {
                            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startV);
                            v = startV;
                            break;
                        } catch(e) {}
                    }
                }
                return PT.toInt(v);
            }())
        };
    };

    /*
     * @description : detect versions (nodejs: v8 version, node version ,.. ; browsers: browser version, platform version, ...)
     * @param       : {string} userAgent, window.navigator.userAgent
     * @syntax      : PT.detectVer(userAgent)
     * @return      : {object} { 'flash' : 0|xx }
     */
    PT.detectVER = function (str) {
        if (!PT.isDef(str)) {
            return;
        }
        str = str.lc();
        var ieVer,
            versions = {};

        // browser versions
        [
            /msie ([\d.]+)/     ,
            /firefox\/([\d.]+)/ ,
            /chrome\/([\d.]+)/  ,
            /crios\/([\d.]+)/   ,
            /opera.([\d.]+)/    ,
            /adobeair\/([\d.]+)/
        ].each(function (reg) {
            setVer(versions, str, reg);
        });
        // chrome
        if (versions.crios) {
            versions.chrome = versions.crios;
        }
        // safari version
        matched = str.match(/version\/([\d.]+).*safari/);
        if (matched) {
            setVerInt(versions, 'safari', matched[1] || 0);
        }
        // mobile safari version
        matched = str.match(/version\/([\d.]+).*mobile.*safari/);
        if (matched) {
            setVerInt(versions, 'mobilesafari', matched[1] || 0);
        }

        // engine versions
        [
            /trident\/([\d.]+)/     ,
            /gecko\/([\d.]+)/       ,
            /applewebkit\/([\d.]+)/ ,
            /presto\/([\d.]+)/
        ].each(function (reg) {
            setVer(versions, str, reg);
        });
        ieVer = versions.msie;
        if (ieVer) {
            switch (true) {
                case (ieVer === 6):
                    versions.trident = 4;
                    break;
                case (ieVer === 7 || ieVer === 8):
                    versions.trident = 5;
                    break;
            }
        }

        return versions;
    };

    PT.initUA();
}(PT));

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var unescape = function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        },
        escape   = encodeURIComponent;

    PT.QueryStr = {
        /*
         * @description : override default encoding method
         * @syntax      : PT.QueryStr.escape(str)
         * @param       : {String} str, unescaped string.
         * @return      : {String} escaped string.
         */
        escape   : escape,

        /*
         * @description : override default decoding method
         * @syntax      : PT.QueryStr.unescape(str)
         * @param       : {String} str, escaped string.
         * @return      : {String} unescaped string.
         */
        unescape : unescape,

        /*
         * @description : accept query strings and return native javascript objects.
         * @syntax      : PT.QueryStr.parse(str)
         * @param       : {String} str, query string to be parsed.
         * @return      : {Object} parsed object.
         */
        parse : function (qs, sep, eq) {
            sep = sep || "&";
            eq  = eq  || "=";
            var tuple,
                obj = {},
                pieces = qs.split(sep);

            pieces.each(function (elem) {
                tuple = elem.split(eq);
                if (tuple.length > 0) {
                    obj[unescape(tuple.shift())] = unescape(tuple.join(eq));
                }
            });
            return obj;
        },

        /*
         * @description : converts an arbitrary value to a query string representation.
         * @syntax      : PT.QueryStr.stringify(obj)
         * @param       : {object} obj, object to be stringified
         * @return      : {String} query string.
         */
        stringify : function (obj, c) {
            var qs = [],
                s = c && c.arrayKey ? true : false;

            obj.each(function (value, key) {
                if (PT.isArr(value)) {
                    value.each(function (elem) {
                        qs.push(escape(s ? key + '[]' : key) + '=' + escape(elem));
                    });
                }
                else {
                    qs.push(escape(key) + '=' + escape(value));
                }
            });
            return qs.join('&');
        }
    };
}(PT));

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    /*
     * @description : XMLHttpRequest Object
     * @syntax      : PT.getXHR()
     */
    PT.getXHR = function () {
        return PT.tryAny([
            function () { return new XMLHttpRequest();                   },
            function () { return new ActiveXObject('MSXML2.XMLHTTP');    },
            function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
        ]);
    };

    /*
     * @description : ajax.
     * @syntax      : PT.ajax(uri[, option])[.error(callback)][.success(callback)]..
     * @param       : {String} uri, uri.
     * @param       : {Object} option, option.
     * @return      : {this  } return itself for chain operations.
     */
    PT.ajax = function (uri, option) {
        option = option || {};
        var xhr         = PT.getXHR(),
            method      = option.method ? option.method.uc()                 : 'GET',
            type        = option.type   ? option.type.lc()                   : 'xml',
            data        = option.data   ? PT.QueryStr.stringify(option.data) : null,
            contentType = option.contentType,
            isAsync     = option.isAsync;

        /*
         * @description : event handlers.
         * @syntax      : PT.ajax(uri[, option]).xxx(callback)..
         * @param       : {Function} callback, callback function.
         */
        /*
         * @syntax : PT.ajax(uri[, option]).abort(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).error(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).load(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).loadend(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).loadstart(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).progress(callback)..
         */
        /*
         * @description : success event handler
         * @syntax      : PT.ajax(uri[, option]).success(callback)..
         */
        /*
         * @syntax : PT.ajax(uri[, option]).timeout(callback)..
         */
        [
            'abort'     ,
            'error'     ,
            'load'      ,
            'loadend'   ,
            'loadstart' ,
            'progress'  ,
            'success'   ,
            'timeout'
        ].each(function (handler) {
            if (option[handler]) {
                xhr['on' + handler] = option[handler];
            }
        });

        /*
         * @description : is ajax request success
         * @syntax      : $PT.ajax.isSuccess()
         * @return      : {Boolean} is ajax request successfully porformed
         */
        xhr.isSuccess = function () {
            return (xhr.status >= 200 && xhr.status < 300)                        ||
                   (xhr.status === 304)                                           ||
                   (!xhr.status && PT.ON.location.protocol === 'file:') ||
                   (!xhr.status && PT.VER.safari);
        };

        xhr.onreadystatechange = function (){
            if (xhr.readyState === 4) {
                if (xhr.isSuccess() && option.success) {
                    var response = xhr.responseText;
                    xhr.onsuccess(type === 'json' ? PT.JSON.parse(response) : response);
                } else if (option.error) {
                    xhr.onerror(xhr.statusText);
                }
            }
        };

        // progress ajax
        if (method === 'GET') {
            if (data) {
                uri += (uri.has('?') ? '&' : '?') + data;
            }
            xhr.open(method, uri, isAsync);
            xhr.setRequestHeader(
                    'Content-Type',
                    contentType || 'text/plain;charset=UTF-8'
                );
        } else if (method === 'POST'){
            xhr.open(method, uri, isAsync);
            xhr.setRequestHeader(
                    'Content-Type',
                    contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
                );
        } else {
            xhr.open(method, uri, isAsync);
        }
        xhr.send(data);
    };

    [
        'get' ,
        'post'
    ].each(function (method) {
        PT[method] = function (uri, option) {
            option.method = method;
            PT.ajax(uri, option);
        };
    });
}(PT));
