/* pastry v0.1.0
*  https://github.com/leungwensen/pastry
*  Copyright (c) 2013 cookers;  Licensed MIT */

"use strict";

var PASTRY, PT;
PASTRY  = PT = {};
/* jshint -W040 */PT.OVEN  = PT.ON = this;

(function (PT) {
    /*
     * @description : alias
     */
    var A  = PT.A  = Array       ,
        B  = PT.B  = Boolean     ,
        D  = PT.D  = Date        ,
        F  = PT.F  = Function    ,
        N  = PT.N  = Number      ,
        O  = PT.O  = Object      ,
        S  = PT.S  = String      ,

        PS = PT.PS = 'prototype' ,
        US = PT.US = 'undefined' ,

        AP = PT.AP = A[PS]       ,
        BP = PT.BP = B[PS]       ,
        DP = PT.DP = D[PS]       ,
        FP = PT.FP = F[PS]       ,
        NP = PT.NP = N[PS]       ,
        OP = PT.OP = O[PS]       ,
        SP = PT.SP = S[PS]       ,

        toStr = PT.toStr = function (value) {
            return OP.toString.call(value);
        };

    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {Unknown} value, value to be tested.
     * @return      : {Boolean} if test succeeded.
     * @syntax      : PT.isXxx(value)
     */
    PT.isBool   = function (value) { return (typeof value === 'boolean');                   };
    PT.isFunc   = function (value) { return (typeof value === 'function');                  };
    PT.isNum    = function (value) { return (typeof value === 'number');                    };
    PT.isStr    = function (value) { return (typeof value === 'string');                    };
    PT.isDef    = function (value) { return (value !== null && value !== void 0);           };
    PT.isObj    = function (value) { return (value !== null && typeof value === 'object');  };
    PT.isDate   = function (value) { return toStr(value) === '[object Date]';               };
    PT.isErr    = function (value) { return toStr(value) === '[object Error]';              };
    PT.isRegExp = function (value) { return toStr(value) === '[object RegExp]';             };
    PT.isArr    = A.isArray || function (value) { return toStr(value) === '[object Array]'; };

    /*
     * @description : try to load original edition of global variables
     * @param       : {array  } callbackList, list of callback functions.
     * @return      : {unknown} value the callback functions try to return.
     * @syntax      : PT.tryEach(callbackList) || PT.tryEach(callbackList)
     */
    PT.tryAny = function (callbackList) {
        var i, returnValue;

        for (i = 0; i < callbackList.length; i ++) {
            try {
                returnValue = callbackList[i]();
                break;
            } catch (e) {}
        }
        return returnValue;
    };
    /*
     * @description : the environment global variable.
     * @syntax      : PT.OVEN
     * @return      : {browser} window.
     * @return      : {nodejs } exports.
     */
    if (typeof exports !== US) {
        if (typeof module !== US && module.exports) {
            exports = module.exports = PT;
        }
        exports.PASTRY = exports.PT = PT;
        PT.NODEJS      = true;
        PT.ON.process  = process;
    } else {
        PT.ON.PASTRY = PT.ON.PT = PT;
        PT.BROWSER   = true;
    }

    // extend of Javascript 1.6
    /**
     * @description : Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @param       : {Array } arr           , Array to be searched from.
     * @param       : {Object} searchElement , Element to locate in the array.
     * @param       : {Number} fromIndex     , The index to start the search at. Default: 0 (Entire array is searched).
     * @return      : {Number} index of element.
     * @syntax      : PT.indexOf(arr, searchElement[, fromIndex])
     * @refference  : javascript 1.6
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    PT.indexOf = function (arr, searchElement, fromIndex) {
        fromIndex = fromIndex || 0;
        if (AP.indexOf) {
            return arr.indexOf(searchElement, fromIndex);
        }
        var i,
            len = arr.length >>> 0;
        if (len === 0 || fromIndex >= len) {
            return -1;
        }
        for (i = fromIndex >= 0 ? fromIndex : Math.max(len - Math.abs(fromIndex), 0); i < len; i ++) {
            if /* jshint -W116 */ (arr[i] == searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @description : Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.
     * @param       : {Array } arr           , Array to be searched from.
     * @param       : {Object} searchElement , Element to locate in the array.
     * @param       : {Number} fromIndex     , The index at which to start searching backwards. Defaults to the array's length.
     * @return      : {Number} index of element.
     * @syntax      : PT.lastIndexOf(arr, searchElement[, fromIndex])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
     */
    PT.lastIndexOf = function (arr, searchElement, fromIndex) {
        if (AP.lastIndexOf) {
            return arr.lastIndexOf(searchElement, fromIndex);
        }
        var i,
            len = arr.length >>> 0;
        if (len === 0) {
            return -1;
        }
        fromIndex = fromIndex || len;
        for (i = fromIndex >= 0 ? Math.min(fromIndex, len - 1) : len - Math.abs(fromIndex); i >= 0; i --) {
            if /* jshint -W116 */ (arr[i] == searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @description : Tests whether all elements in the array pass the test implemented by the provided function.
     * @param       : {Array   } arr      , array to test.
     * @param       : {Function} callback , Function to test for each element.
     * @param       : {Object  } thisObj  , Object to use as this when executing callback.
     * @return      : {Boolean } if test succeeded or not.
     * @syntax      : PT.every(arr, callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     */
    PT.every = function (arr, callback, thisObj) {
        if (AP.every) {
            return arr.every(callback, thisObj);
        }
        var i;
        for (i = 0; i < arr.length; i ++) {
            if (!callback.call(thisObj, arr[i], i, arr)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @description : Creates a new array with all elements that pass the test implemented by the provided function.
     * @param       : {Array   } arr      , array to execute function with.
     * @param       : {Function} callback , Function to test each element of the array.
     * @param       : {Object  } thisObj  , Object to use as this when executing callback.
     * @return      : {Array   } result array.
     * @syntax      : PT.filter(arr, callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    PT.filter = function (arr, callback, thisObj) {
        if (AP.filter) {
            return arr.filter(callback, thisObj);
        }
        var res = [];
        PT.each(arr, function (element, key) {
            if (callback.call(thisObj, element, key, arr)) {
                res.push(element);
            }
        });
        return res;
    };
    /**
     * @description : Creates a new array with the results of calling a provided function on every element in this array.
     * @param       : {Array   } arr      , array to call function with.
     * @param       : {Function} callback , Function that produces an element of the new Array from an element of the current one.
     * @param       : {Object  } thisObj  , Object to use as this when executing callback.
     * @return      : {Array   } result array.
     * @syntax      : PT.map(arr, callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     */
    PT.map = function(arr, callback, thisObj) {
        if (AP.map) {
            return arr.map(callback, thisObj);
        }
        var res = [];
        PT.each(arr, function (element, key) {
            res.push(callback.call(thisObj, element, key, arr));
        });
        return res;
    };
    /**
     * @description : Tests whether some element in the array passes the test implemented by the provided function.
     * @param       : {Array   } arr      , array to test.
     * @param       : {Function} callback , Function to test for each element.
     * @param       : {Object  } thisObj  , Object to use as this when executing callback.
     * @return      : {Boolean } if test succeeded or not.
     * @syntax      : PT.some(arr, callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    PT.some = function (arr, callback, thisObj) {
        if (AP.some) {
            return arr.some(callback, thisObj);
        }
        var i;
        for (i = 0; i < arr.length; i ++) {
            if (callback.call(thisObj, arr[i], i, arr)) {
                return true;
            }
        }
        return false;
    };

    // extend of Javascript 1.8
    /**
     * @description     : Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
     * @param           : {Array   } arr           , array to reduce.
     * @param           : {Function} callback      , Function to execute on each value in the array, taking four arguments:
     * @param           : {Object  } thisObj       , Object to use as the first argument to the first call of the callback.
     * @paramOfCallback : {Object  } previousValue , The value previously returned in the last invocation of the callback, or initialValue, if supplied.
     * @paramOfCallback : {Object  } currentValue  , The current element being processed in the array.
     * @paramOfCallback : {Number  } index         , The index of the current element being processed in the array.
     * @paramOfCallback : {Array   } array         , The array reduce was called upon.
     * @return          : {Object  } result value.
     * @syntax          : PT.reduce(arr, callback[, thisObj])
     * @refference      : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    PT.reduce = function (arr, callback, thisObj) {
        if (AP.reduce) {
            return thisObj ? arr.reduce(callback, thisObj) : arr.reduce(callback);
        }
        var i, value;
        if (thisObj) {
            value = thisObj;
        }
        for (i = 0; i < arr.length; i ++) {
            if (value) {
                value = callback(value, arr[i], i, arr);
            } else {
                value = arr[i];
            }
        }
        return value;
    };
    /**
     * @description : Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.
     * @param       : {Array   } arr      , array to reduce.
     * @param       : {Function} callback , Function to execute on each value in the array.
     * @param       : {Object  } thisObj  , Object to use as the first argument to the first call of the callback.
     * @return      : {Object  } result value.
     * @syntax      : PT.reduceRight(arr, callback[, thisObj])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight
     */
    PT.reduceRight = function (arr, callback, thisObj) {
        if (AP.reduceRight) {
            return thisObj ? arr.reduceRight(callback, thisObj) : arr.reduceRight(callback);
        }
        var i, value;
        if (thisObj) {
            value = thisObj;
        }
        for (i = arr.length - 1; i >= 0; i --) {
            if (value) {
                value = callback(value, arr[i], i, arr);
            } else {
                value = arr[i];
            }
        }
        return value;
    };

    /**
     * @description : check if the object has the key
     * @param       : {Object} obj, object to be checked
     * @param       : {String} key, key to check
     * @syntax      : PT.hasKey(obj, key) || PT.has(obj, key)
     */
    PT.has = PT.hasKey = function (obj, key) {
        return obj.hasOwnProperty(key);
    };

    /**
     * @description : Executes a provided function once per object element.
     * @param       : {Object  } obj      , Object to traversal.
     * @param       : {Function} callback , Function to execute for each element.
     * @param       : {Object  } thisObj  , Object to use as this when executing callback.
     * @syntax      : PT.forEach(obj, callback[, thisObj]) || PT.each(obj, callback[, thisObj])
     */
    PT.each = PT.forEach = function (obj, callback, thisObj) {
        if (OP.forEach) {
            obj.forEach(callback, thisObj);
        } else {
            var key;
            for (key in obj){
                if (PT.has(obj, key)) {
                    callback.call(thisObj, obj[key], key, obj);
                }
            }
        }
    };

    // extend of pastry
    /**
     * @description : binarySearch.
     * @param       : {Array   } arr         , array to be searched from.
     * @param       : {Object  } element     , element to be searched.
     * @param       : {Function} compareFunc , compare function executed when searching.
     * @return      : {Number  } result index.
     * @syntax      : PT.binarySearch(arr, element, compareFunc)
     */
    PT.binarySearch = function (arr, element, compareFunc) {
        var start   = 0,
            end     = arr.length,
            current = Math.floor(end/2);
        while (end !== current) {
            if (compareFunc(element, arr[current]) > 0) {
                start = current + 1;
            } else {
                end = current;
            }
            current = Math.floor((start + end) / 2);
        }
        current = (current === 0 && compareFunc(element, arr[current]) !== 0) ? -1 : current;
        return current;
    };
    /**
     * @description : Remove elements according to the given fromIndex and toIndex, and return the rest array.
     * @param       : {Array } arr       , array to remove from.
     * @param       : {Number} fromIndex , index to remove from.
     * @param       : {Number} toIndex   , index to remove to.
     * @syntax      : PT.remove(arr, [fromIndex[, toIndex]])
     * @refference  : http://ejohn.org/blog/javascript-array-remove/
     */
    PT.remove = function (arr, fromIndex, toIndex) {
        var rest,
            len = arr.length;
        if (!fromIndex || !PT.isNum(fromIndex)) {
            return arr;
        }
        rest = arr.slice((toIndex || fromIndex) + 1 || len);
        arr.length = fromIndex < 0 ? len + fromIndex : fromIndex;
        return arr.push.apply(arr, rest);
    };
    /**
     * @description : replace.
     * @param       : {Array } arr         , array to be replaced.
     * @param       : {Object} element     , element to be replaced.
     * @param       : {Object} withElement , element to replace with.
     * @syntax      : PT.replace(arr, element, withElement)
     */
    PT.replace = function (arr, element, withElement, isGlobal) {
        var isReplaced = false;
        PT.each(arr, function (e, i) {
            if (e === element) {
                arr[i] = withElement;
                isReplaced = true;
                if (isGlobal) {
                    return isReplaced;
                }
            }
        });
        return isReplaced;
    };
    /**
     * @description : intersection set of two arrays (this ∩ that)
     * @param       : {Array} thisArr, the array to get intersection set from.
     * @param       : {Array} thatArr, the array to get intersection set from.
     * @return      : {Array} result array.
     * @syntax      : PT.intersection(thisArr, thatArr)
     */
    PT.intersection = function (thisArr, thatArr) {
        var resultArr = [];
        PT.each(thisArr, function (element) {
            if (PT.hasVal(thatArr, element) && !PT.hasVal(resultArr, element)) {
                resultArr.push(element);
            }
        });
        return resultArr;
    };
    /**
     * @description : complement set of two arrays (this - that)
     * @param       : {Array} thisArr, the array to get complement set from.
     * @param       : {Array} thatArr, the array to get complement set from.
     * @return      : {Array} result array.
     * @syntax      : PT.complement(thisArr, thatArr)
     */
    PT.complement = function (thisArr, thatArr) {
        var resultArr = [];
        PT.each(thisArr, function (element) {
            if (!PT.hasVal(thatArr, element) && !PT.hasVal(resultArr, element)) {
                resultArr.push(element);
            }
        });
        return resultArr;
    };
    /**
     * @description : uniq sub array of an array.
     * @param       : {Array} arr, the array to get a set from.
     * @return      : {Array} result sub array.
     * @syntax      : PT.uniq(arr)
     */
    PT.uniq = function (arr) {
        var resultArr = [];
        PT.each(arr, function (element) {
            if (!PT.hasVal(resultArr, element)) {
                resultArr.push(element);
            }
        });
        return resultArr;
    };
    /**
     * @description : union set of two arrays (this U that)
     * @param       : {Array} thisArr, the array to get union set from.
     * @param       : {Array} thatArr, the array to get union set from.
     * @return      : {Array} result array.
     * @syntax      : PT.union(thisArr, thatArr)
     */
    PT.union = function (thisArr, thatArr) {
        return PT.uniq(thisArr.concat(thatArr));
    };

    /**
     * @description : returns an array whose elements are strings corresponding to the enumerable properties found directly upon object.
     * @param       : {object} obj, Object to get keys from.
     * @syntax      : PT.keys(obj)
     */
    PT.keys = function (obj) {
        if (O.keys) {
            return O.keys(obj);
        }
        var key,
            result = [];
        if (PT.isFunc(obj)) {
            PT.each(obj, function (value, key) {
                if (key !== PS) {
                    result.push(key);
                }
            });
        } else {
            PT.each(obj, function (value, key) {
                result.push(key);
            });
        }
        return result;
    };

    // extend of pastry
    /**
     * @description : returns an array whose elements are values of the object.
     * @param       : {object} obj, Object to get values from.
     * @syntax      : PT.values(obj)
     */
    PT.values = function (obj) {
        var values = [];
        PT.each(obj, function (value) {
            values.push(value);
        });
        return values;
    };
    /**
     * @description : check if the object has the value
     * @param       : {Object } obj  , object to be checked.
     * @param       : {unknown} value, value to check.
     * @syntax      : PT.hasValue(obj, value) || PT.hasVal(obj, value)
     */
    PT.hasVal = PT.hasValue = function (obj, value) {
        return (PT.indexOf(PT.values(obj), value) > -1);
    };
    /**
     * @description : merge another object
     * @param       : {Object} thisObj, object to be checked.
     * @param       : {Object} thatObj, object to merge with.
     * @syntax      : PT.merge(this, that)
     */
    PT.merge = function (thisObj, thatObj) {
        if (!thatObj || !PT.isObj(thatObj)) {
            return thisObj;
        }
        var result = {};
        PT.each(thisObj, function (value, key) {
            result[key] = value;
        });
        PT.each(thatObj, function (value, key) {
            result[key] = value;
        });
        return result;
    };

    /**
     * @description : check if the object has the key
     * @param       : {unkonwn} thisArg, The value to be passed as the this parameter to the target function when the bound function is called.
     * @param       : {unkonwn} argx, Arguments to prepend to arguments provided to the bound function.
     * @syntax      : fun.bind(thisArg[, arg1[, arg2[, ...]]])
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
     */
    PT.bind = function (func, oThis) {
        if (PT.isFunc(oThis) && PT.isFunc(func)) {
            var aArgs  = arguments.slice(2),
                FNOP   = function () {},
                fBound = function () {
                    return func.apply(
                            this instanceof FNOP && oThis ? this : oThis || PT.ON,
                            aArgs.concat(arguments)
                        );
                };
            if (FP.bind) {
                return func.bind(oThis, aArgs);
            }
            FNOP[PS]   = func[PS];
            fBound[PS] = new FNOP();
            return fBound;
        }
    };

    /**
     * @syntax : PT.toInt(value[, base])
     */
    PT.toInt = function (value, base) {
        return parseInt(value, base || 10);
    };
    /**
     * @description : Removes whitespace from both ends of the string.
     * @param       : {string} str, string to trim.
     * @return      : {string} result string.
     * @syntax      : PT.trim(str)
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
     */
    PT.trim = function (str) {
        if (SP.trim) {
            return str.trim();
        }
        return str.replace(/^\s+|\s+$/g, '');
    };
    /**
     * @syntax      : PT.trimLeft(str)
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/TrimLeft
     */
    PT.trimLeft = function (str) {
        if (SP.trimLeft) {
            return str.trimLeft();
        }
        return str.replace(/^\s+/g, '');
    };
    /**
     * @syntax      : PT.trimRight(str)
     * @refference  : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/TrimRight
     */
    PT.trimRight = function (str) {
        if (SP.trimRight) {
            return str.trimRight();
        }
        return str.replace(/\s+$/g, '');
    };

    /*
     * @param  : {String} str, string to get upper cases.
     * @return : {String} upper cases version string.
     * @syntax : PT.uc(str)
     */
    PT.uc = function (str) {
        return str.toUpperCase();
    };
    /*
     * @param  : {String} str, string to get lower cases.
     * @return : {String} lower cases version string.
     * @syntax : PT.uc(str)
     */
    PT.lc = function (str) {
        return str.toLowerCase();
    };
    /*
     * @description : check if string has a given sub string.
     * @param       : {String} str   , given string.
     * @param       : {String} subStr, given sub string.
     * @syntax      : PT.hasSub(str, subStr)
     * @return      : {Boolean} result.
     */
    PT.hasSub = function (str, subStr) {
        return (str.indexOf(subStr) > -1);
    };
}(PT));

(function (PT) {
    PT.FMT = {
        /**
         * @description : return stringified date according to given pattern.
         * @param       : {string} pattern, defines pattern for stringify.
         * @return      : {string} result string.
         * @syntax      : date.stringf([pattern])
         * @example     : '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{lms}Z' => '2013-10-03T00:57::13.180Z'
         * @example     : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
         * @example     : '{YY}-{M}-{D} {h}:{m}:{s}' => '13-10-3 0:57::13'
         */
        date : function (date, pattern) {
            var y, mo, d, h, mi, s, ms,
                f = function (n) {
                    return n < 10 ? '0' + n : n;
                },
                lms = function (ms) {
                    var str = ms.toString(),
                        len = str.length;
                    return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
                };
            pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';
            return pattern.replace( '{YYYY}', y = PT.S(date.getFullYear())     )
                          .replace( '{MM}'  , f(mo   = date.getMonth() + 1   ) )
                          .replace( '{DD}'  , f(d    = date.getDate()        ) )
                          .replace( '{hh}'  , f(h    = date.getHours()       ) )
                          .replace( '{mm}'  , f(mi   = date.getMinutes()     ) )
                          .replace( '{ss}'  , f(s    = date.getSeconds()     ) )
                          .replace( '{lms}' , lms(ms = date.getMilliseconds()) )
                          .replace( '{YY}'  , y.substring(2) )
                          .replace( '{M}'   , mo )
                          .replace( '{D}'   , d  )
                          .replace( '{h}'   , h  )
                          .replace( '{m}'   , mi )
                          .replace( '{s}'   , s  )
                          .replace( '{ms}'  , ms );
        },
        /**
         * @description : return stringified number according to given pattern.
         * @param       : {object} option, defines pattern for stringify.
         * @example     : {"comma": "1|0", "decimal": ">=0", "integer" : ">=0", "zero": "1|0"}
         * @return      : {string} result string.
         * @syntax      : number.stringf([option])
         */
        num : function (num, option) {
            var i, len, placeHolder,
                str    = num.toString(),
                strArr = str.split('.');
            option = option || {
                'comma'   : 1,
                'decimal' : 2,
                'integer' : 5,
                'zero'    : 0
            };
            placeHolder = (option.zero && option.zero > 0) ? '0' : ' ';
            if (option.decimal && option.decimal > 0) {
                strArr[1] = strArr[1] || '';
                strArr[1] = strArr[1].slice(0, option.decimal);
                len = option.decimal - strArr[1].length;
                for (i = 0; i < len; i ++) {
                    strArr[1] += '0';
                }
            }
            if (option.integer && option.integer > 0) {
                len = option.integer - strArr[0].length;
                for (i = 0; i < len; i ++) {
                    strArr[0] = placeHolder + strArr[0];
                }
            }
            if (option.comma && option.comma !== 0) {
                strArr[0] = strArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            if (strArr[1] !== '') {
                return strArr.join('.');
            }
            return strArr[0];
        }
    };
}(PT));

(function (PT) {
    PT.JSON = PT.tryAny([
            function () { return JSON;         },
            function () { return PT.OVEN.JSON; }
        ]);
    if (PT.JSON) {
        return;
    }

    var D2JSON = PT.DP.toJSON,
        S = PT.S;
    if (!PT.isFunc(D2JSON)) {
        PT.each([PT.SP, PT.NP, PT.BP], function (p) {
            p.toJSON = function () {
                return this.valueOf();
            };
        });
        D2JSON = function () {
            return isFinite(this.valueOf()) ? PT.format.date(this, '{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
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
                        PT.each(rep, function (element) {
                            if (PT.isStr(element)) {
                                k = element;
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        });
                    } else {
                        PT.each(value, function (element, k) {
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
                PT.each(value, function (element, k) {
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
        win   = PT.ON,
        nav   = win.navigator || {},
        uaStr = nav.userAgent;
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
            PT.VER  = PT.versions = win.process.versions;
        } else {
            PT.HOST = win.location.host;
            PT.DOC  = win.document;
            PT.UA   = PT.userAgent = uaStr;
            PT.PL   = PT.platform  = PT.detectPL(nav.platform) || PT.detectPL(uaStr) || 'unknown';
            PT.PLUG = PT.plugins   = PT.detectPLUG(nav.plugins);
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
        var pls = PT.lc(str).match(/mac|win|linux|ipad|ipod|iphone|android/);
        return PT.isArr(pls) ? pls[0] : pls;
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
        str = PT.lc(str);
        var ieVer,
            versions = {};

        // browser versions
        PT.each([
            /msie ([\d.]+)/     ,
            /firefox\/([\d.]+)/ ,
            /chrome\/([\d.]+)/  ,
            /crios\/([\d.]+)/   ,
            /opera.([\d.]+)/    ,
            /adobeair\/([\d.]+)/
        ], function (reg) {
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
        PT.each([
            /trident\/([\d.]+)/     ,
            /gecko\/([\d.]+)/       ,
            /applewebkit\/([\d.]+)/ ,
            /presto\/([\d.]+)/
        ], function (reg) {
            setVer(versions, str, reg);
        });
        ieVer = versions.msie;
        if (ieVer === 6) {
            versions.trident = 4;
        } else if (ieVer === 7 || ieVer === 8) {
            versions.trident = 5;
        }

        return versions;
    };

    PT.initUA();
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
            method      = option.method ? PT.uc(option.method)               : 'GET',
            type        = option.type   ? PT.lc(option.type)                 : 'xml',
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
        PT.each([
            'abort'     ,
            'error'     ,
            'load'      ,
            'loadend'   ,
            'loadstart' ,
            'progress'  ,
            'success'   ,
            'timeout'
        ], function (handler) {
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
            return (xhr.status >= 200 && xhr.status < 300)              ||
                   (xhr.status === 304)                                 ||
                   (!xhr.status && PT.ON.location.protocol === 'file:') ||
                   (!xhr.status && PT.VER.safari);
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.isSuccess() && option.success) {
                    var response = xhr.responseText;
                    if (type === 'json') {
                        response = PT.tryAny([function () { return PT.JSON.parse(response); }]) || response;
                    }
                    xhr.onsuccess(response);
                } else if (option.error) {
                    xhr.onerror(xhr.statusText);
                }
            }
        };

        // progress ajax
        if (method === 'GET') {
            if (data) {
                uri += (PT.hasSub(uri, '?') ? '&' : '?') + data;
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

    PT.each([
        'get' ,
        'post'
    ], function (method) {
        PT[method] = function (uri, option) {
            option.method = method;
            PT.ajax(uri, option);
        };
    });
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

            PT.each(pieces, function (elem) {
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

            PT.each(obj, function (value, key) {
                if (PT.isArr(value)) {
                    PT.each(value, function (elem) {
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
    var data = function (form) {
            var resultObj         = {},
                elementArray      = [],
                rcheckableTypes   = /^(?:checkbox|radio)$/i,
                rsubmitterTypes   = /^(?:submit|button|image|reset|file)$/i,
                rsubmittableTypes = /^(?:input|select|textarea|keygen)/i;
            PT.each(form.elements, function (elem) {
                elementArray.push(elem);
            });

            PT.map(PT.filter(elementArray, function (elem) {
                    return elem.name                                          &&
                           !elem.disabled                                     &&
                           rsubmittableTypes.test(elem.nodeName)              &&
                           !rsubmitterTypes.test(elem.type)                   &&
                           (!rcheckableTypes.test(elem.type) || elem.checked);
                }), function (elem) {
                    var val = elem.value;
                    if (val) {
                        if (PT.isArr(val)) {
                            PT.map(val, function (element) {
                                resultObj[element.name] = element.value;
                            });
                        } else {
                            resultObj[elem.name] = elem.value;
                        }
                    }
                });
            return resultObj;
        };

    PT.Form = {
        /*
         * @description : return form data object.
         * @syntax      : PT.Form.data(form)
         * @param       : {HTMLFormElement} form, form to be get data from.
         * @return      : {Object} form data object.
         */
        data      : data,
        /*
         * @description : return form data query string.
         * @syntax      : PT.Form.serialize(form)
         * @param       : {HTMLFormElement} form, form to be get data query string from.
         * @return      : {String} form data query string.
         */
        serialize : function (form) {
            return PT.QueryStr.stringify(data(form));
        }
    };
}(PT));

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var DOC = PT.DOC ,
        Obj = PT.O   ,
        WIN = PT.ON  ,
        HAS = PT.has ,
        elementStr = 'Element',
        /**
         * @description : check if Element has a property.
         * @return      : {Boolean} if has or not.
         * @syntax      : PT.DOM.elemHas(name)
         */
        elemHas = function (name) {
            return (
                    HAS(WIN, elementStr) && (
                        HAS(DOC.createElement('_'), name) &&
                        HAS(DOC.createElementNS('http://www.w3.org/2000/svg', 'svg'), name)
                ));
        },
        /**
         * @description : set a property of Element.
         * @param       : {String  } name, property name.
         * @param       : {Function} Getter, property getter method.
         * @param       : {Function} Setter, property setter method.
         * @param       : {Object  } option, defineProperty options.
         * @syntax      : PT.DOM.elemSet(name, Getter[, Setter, option])
         */
        elemSet = function (name, Getter, Setter, option) {
            if (elemHas(name)) {
                return;
            }
            var propDesc  = {},
                elemProto = WIN[elementStr][PT.PS];
            if (Obj.defineProperty) {
                if (Getter) {
                    propDesc.get = Getter;
                }
                if (Setter) {
                    propDesc.set = Setter;
                }
                if (option) {
                    propDesc = PT.merge(propDesc, option);
                }
                Obj.defineProperty(elemProto, name, propDesc);
            } else if (PT.OP.__defineGetter__) {
                elemProto.__defineGetter__(name, Getter);
                elemProto.__defineSetter__(name, Setter);
            }
        };
    /**
     * @description : DOM
     * @syntax      : PT.DOM
     */
    PT.DOM = {
        elemHas : elemHas,
        elemSet : elemSet
    };
}(PT));

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var classStr     = 'class',
        classListStr = 'classList',
        validateClass = function (token) {
            return (token === '' || /\s/.test(token)) ? false : true;
        },
        /**
         * @description : classList shim.
         * @return      : {Array} a list of classes of an element.
         * @syntax      : Element.classList
         * @refference  : https://github.com/eligrey/classList.js
         */
        ClassList = function (elem) {
            var $self = this;
            $self.list = [];
            PT.each(PT.trim(elem.getAttribute(classStr)).split(/\s+/), function (value) {
                $self.list.push(value);
            });
            $self._updateClassName = function () {
                elem.setAttribute(classStr, $self.toString());
            };
        },
        classListGetter = function () {
            return new ClassList(this);
        };

    ClassList[PT.PS] = {
        /**
         * @description : check if an element has a class.
         * @param       : {String } token, class name.
         * @return      : {Boolean} if contans.
         * @syntax      : Element.classList.contains(token)
         */
        contains : function (token) {
            token = PT.S(token);
            return validateClass(token) && PT.hasVal(this.list, token);
        },
        /**
         * @description : get a class by index.
         * @param       : {Number} index, index of class.
         * @return      : {String} class name.
         * @syntax      : Element.classList.item(index)
         */
        item : function (index) {
            return this.list[index] || null;
        },
        /**
         * @description : add classes to an element.
         * @param       : {String} token, class name.
         * @syntax      : Element.classList.add(token1[, token2, ...,])
         */
        add : function () {
            var $self   = this,
                updated = false;
            PT.each(arguments, function (token) {
                token = PT.S(token);
                if (validateClass(token) && !PT.hasVal($self.list, token)) {
                    $self.list.push(token);
                    updated = true;
                }
            });
            if (updated) {
                $self._updateClassName();
            }
        },
        /**
         * @description : remove classes from an element.
         * @param       : {String} token, class name.
         * @syntax      : Element.classList.remove(token1[, token2, ...,])
         */
        remove : function () {
            var $self   = this,
                updated = false;
            PT.each(arguments, function (token) {
                token = PT.S(token);
                if (validateClass(token) && PT.hasVal($self.list, token)) {
                    $self.list.splice(PT.indexOf($self.list, token), 1);
                    updated = true;
                }
            });
            if (updated) {
                $self._updateClassName();
            }
        },
        /**
         * @description : if element has the given class then remove it, otherwise add it.
         * @param       : {String } token, class name.
         * @param       : {Boolean} forse, if forse toggle.
         * @syntax      : Element.classList.toggle(token[, forse])
         */
        toggle : function (token, forse) {
            token = PT.S(token);
            if (!validateClass(token)) {
                return;
            }
            var $self  = this,
                method = $self.contains(token) ? forse !== true && 'remove' : forse !== false && 'add';
            if (method) {
                $self[method](token);
            }
        },
        /**
         * @description : stringify the class list.
         * @syntax      : Element.classList.toString()
         */
        toString : function () {
            return this.list.join(' ');
        }
    };

    PT.DOM.elemSet(classListStr, classListGetter);
}(PT));

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    /**
     * @description : dataset shim.
     * @syntax      : Element.dataset
     * @refference  : https://gist.github.com/brettz9/4093766
     */
    PT.DOM.elemSet('dataset', function () {
        var attrVal, attrName, propName,
            $this              = this,
            HTML5_DOMStringMap = {},
            attributes         = $this.attributes,
            toUpperCase        = function (n0) {
                return PT.uc(n0.charAt(1));
            },
            getter = function () {
                return this;
            },
            setter = function (attrName, value) {
                return value ? this.setAttribute(attrName, value) : this.removeAttribute(attrName);
            };
        PT.each(attributes, function (attribute) {
            if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
                attrVal  = attribute.value;
                attrName = attribute.name;
                propName = attrName.substr(5).replace(/-./g, toUpperCase); // Change to CamelCase
                try {
                    PT.O.defineProperty(HTML5_DOMStringMap, propName, {
                        get : PT.bind(getter, attrVal || ''  ),
                        set : PT.bind(setter, $this, attrName)
                    });
                } catch (e) { // if accessors are not working
                    HTML5_DOMStringMap[propName] = attrVal;
                }
            }
        });
        return HTML5_DOMStringMap;
    });
}(PT));

(function (PT) {
    if (PT.NODEJS) {
        return;
    }
    var BS = 'block',
        NS = 'none' ,
        assets = {
            /**
             * @description : show an element.
             * @syntax      : element.show().
             */
            show : function () {
                this.style.display = BS;
            },
            /**
             * @description : hide an element.
             * @syntax      : element.hide().
             */
            hide : function () {
                this.style.display = NS;
            },
            /**
             * @description : show or hide an element.
             * @syntax      : element.toggle().
             */
            toggle : function () {
                var $self = this,
                    oldDisplay = $self.style.display;
                $self.style.display = (oldDisplay === BS) ? NS : BS;
            }
        };

    PT.each(PT.keys(assets), function (prop) {
        PT.DOM.elemSet(prop, function () {
            return assets[prop];
        });
    });
}(PT));

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    /**
     * @description : bind tabs behavior to an element with childs.
     * @param       : {HTMLElement} $tabs, tabs menu.
     * @param       : {Object     } option, options for binding tabs.
     * @syntax      : PT.UI.Tabs($tabs[, option])
     */
    PT.UI = PT.UI || {};
    PT.UI.Tabs = function ($tabsMenu, option) {
        option = option || {};
        var currentTab   = 'current',
            contentIds   = 'ids',
            activeClass  = option.activeClass || 'PT-activeTab',
            showContents = function ($tab) {
                PT.each($tab.dataset[contentIds].split(/\s/), function (id) {
                    PT.DOC.getElementById(id).show();
                });
            },
            hideContents = function ($tab) {
                PT.each($tab.dataset[contentIds].split(/\s/), function (id) {
                    PT.DOC.getElementById(id).hide();
                });
            };

        PT.each($tabsMenu.children, function ($child) {
            if (PT.isObj($child)) {
                var currentTabId = $tabsMenu.dataset[currentTab];
                if ($child.id === currentTabId) {
                    $child.classList.add(activeClass);
                    showContents($child);
                } else {
                    hideContents($child);
                }
                $child.addEventListener('click', function(){
                    var $oldTab = PT.DOC.getElementById($tabsMenu.dataset[currentTab]),
                        $newTab = this;
                    $oldTab.classList.toggle(activeClass);
                    $newTab.classList.toggle(activeClass);
                    hideContents($oldTab);
                    showContents($newTab);
                    $tabsMenu.dataset[currentTab] = $newTab.id;
                });
            }
        });
    };
 }(PT));
