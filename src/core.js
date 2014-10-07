/* jshint strict: true, undef: true, unused: true */
/* global exports, module */
/*
 * @author      : 绝云(wensen.lws@alibaba-inc.com)
 * @date        : 2014-07-07
 * @description : 定义全局命名空间以及核心函数库
 */
(function (GLOBAL) {
    'use strict';
    var
    // 命名空间 {
        C = {},
    // }
    // 局部变量 {
        A  = Array,
        F  = Function,
        O  = Object,
        S  = String,
        P  = 'prototype',
        U  = 'undefined',
        AP = A[P],
        FP = F[P],
        OP = O[P],
        SP = S[P],

        toStr = {}.toString,
        slice = AP.slice;
    // }

    // 版本号 {
        C.VERSION = '0.0.1';
    // }
    // ES5 && ES6 函数集 {
        C.index = function (up) {
            /*
             * @description: 为实现 indexOf 和 lastIndexOf 而设计的函数
             */
            return function (arr, searchElement, fromIndex) {
                var i,
                    len = arr.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                if (!fromIndex) {
                    fromIndex = 0;
                } else if (fromIndex < 0) {
                    fromIndex = Math.max(0, arr.length + fromIndex);
                }
                if (up) {
                    for (i = fromIndex; i < arr.length; i++) {
                        if (arr[i] === searchElement){
                            return i;
                        }
                    }
                } else {
                    for (i = fromIndex; i >= 0; i--) {
                        if (arr[i] === searchElement){
                            return i;
                        }
                    }
                }
                return -1;
            };
        };
        C.indexOf = AP.indexOf ?
            /*
             * @description : 返回 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : chicken.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr, searchElement, fromIndex) {
                return arr.indexOf(searchElement, fromIndex);
            } : C.index(true);
        C.lastIndexOf = AP.lastIndexOf ?
            /*
             * @description : 返回最后一个 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : chicken.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr, searchElement, fromIndex) {
                return arr.lastIndexOf(searchElement, fromIndex);
            } : C.index(false);

        C.each = C.forEach = OP.forEach ?
            /*
             * @description : 遍历
             * @parameter*  : {Object  } obj      , 待循环变量
             * @parameter*  : {Function} callback , 回调函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @syntax      : chicken.each(obj Object, callback Function[, thisObj Object]);
             * @syntax      : chicken.forEach(obj Object, callback Function[, thisObj Object]);
             */
            function (obj, callback, thisObj) {
                obj.forEach(callback, thisObj);
            } : function (obj, callback, thisObj) {
                for (var key in obj){
                    callback.call(thisObj, obj[key], key, obj);
                }
            };

        C.every = AP.every ?
            /*
             * @description : 测试是否对于 arr 中的元素，callback 都返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 结果
             * @syntax      : chicken.every(arr, callback[, thisObj])
             */
            function (arr, callback, thisObj) {
                return arr.every(callback, thisObj);
            } : function (arr, callback, thisObj) {
                var i;
                for (i = 0; i < arr.length; i ++) {
                    if (!callback.call(thisObj, arr[i], i, arr)) {
                        return false;
                    }
                }
                return true;
            };

        C.filter = AP.filter ?
            /*
             * @description : 根据 callback 是否通过来过滤 arr 中的元素，返回过滤后的数组
             * @parameter*  : {Array   } arr      , 待过滤数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : chicken.filter(arr, callback[, thisObj])
             */
            function (arr, callback, thisObj) {
                return arr.filter(callback, thisObj);
            } : function (arr, callback, thisObj) {
                var res = [];
                C.each(arr, function (element, key) {
                    if (callback.call(thisObj, element, key, arr)) {
                        res.push(element);
                    }
                });
                return res;
            };

        C.map = AP.map ?
            /*
             * @description : 用 arr 通过 callback 函数加工各个元素得到新的数组
             * @parameter*  : {Array   } arr      , 待加工数组
             * @parameter*  : {Function} callback , 加工函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : chicken.map(arr, callback[, thisObj])
             */
            function(arr, callback, thisObj) {
                return arr.map(callback, thisObj);
            } : function(arr, callback, thisObj) {
                var res = [];
                C.each(arr, function (element, key) {
                    res.push(callback.call(thisObj, element, key, arr));
                });
                return res;
            };

        C.some = AP.some ?
            /*
             * @description : 测试 arr 中每个元素，当有真的时候退出并返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 测试函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 真值
             * @syntax      : chicken.some(arr, callback[, thisObj])
             */
            function (arr, callback, thisObj) {
                return arr.some(callback, thisObj);
            } : function (arr, callback, thisObj) {
                var i;
                for (i = 0; i < arr.length; i ++) {
                    if (callback.call(thisObj, arr[i], i, arr)) {
                        return true;
                    }
                }
                return false;
            };

        C.reduce = AP.reduce ?
            /*
             * @description : 从左到右遍历数组，运行函数并得到最终值
             * @parameter*  : {Array   } arr      , 待遍历数组
             * @parameter*  : {Function} callback , 遍历用函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Object  } 结果对象
             * @syntax      : chicken.reduce(arr, callback[, thisObj])
            // @paramForCallback* : {Object  } previousValue , 前一个值
            // @paramForCallback* : {Object  } currentValue  , 当前值
            // @paramForCallback  : {Number  } index         , index
            // @paramForCallback  : {Array   } array         , 数组变量
             */
            function (arr, callback, thisObj) {
                return thisObj ?
                    arr.reduce(callback, thisObj) : arr.reduce(callback);
            } : function (arr, callback, thisObj) {
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
        C.reduceRight = AP.reduceRight ?
            /*
             * @description : 从右到左遍历数组，运行函数并得到最终值
             * @parameter*  : {Array   } arr      , 待遍历数组
             * @parameter*  : {Function} callback , 遍历用函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Object  } 结果对象
             * @syntax      : chicken.reduce(arr, callback[, thisObj])
            // @paramForCallback* : {Object  } previousValue , 前一个值
            // @paramForCallback* : {Object  } currentValue  , 当前值
            // @paramForCallback  : {Number  } index         , index
            // @paramForCallback  : {Array   } array         , 数组变量
             */
            function (arr, callback, thisObj) {
                return thisObj ?
                    arr.reduceRight(callback, thisObj) : arr.reduceRight(callback);
            } : function (arr, callback, thisObj) {
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

        C.trim = SP.trim ?
            /*
             * @description : 移除空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : chicken.trim(str)
             */
            function (str) {
                return str.trim();
            } : function (str) {
                return str.replace(/^\s+|\s+$/g, '');
            };
        C.trimLeft = SP.trimLeft ?
            /*
             * @description : 移除左空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : chicken.trimLeft(str)
             */
            function (str) {
                return str.trimLeft();
            } : function (str) {
                return str.replace(/^\s+/g, '');
            };
        C.trimRight = SP.trimRight ?
            /*
             * @description : 移除右空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : chicken.trimRight(str)
             */
            function (str) {
                return str.trimRight();
            } : function (str) {
                return str.replace(/\s+$/g, '');
            };
    // }
    // helper 函数集 {
        // 字符串相关 {
            C.lc = function (str) {
                /*
                 * @syntax: chicken.lc(str String);
                 */
                return str.toString().toLowerCase();
            };
            C.uc = function (str) {
                /*
                 * @syntax: chicken.uc(str String);
                 */
                return str.toString().toUpperCase();
            };
            C.hasSubString = function (str, subStr) {
                /*
                 * @syntax: chicken.hasSubString(str String, subStr String);
                 */
                return (str.indexOf(subStr) > -1);
            };
        // }
        // 类型判断 chicken.is$Type(obj) {
            /*
             * @description : 类型判断
             * @parameter*  : {Any} obj, 待判断对象
             * @syntax      : chicken.is$Type(obj Any);
             */
            C.each([
                'Array',
                'Arguments',
                'Boolean',
                'Date',
                'Error',
                'Function',
                'Number',
                'RegExp',
                'String'
            ], function (type) {
                C['is' + type] = function (obj) {
                    return toStr.call(obj) === '[object ' + type + ']';
                };
            });
            C.isArray = A.isArray ? A.isArray : C.isArray;

            C.isObject = function (obj) {
                var type = typeof obj;
                return type === 'object' && !!obj;
            };
            C.isNaN = function(obj) {
                return C.isNumber(obj) && obj !== +obj;
            };
            C.isFinite = function(obj) {
                return C.isNumber(obj) && isFinite(obj) && !isNaN(obj);
            };
            C.isUndefined = function(obj) {
                return obj === undefined;
            };
            C.isNull      = function(obj) {
                return obj === null;
            };
        // }
        // 数组、对象相关 {
            C.toArray = function (obj) {
                return slice.call(obj);
            };
            C.merge = function (dest) {
                /*
                 * @description : 合并对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : chicken.merge(dest Object[, src1 Object, src2 Object, ...]);
                 */
                if (C.isObject(dest)) {
                    C.each(C.toArray(arguments).slice(1), function(source) {
                        if (source) {
                            for (var prop in source) {
                                if (C.isObject(source[prop])) {
                                    dest[prop] = dest[prop] || {};
                                    C.merge(dest[prop], source[prop]);
                                } else {
                                    dest[prop] = source[prop];
                                }
                            }
                        }
                    });
                }
                return dest;
            };
            C.extend = function (dest) {
                /*
                 * @description : 扩展对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : chicken.extend(dest Object[, src1 Object, src2 Object, ...]);
                 */
                if (C.isObject(dest)) {
                    C.each(C.toArray(arguments).slice(1), function(source) {
                        if (source) {
                            for (var prop in source) {
                                dest[prop] = source[prop];
                            }
                        }
                    });
                }
                return dest;
            };
            C.remove = function (arr, fromIndex, toIndex) {
                /*
                 * @description : 删除数组元素
                 * @parameter*  : {Array } arr       , 待处理数组
                 * @parameter   : {Number} fromIndex , 起始 index
                 * @parameter   : {Number} toIndex   , 结束 index
                 * @syntax      : chicken.remove(arr, [fromIndex[, toIndex]])
                 */
                var rest,
                    len = arr.length;
                if (!C.isNumber(fromIndex)) {
                    return arr;
                }
                rest = arr.slice((toIndex || fromIndex) + 1 || len);
                arr.length = fromIndex < 0 ? len + fromIndex : fromIndex;
                return arr.push.apply(arr, rest);
            };
            C.keys = O.keys ?
                /*
                 * @description : 获取对象键集合
                 * @parameter*  : {object} obj, 对象
                 * @syntax      : chicken.keys(obj)
                 */
                function (obj) {
                    return O.keys(obj);
                } : function (obj) {
                    var result = [];
                    if (C.isFunction(obj)) {
                        C.each(obj, function (value, key) {
                            if (key !== P) {
                                result.push(key);
                            }
                        });
                    } else {
                        C.each(obj, function (value, key) {
                            result.push(key);
                        });
                    }
                    return result;
                };

            C.values = function (obj) {
                /*
                 * @description : 获取对象值集合
                 * @parameter*  : {object} obj, 对象
                 * @syntax      : chicken.values(obj)
                 */
                var values = [];
                C.each(obj, function (value) {
                    values.push(value);
                });
                return values;
            };
            C.hasKey = function (obj, key) {
                /*
                 * @description : 检查是否存在键
                 * @parameter*  : {Object} obj, 待检查对象
                 * @parameter*  : {String} key, 键
                 * @syntax      : chicken.hasKey(obj, key)
                 */
                return obj.hasOwnProperty(key);
            };
            C.hasValue = function (obj, value) {
                /*
                 * @description : 检查是否存在值
                 * @parameter*  : {Object} obj   , 待检查对象
                 * @parameter*  : {String} value , 值
                 * @syntax      : chicken.hasValue(obj, value)
                 */
                return (C.indexOf(C.values(obj), value) > -1);
            };
            C.uniq = function (arr) {
                /*
                 * @description : 求集合
                 * @parameter*  : {Array} arr, 求集合数组
                 * @syntax      : chicken.uniq(arr Array);
                 */
                var resultArr = [];
                C.each(arr, function (element) {
                    if (!C.hasVal(resultArr, element)) {
                        resultArr.push(element);
                    }
                });
                return resultArr;
            };
            C.union = function (/*arr1, arr2 */) {
                /*
                 * @description : 合集
                 * @parameter*  : {Array} arr1, 求合集数组
                 * @syntax      : chicken.union([arr1 Array, arr2 Array, ...]);
                 */
                var resultArr = [],
                    sourceArrs = C.toArray(arguments).slice();
                C.each(sourceArrs, function (arr) {
                    resultArr.concat(arr);
                });
                return C.uniq(resultArr);
            };
        // }
        // 函数相关 {
            C.bind = FP.bind ?
                /*
                 * @description : 绑定函数运行上下文
                 * @parameter*  : {Function} func, 目标函数
                 * @parameter*  : {Object  } oThis, 上下文
                 * @syntax      : chicken.uuid(func Function, oThis Object);
                 */
                function (func, oThis) {
                    return func.bind(oThis, C.toArray(arguments).slice(2));
                } : function (func, oThis) {
                    if (C.isFunction(oThis) && C.isFunction(func)) {
                        var aArgs  = C.toArray(arguments).slice(2),
                            FNOP   = function () {},
                            fBound = function () {
                                return func.apply(
                                    this instanceof FNOP && oThis ? this : oThis || GLOBAL,
                                    aArgs.concat(arguments)
                                );
                            };
                        FNOP[P]   = func[P];
                        fBound[P] = new FNOP();
                        return fBound;
                    }
                };
        // }
        // 其它 {
            C.getAny = function (callbackList) {
                /*
                 * @description : 从一系列 callback 函数里按顺序尝试取值，并返回第一个可用值
                 * @parameter*  : {Array} callbackList, 回调函数列表
                 * @syntax      : chicken.getAny([func1 Function, func2 Function, ...]);
                 */
                var i, returnValue;
                for (i = 0; i < callbackList.length; i ++) {
                    try {
                        returnValue = callbackList[i]();
                        break;
                    } catch (e) {
                    }
                }
                return returnValue;
            };
            C.uuid = function(prefix){
                /*
                 * @description : 生成uuid
                 * @parameter   : {String} prefix, 前缀
                 * @syntax      : chicken.uuid(prefix String);
                 */
                prefix = prefix || '';
                return prefix + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                    .replace(/[xy]/g, function(c){
                        var r = Math.random()*16|0,
                            v = (c === 'x') ? r : (r&0x3|0x8),
                            result = v.toString(16);
                        return result;
                    });
            };
        // }
    // }
    // 输出全局变量 {
        C.setGLOBAL = function (key, value) {
            /*
             * @description : 设置全局变量
             * @parameter   : {String} key, 变量名
             * @parameter   : {Any   } value, 值
             * @syntax      : chicken.setGLOBAL(key String, value Any);
             */
            if (typeof exports !== U) {
                if (typeof module !== U && module.exports) {
                    module.exports = value;
                }
                exports[key] = value;
            } else {
                GLOBAL[key] = value;
            }
        };
        C.each([
            'C',
            'chicken',
            'CHICKEN'
        ], function (alias) {
            C.setGLOBAL(alias, C);
        });
    // }
}(this));
