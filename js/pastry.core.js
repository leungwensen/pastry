/**
 * @author      : https://github.com/leungwensen/pastry/graphs/contributors
 * @description : first pastry of the building
 * @filename    : pastry.core.js
 */
'use strict';

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
