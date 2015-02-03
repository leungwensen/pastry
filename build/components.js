/* jshint strict: true, undef: true, unused: true */
/* global exports, module */

(function (GLOBAL) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-07-07
     * @description : 定义全局命名空间以及核心函数库
     */

    GLOBAL = GLOBAL || {};

    if (GLOBAL.pastry) { // 避免重复运行
        return;
    }

    var
    // 命名空间 {
        pastry = {},
    // }
    // 局部变量 {
        A  = Array,
        F  = Function,
        O  = Object,
        S  = String,
        PS = 'prototype',
        US = 'undefined',
        AP = A[PS],
        FP = F[PS],
        // OP = O[PS],
        SP = S[PS],

        noop = function () { },

        // helpers {
            toStr = {}.toString,
            slice = AP.slice,

            arrayFromSecondElement = function (arr) {
                return slice.call(arr, 1);
            },
            applyNativeFunction = function (nativeFunc, target, args) {
                return nativeFunc.apply(target, arrayFromSecondElement(args));
            },

            // isType() {
                isType = function (type, obj) {
                    return toStr.call(obj) === '[object ' + type + ']';
                },
                isArrayLike = pastry.isArrayLike = function (obj) {
                    return (typeof obj === 'object' && isFinite(obj.length));
                },
                isFunction = pastry.isFunction = function (obj) {
                    return isType('Function', obj);
                },
                isNumber = pastry.isNumber = function (obj) {
                    return isType('Number', obj);
                },
                isObject = pastry.isObject = function (obj) {
                    var type = typeof obj;
                    return type === 'function' || type === 'object' && !!obj;
                },
                isPlainObject = pastry.isPlainObject = function (obj) {
                    return isType('Object', obj);
                },
            // }

            toArray = pastry.toArray = function (obj) {
                return isArrayLike(obj) ? slice.call(obj) : [];
            },

            each,
            hasValue;
        // }

    // }
    // // 版本号 {
    //     pastry.VERSION = '{VERSION}';
    // // }

    // ES5 && ES6 函数集 {
        pastry.index = function (up) {
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
                    fromIndex = up ? 0 : arr.length;
                } else if (fromIndex < 0) {
                    fromIndex = Math.max(0, arr.length + fromIndex);
                }
                if (up) {
                    for (i = fromIndex; i < arr.length; i++) {
                        if (arr[i] === searchElement) {
                            return i;
                        }
                    }
                } else {
                    for (i = fromIndex; i >= 0; i--) {
                        if (arr[i] === searchElement) {
                            return i;
                        }
                    }
                }
                return -1;
            };
        };
        pastry.indexOf = AP.indexOf ?
            /*
             * @description : 返回 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : pastry.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr) {
                return applyNativeFunction(AP.indexOf, arr, arguments);
            } : pastry.index(true);
        pastry.lastIndexOf = AP.lastIndexOf ?
            /*
             * @description : 返回最后一个 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : pastry.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr) {
                return applyNativeFunction(AP.lastIndexOf, arr, arguments);
            } : pastry.index();

        function objForEach (obj, callback, thisObj) {
            for (var key in obj) {
                callback.call(thisObj, obj[key], key, obj);
            }
        }
        each = pastry.each = pastry.forEach = AP.forEach ?
            /*
             * @description : 遍历
             * @parameter*  : {Object  } obj      , 待循环变量
             * @parameter*  : {Function} callback , 回调函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @syntax      : pastry.each(obj Object, callback Function[, thisObj Object]);
             * @syntax      : pastry.forEach(obj Object, callback Function[, thisObj Object]);
             */
            function (obj, callback, thisObj) {
                if (isArrayLike(obj)) {
                    return applyNativeFunction(AP.forEach, obj, arguments);
                } else if (isPlainObject(obj)) {
                    objForEach(obj, callback, thisObj);
                }
                return obj;
            } : function (obj, callback, thisObj) {
                if (isArrayLike(obj)) {
                    var len = obj.length;
                    for (var i = 0; i < len; i++) {
                        if (i in obj) {
                            callback.call(thisObj, obj[i], i, obj);
                        }
                    }
                } else if (isPlainObject(obj)) {
                    objForEach(obj, callback, thisObj);
                }
                return obj;
            };

        pastry.eachReverse = function (arr, callback, thisObj) {
            /*
             * @description : 逆序遍历
             * @parameter*  : {Array   } arr      , 待循环数组
             * @parameter*  : {Function} callback , 回调函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @syntax      : pastry.eachReverse(arr Array, callback Function[, thisObj Object]);
             */
            if (arr) {
                var i = arr.length - 1;
                for (; i > -1; i -= 1) {
                    callback.call(thisObj, arr[i], i, arr);
                }
            }
            return arr;
        };

        pastry.every = AP.every ?
            /*
             * @description : 测试是否对于 arr 中的元素，callback 都返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 结果
             * @syntax      : pastry.every(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.every, arr, arguments);
            } : function (arr, callback, thisObj) {
                var i;
                for (i = 0; i < arr.length; i ++) {
                    if (!callback.call(thisObj, arr[i], i, arr)) {
                        return false;
                    }
                }
                return true;
            };

        pastry.filter = AP.filter ?
            /*
             * @description : 根据 callback 是否通过来过滤 arr 中的元素，返回过滤后的数组
             * @parameter*  : {Array   } arr      , 待过滤数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : pastry.filter(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.filter, arr, arguments);
            } : function (arr, callback, thisObj) {
                var res = [];
                each(arr, function (element, key) {
                    if (callback.call(thisObj, element, key, arr)) {
                        res.push(element);
                    }
                });
                return res;
            };

        pastry.map = AP.map ?
            /*
             * @description : 用 arr 通过 callback 函数加工各个元素得到新的数组
             * @parameter*  : {Array   } arr      , 待加工数组
             * @parameter*  : {Function} callback , 加工函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : pastry.map(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.map, arr, arguments);
            } : function (arr, callback, thisObj) {
                var res = [];
                each(arr, function (element, key) {
                    res.push(callback.call(thisObj, element, key, arr));
                });
                return res;
            };

        pastry.some = AP.some ?
            /*
             * @description : 测试 arr 中每个元素，当有真的时候退出并返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 测试函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 真值
             * @syntax      : pastry.some(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.some, arr, arguments);
            } : function (arr, callback, thisObj) {
                var i;
                for (i = 0; i < arr.length; i ++) {
                    if (callback.call(thisObj, arr[i], i, arr)) {
                        return true;
                    }
                }
                return false;
            };

        pastry.reduce = AP.reduce ?
            /*
             * @description : 从左到右遍历数组，运行函数并得到最终值
             * @parameter*  : {Array   } arr      , 待遍历数组
             * @parameter*  : {Function} callback , 遍历用函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Object  } 结果对象
             * @syntax      : pastry.reduce(arr, callback[, thisObj])
            // @paramForCallback* : {Object  } previousValue , 前一个值
            // @paramForCallback* : {Object  } currentValue  , 当前值
            // @paramForCallback  : {Number  } index         , index
            // @paramForCallback  : {Array   } array         , 数组变量
             */
            function (arr) {
                return applyNativeFunction(AP.reduce, arr, arguments);
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
        pastry.reduceRight = AP.reduceRight ?
            /*
             * @description : 从右到左遍历数组，运行函数并得到最终值
             * @parameter*  : {Array   } arr      , 待遍历数组
             * @parameter*  : {Function} callback , 遍历用函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Object  } 结果对象
             * @syntax      : pastry.reduce(arr, callback[, thisObj])
            // @paramForCallback* : {Object  } previousValue , 前一个值
            // @paramForCallback* : {Object  } currentValue  , 当前值
            // @paramForCallback  : {Number  } index         , index
            // @paramForCallback  : {Array   } array         , 数组变量
             */
            function (arr) {
                return applyNativeFunction(AP.reduceRight, arr, arguments);
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

        pastry.trim = SP.trim ?
            /*
             * @description : 移除空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : pastry.trim(str)
             */
            function (str) {
                return str.trim();
            } : function (str) {
                return str.replace(/^\s+|\s+$/g, '');
            };
        pastry.trimLeft = SP.trimLeft ?
            /*
             * @description : 移除左空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : pastry.trimLeft(str)
             */
            function (str) {
                return str.trimLeft();
            } : function (str) {
                return str.replace(/^\s+/g, '');
            };
        pastry.trimRight = SP.trimRight ?
            /*
             * @description : 移除右空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : pastry.trimRight(str)
             */
            function (str) {
                return str.trimRight();
            } : function (str) {
                return str.replace(/\s+$/g, '');
            };
    // }
    // helper 函数集 {
        // 字符串相关 {
            pastry.lc = function (str) {
                /*
                 * @syntax: pastry.lc(str String);
                 */
                return (str + '').toLowerCase();
            };
            pastry.uc = function (str) {
                /*
                 * @syntax: pastry.uc(str String);
                 */
                return (str + '').toUpperCase();
            };
            pastry.hasSubString = function (str, subStr) {
                /*
                 * @syntax: pastry.hasSubString(str String, subStr String);
                 */
                return (str.indexOf(subStr) > -1);
            };
            pastry.capitalize = function (str) {
                str = str + '';
                return str.charAt(0).toUpperCase() + str.substr(1);
            };
        // }
        // 其它类型判断 pastry.is$Type(obj) {
            /*
             * @description : 类型判断
             * @parameter*  : {Any} obj, 待判断对象
             * @syntax      : pastry.is$Type(obj Any);
             */
            each([
                'Array',
                'Arguments',
                'Boolean',
                'Date',
                'Error',
                'RegExp',
                'String'
            ], function (type) {
                pastry['is' + type] = function (obj) {
                    return isType(type, obj);
                };
            });
            if (A.isArray) {
                pastry.isArray = A.isArray;
            }
            pastry.isNaN = function (obj) {
                return isNumber(obj) && obj !== +obj;
            };
            pastry.isFinite = function (obj) {
                return isNumber(obj) && isFinite(obj) && !isNaN(obj);
            };
            pastry.isUndefined = function (obj) {
                return obj === undefined;
            };
            pastry.isNull = function (obj) {
                return obj === null;
            };
        // }
        // 数组、对象相关 {
            pastry.range = function (start, stop, step) {
                if (arguments.length <= 1) {
                    stop = start || 0;
                    start = 0;
                }
                step = step || 1;

                var length = Math.max(Math.ceil((stop - start) / step), 0),
                    range  = new Array(length),
                    idx    = 0;
                for (; idx < length; idx++, start += step) {
                    range[idx] = start;
                }
                return range;
            };
            pastry.flatten = function (array) {
                /*
                 * @description: 扁平化二维数组
                 */
                for (var r = [], i = 0, l = array.length; i < l; ++i) {
                    if (isArrayLike(array[i])) {
                        r = r.concat(array[i]);
                    } else {
                        r[r.length] = array[i];
                    }
                }
                return r;
            };
            pastry.merge = function (dest) {
                /*
                 * @description : 合并对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : pastry.merge(dest Object[, src1 Object, src2 Object, ...]);
                 */
                each(arrayFromSecondElement(arguments), function (source) {
                    if (source) {
                        for (var prop in source) {
                            if (toStr.call(source[prop]) !== toStr.call(dest[prop])) {
                                dest[prop] = source[prop];
                            } else {
                                if (isPlainObject(source[prop])) {
                                    dest[prop] = dest[prop] || {};
                                    pastry.merge(dest[prop], source[prop]);
                                } else {
                                    dest[prop] = source[prop];
                                }
                            }
                        }
                    }
                });
                return dest;
            };
            pastry.extend = function (dest) {
                /*
                 * @description : 扩展对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : pastry.extend(dest Object[, src1 Object, src2 Object, ...]);
                 */
                each(arrayFromSecondElement(arguments), function (source) {
                    if (source) {
                        for (var prop in source) {
                            dest[prop] = source[prop];
                        }
                    }
                });
                return dest;
            };
            pastry.remove = function (arr, fromIndex, toIndex) {
                /*
                 * @description : 删除数组元素
                 * @parameter*  : {Array } arr       , 待处理数组
                 * @parameter   : {Number} fromIndex , 起始 index
                 * @parameter   : {Number} toIndex   , 结束 index
                 * @syntax      : pastry.remove(arr, [fromIndex[, toIndex]])
                 */
                var rest,
                    len = arr.length;
                if (!isNumber(fromIndex)) {
                    return arr;
                }
                rest = arr.slice((toIndex || fromIndex) + 1 || len);
                arr.length = fromIndex < 0 ? len + fromIndex : fromIndex;
                return arr.push.apply(arr, rest);
            };
            pastry.keys = O.keys ?
                /*
                 * @description : 获取对象键集合
                 * @parameter*  : {object} obj, 对象
                 * @syntax      : pastry.keys(obj)
                 */
                function (obj) {
                    return O.keys(obj);
                } : function (obj) {
                    var result = [];
                    if (isFunction(obj)) {
                        each(obj, function (value, key) {
                            if (key !== PS) {
                                result.push(key);
                            }
                        });
                    } else {
                        each(obj, function (value, key) {
                            result.push(key);
                        });
                    }
                    return result;
                };
            pastry.invert = function(obj) {
                var result = {};
                each(obj, function (value, key) {
                    result[value] = key;
                });
                return result;
            };
            pastry.values = function (obj) {
                /*
                 * @description : 获取对象值集合
                 * @parameter*  : {object} obj, 对象
                 * @syntax      : pastry.values(obj)
                 */
                var values = [];
                each(obj, function (value) {
                    values.push(value);
                });
                return values;
            };
            pastry.hasKey = function (obj, key) {
                /*
                 * @description : 检查是否存在键
                 * @parameter*  : {Object} obj, 待检查对象
                 * @parameter*  : {String} key, 键
                 * @syntax      : pastry.hasKey(obj, key)
                 */
                return obj.hasOwnProperty(key);
            };
            hasValue = pastry.hasValue = function (obj, value) {
                /*
                 * @description : 检查是否存在值
                 * @parameter*  : {Object} obj   , 待检查对象
                 * @parameter*  : {String} value , 值
                 * @syntax      : pastry.hasValue(obj, value)
                 */
                return (pastry.indexOf(pastry.values(obj), value) > -1);
            };
            pastry.uniq = function (arr) {
                /*
                 * @description : 求集合
                 * @parameter*  : {Array} arr, 求集合数组
                 * @syntax      : pastry.uniq(arr Array);
                 */
                var resultArr = [];
                each(arr, function (element) {
                    if (!hasValue(resultArr, element)) {
                        resultArr.push(element);
                    }
                });
                return resultArr;
            };
            pastry.union = function (/*arr1, arr2 */) {
                /*
                 * @description : 合集
                 * @parameter*  : {Array} arr1, 求合集数组
                 * @syntax      : pastry.union([arr1 Array, arr2 Array, ...]);
                 */
                var resultArr = [],
                    sourceArrs = toArray(arguments);
                each(sourceArrs, function (arr) {
                    resultArr.concat(arr);
                });
                return pastry.uniq(resultArr);
            };
            pastry.difference = function (arr) {
                var rest = pastry.flatten(arrayFromSecondElement(arguments), true, true, []);
                return pastry.filter(arr, function(value){
                    return !hasValue(rest, value);
                });
            };
            pastry.intersect = function (a, b) {
                var result = [];
                each(a, function (value) {
                    if (hasValue(b, value)) {
                        result.push(value);
                    }
                });
                return result;
            };
            pastry.destroy = function (obj) {
                /*
                 * @description : 销毁对象
                 * @parameter*  : {Object} obj, 待销毁对象
                 * @syntax      : pastry.destroy(obj);
                 */
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        delete obj[p];
                    }
                }
                obj.prototype = obj['__proto__'] = null;
                obj = null;
            };
            pastry.clone = function (obj) {
                /*
                 * @description : 克隆对象
                 * @parameter*  : {Object} obj, 待克隆对象
                 * @syntax      : pastry.clone(obj);
                 */
                if (!isObject(obj)) {
                    return obj;
                }
                return isArrayLike(obj) ? toArray(obj) : pastry.extend({}, obj);
            };
        // }
        // 函数相关 {
            pastry.bind = FP.bind ?
                /*
                 * @description : 绑定函数运行上下文
                 * @parameter*  : {Function} func, 目标函数
                 * @parameter*  : {Object  } oThis, 上下文
                 * @syntax      : pastry.uuid(func Function, oThis Object);
                 */
                function (func) {
                    return applyNativeFunction(FP.bind, func, arguments);
                } : function (func, oThis) {
                    if (isFunction(oThis) && isFunction(func)) {
                        var aArgs  = toArray(arguments).slice(2),
                            FNOP   = function () {},
                            fBound = function () {
                                return func.apply(
                                    this instanceof FNOP && oThis ? this : oThis || GLOBAL,
                                    aArgs.concat(arguments)
                                );
                            };
                        FNOP[pastry]   = func[pastry];
                        fBound[pastry] = new FNOP();
                        return fBound;
                    }
                };
        // }
        // debug {
            /*
             * @description : debug 相关函数
             * @syntax      : pastry.[INFO|LOG|WARN|ERROR]
             */
            each([
                'info',
                'log',
                'warn'
            ], function (type) {
                pastry[type.toUpperCase()] = (typeof console === US) ? noop : pastry.bind(console[type], console);
            });
            pastry.ERROR = function (err) {
                pastry.WARN(err);
                throw new Error(err);
            };
        // }
        // 其它 {
            pastry.getAny = function (callbackList) {
                /*
                 * @description : 从一系列 callback 函数里按顺序尝试取值，并返回第一个可用值
                 * @parameter*  : {Array} callbackList, 回调函数列表
                 * @syntax      : pastry.getAny([func1 Function, func2 Function, ...]);
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
            pastry.uuid = function (prefix) {
                /*
                 * @description : 生成uuid
                 * @parameter   : {String} prefix, 前缀
                 * @syntax      : pastry.uuid(prefix String);
                 */
                prefix = prefix || '';
                return prefix + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                    .replace(/[xy]/g, function (c) {
                        var r = Math.random()*16|0,
                            v = (c === 'x') ? r : (r&0x3|0x8),
                            result = v.toString(16);
                        return result;
                    });
            };
        // }
    // }
    // 增加 pastry 函数 {
        /*
         * @description : 把对象中的属性／方法加到 pastry 这个 namespace 下
         * @parameter   : {Object } obj, 扩展对象
         * @parameter   : {Boolean} override, 是否覆盖
         * @syntax      : pastry.mixin(obj Object[, override Boolean]);
         */
        pastry.mixin = function (obj, override) {
            each(obj, function (value, key) {
                if (pastry[key] && !override) {
                    pastry.ERROR('pastry.' + key + ' already exists');
                } else {
                    pastry[key] = value;
                }
            });
        };
    // }
    // 输出全局变量 {
        pastry.setGLOBAL = function (key, value) {
            /*
             * @description : 设置全局变量
             * @parameter   : {String} key, 变量名
             * @parameter   : {Any   } value, 值
             * @syntax      : pastry.setGLOBAL(key String, value Any);
             */
            if (typeof exports !== US) {
                exports[key] = value;
            }
            GLOBAL[key] = value;
        };
        each([
            'P',
            'pastry',
            'PASTRY'
        ], function (alias) {
            // set global names and alias
            pastry.setGLOBAL(alias, pastry);
        });

        if (typeof exports !== US) {
            if (typeof module !== US && module.exports) {
                module.exports = pastry;
            }
        }
    // }
}(this));


/* jshint strict: true, undef: true, unused: true */
// /* global xxx, yyy */

(function (GLOBAL) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-11-10
     * @description : event 模块，包括全局和局部的
     */

    var pastry = GLOBAL.pastry,

        // defination of event function {
            event = function (target) {
                target = target || this;

                var events = target._events = {}; // all events stores in the the collection: *._events

                target.on = function (name, callback, context) {
                    /*
                     * @description: 绑定事件
                     */
                    var list = events[name] || (events[name] = []);
                    list.push({
                        callback : callback,
                        context  : context
                    });
                    return target;
                };
                target.off = function (name, callback) {
                    /*
                     * @description: 解绑事件
                     */
                    if (!name) {
                        events = {};
                    }
                    var list = events[name] || [],
                        i = list.length;
                    if (!callback) {
                        list = [];
                    } else {
                        while (i > 0) {
                            i --;
                            if (list[i].callback === callback) {
                                list.splice(i, 1);
                            }
                        }
                    }
                    return target;
                };
                target.emit = function () {
                    /*
                     * @description: 触发事件
                     */
                    var args = pastry.toArray(arguments),
                        list = events[args.shift()] || [];
                    pastry.each(list, function (evt) {
                        if (!evt.callback) {
                            pastry.LOG(evt, list);
                            pastry.ERROR('event callback is not defined');
                        }
                        evt.callback.apply(evt.context, args);
                    });
                    return target;
                };
                target.trigger = target.emit; // alias
                return target;
            };
        // }

    // add on(), off(), emit(), trigger() to pastry {
        event(pastry);
    // }
    // add .event to pastry {
        pastry.event = event;
    // }
}(this));


/* jshint strict: true, undef: true, unused: true */
// /* global */

var define;

(function (GLOBAL, undef) {
    'use strict';
    /*
     * @author      : wensen.lws
     * @description : 模块加载
     * @note        : 和 seajs、requirejs 的不同之一：define 的模块即时运行
     * @TODO        : id 重复定义报错
     */
    if (define) { // 避免反复执行以及和其它模块加载器冲突
        return;
    }

    var pastry = GLOBAL.pastry,

        event = pastry.event,

        each = pastry.each,

        Module = function (meta) {
            /*
             * @description: 模块构造函数
             */
            var mod = this;
            mod.initialise(meta);
            return mod;
        },

        // 缓存数据 {
            data = Module._data = {},

            moduleByUri   = data.moduleByUri   = {},
            exportsByUri  = data.exportsByUri  = {},
            executedByUri = data.executedByUri = {},
            queueByUri    = data.queueByUri    = {}, // 模块执行队列
        // }

        require;

    event(Module); // 加上事件相关函数: on(), off(), emit(), trigger()

    Module.prototype = {
        initialise: function (meta) {
            /*
             * @description: 初始化
             */
            var mod = this,
                id,
                uri,
                relativeUri;
            pastry.extend(mod, meta);
            Module.emit('module-initialised', mod);
            if (uri = mod.uri) {
                if (!moduleByUri[uri]) {
                    moduleByUri[uri] = mod;
                }
                if (!queueByUri[uri]) {
                    queueByUri[uri] = mod;
                }
            }
            if (id = mod.id) {
                if (!moduleByUri[id]) {
                    moduleByUri[id] = mod;
                }
            }
            if (relativeUri = mod.relativeUri) {
                if (!moduleByUri[relativeUri]) {
                    moduleByUri[relativeUri] = mod;
                }
                if (!queueByUri[relativeUri]) {
                    queueByUri[mod.relativeUri] = mod;
                }
            }
            return mod;
        },
        processDeps: function () {
            var mod = this;
            Module.emit('module-depsProcessed', mod);
            return mod;
        },
        execute: function () {
            var mod           = this,
                depModExports = [];
            if ('exports' in mod) {
                delete queueByUri[mod.uri];
                delete queueByUri[mod.relativeUri];
                return mod;
            }

            if (pastry.every(mod.deps, function (uri) {
                return !!executedByUri[uri];
            })) {
                var modFactory     = mod.factory,
                    modUri         = mod.uri,
                    modId          = mod.id,
                    modRelativeUri = mod.relativeUri;

                each(mod.deps, function (uri) {
                    depModExports.push(exportsByUri[uri]);
                });
                mod.exports =
                    exportsByUri[modUri] =
                    exportsByUri[modId] =
                    exportsByUri[modRelativeUri] = pastry.isFunction(modFactory) ?
                        modFactory.apply(undef, depModExports) : modFactory;
                executedByUri[modUri] =
                    executedByUri[modId] =
                    executedByUri[modRelativeUri] = true;
                delete queueByUri[modUri];
                Module.emit('module-executed', mod);
            }
            return mod;
        }
    };

    Module.on('module-executed', function () {
        /*
         * @description : 执行所有依赖于该模块的模块
         * @note        : hacking so hard
         */
        each(queueByUri, function (mod2BeExecuted/*, uri */) {
            if (mod2BeExecuted instanceof Module) {
                mod2BeExecuted.execute();
            }
        });
    });

    define = GLOBAL.define = Module.define = function (/* id, deps, factory */) {
        // 解释参数 {
            var args    = pastry.toArray(arguments),
                id      = pastry.isString(args[0]) ? args.shift() : undef,
                deps    = args.length > 1 ? args.shift() : [],
                factory = args[0],
                meta = {
                    id      : id,
                    uri     : id,
                    deps    : deps,
                    factory : factory
                },
                mod;
        // }
        // 需要对元数据进行处理就绑定这个事件 {
            Module.emit('module-metaGot', meta);
        // }
        // 新建实例、保存并且即时运行 {
            mod = new Module(meta)
                .processDeps()
                .execute();
        // }
        // define事件 {
            Module.emit('module-defined', mod);
        // }
    };

    define.amd = {}; // 最小 AMD 实现

    require = define; // 即时运行，require 和 define 等价

    // 核心模块定义 {
        define('pastry/Module', function () {
            return Module;
        });
        define('pastry/pastry', function () {
            return pastry;
        });
        define('pastry/event/base', function () {
            return pastry.event;
        });
    // }
    // 输出 require 函数 {
        pastry.setGLOBAL('require' , require);
    // }
}(this));

/* jshint strict: true, undef: true, unused: true */
/* global define, document, location */

define('pastry/module/path', [
    'pastry/pastry',
    'pastry/Module'
], function (
    pastry,
    Module
) {
    'use strict';
    /*
     * @author      : wensen.lws
     * @description : 模块路径问题
     * @reference   : https://github.com/seajs/seajs/blob/master/src/util-path.js
     * @note        : browser only
     */
    var
        // 正则 {
            re_absolute       = /^\/\/.|:\//,
            re_dirname        = /[^?#]*\//,
            re_dot            = /\/\.\//g,
            re_doubleDot      = /\/[^/]+\/\.\.\//,
            re_ignoreLocation = /^(about|blob):/,
            re_multiSlash     = /([^:/])\/+\//g,
            re_path           = /^([^/:]+)(\/.+)$/,
            re_rootDir        = /^.*?\/\/.*?\//,
        // }
        data         = Module._data,
        doc          = document,
        lc           = location,
        href         = lc.href,
        scripts      = doc.scripts,
        loaderScript = doc.getElementById('moduleLoader') || scripts[scripts.length - 1],
        loaderPath   = loaderScript.hasAttribute ? /* non-IE6/7 */ loaderScript.src : loaderScript.getAttribute('src', 4);

    function dirname(path) {
        // dirname('a/b/c.js?t=123#xx/zz') ==> 'a/b/'
        return path.match(re_dirname)[0];
    }
    function realpath(path) {
        path = path.replace(re_dot, '/'); // /a/b/./c/./d ==> /a/b/c/d
        // a//b/c ==> a/b/c
        // a///b/////c ==> a/b/c
        // DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
        path = path.replace(re_multiSlash, '$1/');
        while (path.match(re_doubleDot)) {
            // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
            path = path.replace(re_doubleDot, '/');
        }
        return path;
    }
    function normalize(path) {
        // normalize('path/to/a') ==> 'path/to/a.js'
        var last  = path.length - 1,
            lastC = path.charCodeAt(last);
        if (lastC === 35 /* '#' */) {
            // If the uri ends with `#`, just return it without '#'
            return path.substring(0, last);
        }
        return (path.substring(last - 2) === '.js' || path.indexOf('?') > 0 || lastC === 47 /* '/' */) ?
            path : (path + '.js');
    }
    function parseAlias(id) {
        var alias = data.alias;
        return alias && pastry.isString(alias[id]) ? alias[id] : id;
    }
    function parsePaths(id) {
        var m,
            paths = data.paths;
        if (paths && (m = id.match(re_path)) && pastry.isString(paths[m[1]])) {
            id = paths[m[1]] + m[2];
        }
        return id;
    }
    function addBase(id, refUri) {
        var ret,
            first = id.charCodeAt(0);

        if (re_absolute.test(id)) { // Absolute
            ret = id;
        } else if (first === 46 /* '.' */) { // Relative
            ret = (refUri ? dirname(refUri) : data.cwd) + id;
        } else if (first === 47 /* '/' */) { // Root
            var m = data.cwd.match(re_rootDir);
            ret = m ? m[0] + id.substring(1) : id;
        } else { // Top-level
            ret = data.base + id;
        }
        if (ret.indexOf('//') === 0) { // Add default protocol when uri begins with '//'
            ret = lc.protocol + ret;
        }
        return realpath(ret);
    }
    function id2Uri(id, refUri) {
        if (!id) {
            return '';
        }
        id = parseAlias(id);
        id = parsePaths(id);
        id = parseAlias(id);
        id = normalize(id);
        id = parseAlias(id);

        var uri = addBase(id, refUri);
        uri = parseAlias(uri);
        return uri;
    }

    data.cwd  = (!href || re_ignoreLocation.test(href)) ? '' : dirname(href);
    data.path = loaderPath;
    data.dir  = data.base = dirname(loaderPath || data.cwd);

    return {
        id2Uri : id2Uri
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/module/request', [
    'pastry/pastry',
    'pastry/Module'
], function (
    pastry,
    Module
) {
    'use strict';
    /*
     * @author      : wensen.lws
     * @description : 异步请求脚本或者其它资源
     * @note        : browser only
     * @reference   : https://github.com/seajs/seajs/blob/master/src/util-request.js
     */
    var doc         = document,
        head        = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement,
        baseElement = head.getElementsByTagName('base')[0];

    function addOnload(node, callback, url) {
        var supportOnload = 'onload' in node;

        function onload(error) {
            // Ensure only run once and handle memory leak in IE {
                node.onload = node.onerror = node.onreadystatechange = null;
            // }
            // Dereference the node {
                node = null;
            // }
            if (pastry.isFunction(callback)) {
                callback(error);
            }
        }

        if (supportOnload) {
            node.onload = onload;
            node.onerror = function () {
                Module.emit('error', { uri: url, node: node });
                onload(true);
            };
        } else {
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(node.readyState)) {
                    onload();
                }
            };
        }
    }
    function request(url, callback, charset, crossorigin) {
        var node = doc.createElement('script');

        if (charset) {
            var cs = pastry.isFunction(charset) ? charset(url) : charset;
            if (cs) {
                node.charset = cs;
            }
        }
        // crossorigin default value is `false`. {
            var cors = pastry.isFunction(crossorigin) ? crossorigin(url) : crossorigin;
            if (cors !== false) {
                node.crossorigin = cors;
            }
        // }
        addOnload(node, callback, url);

        node.async = true;
        node.src = url;

        /*
         * For some cache cases in IE 6-8, the script executes IMMEDIATELY after
         * the end of the insert execution, so use `currentlyAddingScript` to
         * hold current node, for deriving url in `define` call
         */
        Module.currentlyAddingScript = node;

        if (baseElement) {
            head.insertBefore(node, baseElement); // ref: #185 & http://dev.jquery.com/ticket/2709
        } else {
            head.appendChild(node);
        }
        Module.currentlyAddingScript = null;
    }

    return request;
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/module/loader', [
    'pastry/pastry',
    'pastry/Module',
    'pastry/module/path',
    'pastry/module/request'
], function (
    pastry,
    Module,
    path,
    request
) {
    'use strict';
    /*
     * @author      : wensen.lws
     * @description : 异步加载模块
     * @note        : browser only
     */
    var data          = Module._data,
        moduleByUri   = data.moduleByUri,
        executedByUri = data.executedByUri,
        loadingByUri  = data.loadingByUri = {},
        doc           = document,
        win           = window,
        id2Uri        = path.id2Uri,

        each = pastry.each,

        interactiveScript;

    Module.resolve = id2Uri;
    Module.request = request;

    function getCurrentScript() {
        if (Module.currentlyAddingScript) {
            return Module.currentlyAddingScript.src;
        }
        // 取得正在解析的script节点
        if (doc.currentScript) { // firefox 4+
            return doc.currentScript.src;
        }
        // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
        var stack;
        try {
            throw new Error();
        } catch(e) {
            // safari的错误对象只有line, sourceId, sourceURL
            stack = e.stack;
            if (!stack && win.opera) {
                // opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(' ');
            }
        }
        if (stack) {
            /*
             * e.stack最后一行在所有支持的浏览器大致如下:
             * chrome23: at http://113.93.50.63/data.js:4:1
             * firefox17: @http://113.93.50.63/query.js:4
             * opera12: @http://113.93.50.63/data.js:4
             * IE10: at Global code (http://113.93.50.63/data.js:4:1)
             */
            stack = stack.split( /[@ ]/g).pop(); // 取得最后一行,最后一个空格或@之后的部分
            stack = (stack[0] === '(') ? stack.slice(1, -1) : stack;
            return stack.replace(/(:\d+)?:\d+$/i, ''); // 去掉行号与或许存在的出错字符起始位置
        }
        if (interactiveScript && interactiveScript.readyState === "interactive") {
            return interactiveScript.src;
        }
        var nodes = doc.getElementsByTagName('script');
        for (var i = 0, node; node = nodes[i++];) {
            if (node.readyState === 'interactive') {
                interactiveScript = node;
                return node.src;
            }
        }
    }

    Module
        .on('module-metaGot', function (meta) {
            var src = getCurrentScript();
            if (src) {
                meta.uri = src;
            } else {
                meta.uri = data.cwd;
            }
            if (src === '' || (pastry.isString(src) && src === data.cwd)) {
                if (meta.id) { // script tag 中的具名模块
                    // meta.id = './' + meta.id; // @FIXME 去掉这个处理
                } else { // script tag 中的匿名模块
                    meta.uri = data.cwd + ('#' + pastry.uuid());
                }
            }
        })
        .on('module-initialised', function (mod) {
            var uri,
                id;
            if (!(pastry.isString(mod.uri) && mod.uri.indexOf('/') > -1)) {
                mod.uri = id2Uri(mod.id);
            }
            uri = mod.uri;
            // 同一 script 中定义了多个 id 的情况 {
                if (id = mod.id) {
                    mod.relativeUri = uri.indexOf(id + '.') > -1 ?
                        uri : id2Uri('./' + mod.id, mod.uri);
                }
            // }
        })
        .on('module-depsProcessed', function (mod) {
            each(mod.deps, function (id, index) {
                var uri;
                if (moduleByUri[id]) {
                    uri = id;
                } else {
                    uri = id2Uri(id, mod.relativeUri || mod.uri);
                }
                mod.deps[index] = uri;
                if (!moduleByUri[uri] && !loadingByUri[uri] && !executedByUri[uri]) {
                    request(uri);
                    loadingByUri[uri] = true;
                }
            });
        });
});



/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/date', [
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - date
     */

    function doubleDigit (n) {
        return n < 10 ? '0' + n : n;
    }
    function lms (ms) {
        var str = ms + '',
            len = str.length;
        return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
    }

    return pastry.fmtDate = function (date, pattern) {
        /*
         * @reference   : https://github.com/dojo/dojo/blob/master/json.js#L105
         * @description : return stringified date according to given pattern.
         * @parameter*  : {date  } date, input Date object
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @return      : {string} result string.
         * @syntax      : fmtDate(date, [pattern])
         * @example     :
         //    '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}.{Milliseconds}Z' => '2013-10-03T00:57::13.180Z'
         */
        if (pastry.isDate(date)) {
            pattern = pattern || '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}Z';

            return pattern.replace(/\{(\w+)\}/g, function (t, prop) {
                var fullProp = 'get' + ((prop === 'Year') ? prop : ('UTC' + prop)),
                    num = date[fullProp]() + ((prop === 'Month') ? 1 : 0);
                return prop === 'Milliseconds' ? lms(num) : doubleDigit(num);
            });
        } else {
            pastry.ERROR('not a Date instance');
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/sprintf', [
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - sprintf
     */

    function toInt (str, base) {
        return parseInt(str, base || 10);
    }

    var reg = /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([%bcdfosxX])/g,

        sprintf = function (format) {
            if (!pastry.isString(format)) {
                pastry.ERROR('sprintf: The first arguments need to be a valid format string.');
            }

            var part,
                parts      = [],
                paramIndex = 1,
                args       = pastry.toArray(arguments);

            while (part = reg.exec(format)) {
                if ((paramIndex >= args.length) && (part[8] !== '%')) {
                    pastry.ERROR('sprintf: At least one argument was missing.');
                }

                parts[parts.length] = {
                    begin     : part.index,
                    end       : part.index + part[0].length,
                    sign      : (part[1] === '+'),
                    negative  : (parseFloat(args[paramIndex]) < 0) ? true : false,
                    padding   : (pastry.isUndefined(part[2])) ? (' ') : ((part[2].substring(0, 1) === "'") ? (part[3]) : (part[2])),
                    alignLeft : (part[4] === '-'),
                    width     : (!pastry.isUndefined(part[5])) ? part[5] : false,
                    precision : (!pastry.isUndefined(part[7])) ? part[7] : false,
                    type      : part[8],
                    data      : (part[8] !== '%') ? String(args[paramIndex++]) : false
                };
            }

            var i, j, preSubStr, origLength,
                newString = '',
                start     = 0;

            for (i = 0; i < parts.length; i ++) {
                newString += format.substring(start, parts[i].begin);

                start = parts[i].end;

                preSubStr = '';
                switch (parts[i].type) {
                    case '%':
                        preSubStr = '%';
                        break;
                    case 'b':
                        preSubStr = Math.abs(toInt(parts[i].data)).toString(2);
                        break;
                    case 'c':
                        preSubStr = String.fromCharCode(Math.abs(toInt(parts[i].data)));
                        break;
                    case 'd':
                        preSubStr = String(Math.abs(toInt(parts[i].data)));
                        break;
                    case 'f':
                        preSubStr = (parts[i].precision === false) ?
                            (String((Math.abs(parseFloat(parts[i].data))))) :
                            (Math.abs(parseFloat(parts[i].data)).toFixed(parts[i].precision));
                        break;
                    case 'o':
                        preSubStr = Math.abs(toInt(parts[i].data)).toString(8);
                        break;
                    case 's':
                        preSubStr = parts[i].data.substring(0, parts[i].precision ? parts[i].precision : parts[i].data.length);
                        break;
                    case 'x':
                        preSubStr = Math.abs(toInt(parts[i].data)).toString(16).toLowerCase();
                        break;
                    case 'X':
                        preSubStr = Math.abs(toInt(parts[i].data)).toString(16).toUpperCase();
                        break;
                    default:
                        pastry.ERROR('sprintf: Unknown type "' + parts[i].type + '" detected. This should never happen. Maybe the regex is wrong.');
                }

                if (parts[i].type === '%') {
                    newString += preSubStr;
                    continue;
                }

                if (parts[i].width !== false) {
                    if (parts[i].width > preSubStr.length) {
                        origLength = preSubStr.length;
                        for(j = 0; j < parts[i].width - origLength; ++j) {
                            preSubStr = (parts[i].alignLeft === true) ?
                                (preSubStr + parts[i].padding) : (parts[i].padding + preSubStr);
                        }
                    }
                }

                if (
                    parts[i].type === 'b' ||
                    parts[i].type === 'd' ||
                    parts[i].type === 'o' ||
                    parts[i].type === 'f' ||
                    parts[i].type === 'x' ||
                    parts[i].type === 'X'
                ) {
                    if (parts[i].negative === true) {
                        preSubStr = '-' + preSubStr;
                    } else if (parts[i].sign === true) {
                        preSubStr = '+' + preSubStr;
                    }
                }
                newString += preSubStr;
            }

            newString += format.substring(start, format.length);
            return newString;
        };

    return pastry.sprintf = sprintf;
});

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/vsprintf', [
    'pastry/pastry',
    'pastry/fmt/sprintf'
], function (
    pastry,
    sprintf
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-29
     * @description : fmt 模块 - vsprintf
     */
    var vsprintf = function (fmt, argv) {
        argv.unshift(fmt);
        return sprintf.apply(null, argv);
    };

    return pastry.vsprintf = vsprintf;
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/camelCase', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     * @reference   : https://github.com/substack/camelize/blob/master/index.js
     */

    function camelise (str) {
        return str
            .replace(/^[_.\- ]+/, '')
            .replace(/[_.-](\w|$)/g, function (_, x) {
                return pastry.uc(x);
            });
    }
    function uncamelise (str, separator) {
        separator = separator || '_'; // default separator: _

        return str.replace(/([a-z])([A-Z])/g, function(_, a, b) {
            return a + separator + pastry.lc(b);
        });
    }
    function walk (obj, isUncamelise, separator) {
        /*
         * @NOTE: only the key strings will be transformed
         */
        if (!obj || !pastry.isObject(obj)) {
            return obj;
        }
        if (!obj || pastry.isDate(obj) || pastry.isRegExp(obj)) {
            return obj;
        }
        if (pastry.isArray(obj)) {
            return pastry.map(obj, function (value) {
                return walk(value, isUncamelise, separator);
            });
        }
        return pastry.reduce(pastry.keys(obj), function (acc, key) {
            var camel = isUncamelise ? uncamelise(key, separator) : camelise(key);
            acc[camel] = walk(obj[key], isUncamelise, separator);
            return acc;
        }, {});
    }

    return pastry.camelCase = {
        camelise: function (str) {
            if (pastry.isString(str)) {
                return camelise(str);
            }
            if (pastry.isObject(str)) {
                return walk(str);
            }
            return str;
        },
        uncamelise: function (str, separator) {
            if (pastry.isString(str)) {
                return uncamelise(str, separator);
            }
            if (pastry.isObject(str)) {
                return walk(str, true, separator);
            }
            return str;
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/class/c3mro', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var indexOf = pastry.indexOf;

    function cloneArray (arr) {
        return arr.slice(0);
    }
    function isGoodHead (head, rest) {
        var isGood = true;
        pastry.some(rest, function (lin) {
            if (indexOf(lin, head) > 0) {
                isGood = false;
            }
        });

        if (isGood) {
            pastry.each(rest, function (lin) {
                if (indexOf(lin, head) === 0) {
                    lin.shift();
                }
            });
        }
        return isGood;
    }
    function eachHead (bases) {
        var result = [],
            badLinearization = 0;

        while (bases.length) {
            var base = bases.shift();
            if (!base.length) {
                continue;
            }

            if (isGoodHead(base[0], bases)) {
                result.push(base.shift());
                badLinearization = 0;
            } else {
                badLinearization += 1;
                if (badLinearization === bases.length) {
                    pastry.ERROR('Bad Linearization');
                }
            }
            if (base.length) {
                bases.push(base);
            }
        }
        return result;
    }

    return pastry.c3mroMerge = function () {
        var bases = pastry.map(pastry.toArray(arguments), cloneArray);
        return eachHead(bases);
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/class/declare', [
    'pastry/pastry',
    'pastry/class/c3mro'
], function(
    pastry,
    c3mroMerge
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Class utils
     */

    return pastry.declare = function(/*name, superClasses, protoObj*/) {
        var uberClass,
            tempConstructor,
            lin          = '_linearization',
            args         = pastry.toArray(arguments),
            name         = pastry.isString(args[0]) ? args.shift() : '',
            superClasses = args.length > 1 ? args.shift() : [],
            protoObj     = args[0] ? args.shift() : {},
            bases        = [],
            Tmp          = function () {},
            hasCtor      = false,
            ctor         = function () {};

        superClasses = pastry.isArray(superClasses) ? superClasses : [superClasses];
        pastry.each(superClasses, function(clazz) {
            clazz[lin] = clazz[lin] || [clazz];
            bases.push(clazz[lin]);
        });

        if (bases.length) {
            bases.push(superClasses);
            bases = c3mroMerge.apply(null, bases);
        }

        tempConstructor = protoObj.constructor;
        if (tempConstructor !== Object.prototype.constructor) {
            hasCtor = true;
            ctor = tempConstructor;
        }

        ctor[lin]    = [ctor].concat(bases);
        ctor.parents = bases.slice(0);

        protoObj.constructor = ctor;
        while ((uberClass = bases.shift())) {
            protoObj = pastry.extend({}, uberClass.prototype, protoObj);
            Tmp.prototype = protoObj;
            if (!hasCtor) {
                protoObj.constructor = ctor;
            }
            protoObj = new Tmp();
        }

        ctor.className = name;
        ctor.prototype = protoObj;
        ctor.prototype.constructor = ctor;

        return ctor;
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/color/hexByName', [
], function(
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : 颜色 rgb 值列表
     */

    var named = {
        "aliceblue"            : "#f0f8ff",
        "antiquewhite"         : "#faebd7",
        "aqua"                 : "#00ffff",
        "aquamarine"           : "#7fffd4",
        "azure"                : "#f0ffff",
        "beige"                : "#f5f5dc",
        "bisque"               : "#ffe4c4",
        "black"                : "#000000",
        "blanchedalmond"       : "#ffebcd",
        "blue"                 : "#0000ff",
        "blueviolet"           : "#8a2be2",
        "brown"                : "#a52a2a",
        "burlywood"            : "#deb887",
        "burntsienna"          : "#ea7e5d",
        "cadetblue"            : "#5f9ea0",
        "chartreuse"           : "#7fff00",
        "chocolate"            : "#d2691e",
        "coral"                : "#ff7f50",
        "cornflowerblue"       : "#6495ed",
        "cornsilk"             : "#fff8dc",
        "crimson"              : "#dc143c",
        "cyan"                 : "#00ffff",
        "darkblue"             : "#00008b",
        "darkcyan"             : "#008b8b",
        "darkgoldenrod"        : "#b8860b",
        "darkgray"             : "#a9a9a9",
        "darkgreen"            : "#006400",
        "darkgrey"             : "#a9a9a9",
        "darkkhaki"            : "#bdb76b",
        "darkmagenta"          : "#8b008b",
        "darkolivegreen"       : "#556b2f",
        "darkorange"           : "#ff8c00",
        "darkorchid"           : "#9932cc",
        "darkred"              : "#8b0000",
        "darksalmon"           : "#e9967a",
        "darkseagreen"         : "#8fbc8f",
        "darkslateblue"        : "#483d8b",
        "darkslategray"        : "#2f4f4f",
        "darkslategrey"        : "#2f4f4f",
        "darkturquoise"        : "#00ced1",
        "darkviolet"           : "#9400d3",
        "deeppink"             : "#ff1493",
        "deepskyblue"          : "#00bfff",
        "dimgray"              : "#696969",
        "dimgrey"              : "#696969",
        "dodgerblue"           : "#1e90ff",
        "firebrick"            : "#b22222",
        "floralwhite"          : "#fffaf0",
        "forestgreen"          : "#228b22",
        "fuchsia"              : "#ff00ff",
        "gainsboro"            : "#dcdcdc",
        "ghostwhite"           : "#f8f8ff",
        "gold"                 : "#ffd700",
        "goldenrod"            : "#daa520",
        "gray"                 : "#808080",
        "green"                : "#008000",
        "greenyellow"          : "#adff2f",
        "grey"                 : "#808080",
        "honeydew"             : "#f0fff0",
        "hotpink"              : "#ff69b4",
        "indianred"            : "#cd5c5c",
        "indigo"               : "#4b0082",
        "ivory"                : "#fffff0",
        "khaki"                : "#f0e68c",
        "lavender"             : "#e6e6fa",
        "lavenderblush"        : "#fff0f5",
        "lawngreen"            : "#7cfc00",
        "lemonchiffon"         : "#fffacd",
        "lightblue"            : "#add8e6",
        "lightcoral"           : "#f08080",
        "lightcyan"            : "#e0ffff",
        "lightgoldenrodyellow" : "#fafad2",
        "lightgray"            : "#d3d3d3",
        "lightgreen"           : "#90ee90",
        "lightgrey"            : "#d3d3d3",
        "lightpink"            : "#ffb6c1",
        "lightsalmon"          : "#ffa07a",
        "lightseagreen"        : "#20b2aa",
        "lightskyblue"         : "#87cefa",
        "lightslategray"       : "#778899",
        "lightslategrey"       : "#778899",
        "lightsteelblue"       : "#b0c4de",
        "lightyellow"          : "#ffffe0",
        "lime"                 : "#00ff00",
        "limegreen"            : "#32cd32",
        "linen"                : "#faf0e6",
        "magenta"              : "#ff00ff",
        "maroon"               : "#800000",
        "mediumaquamarine"     : "#66cdaa",
        "mediumblue"           : "#0000cd",
        "mediumorchid"         : "#ba55d3",
        "mediumpurple"         : "#9370db",
        "mediumseagreen"       : "#3cb371",
        "mediumslateblue"      : "#7b68ee",
        "mediumspringgreen"    : "#00fa9a",
        "mediumturquoise"      : "#48d1cc",
        "mediumvioletred"      : "#c71585",
        "midnightblue"         : "#191970",
        "mintcream"            : "#f5fffa",
        "mistyrose"            : "#ffe4e1",
        "moccasin"             : "#ffe4b5",
        "navajowhite"          : "#ffdead",
        "navy"                 : "#000080",
        "oldlace"              : "#fdf5e6",
        "olive"                : "#808000",
        "olivedrab"            : "#6b8e23",
        "orange"               : "#ffa500",
        "orangered"            : "#ff4500",
        "orchid"               : "#da70d6",
        "palegoldenrod"        : "#eee8aa",
        "palegreen"            : "#98fb98",
        "paleturquoise"        : "#afeeee",
        "palevioletred"        : "#db7093",
        "papayawhip"           : "#ffefd5",
        "peachpuff"            : "#ffdab9",
        "peru"                 : "#cd853f",
        "pink"                 : "#ffc0cb",
        "plum"                 : "#dda0dd",
        "powderblue"           : "#b0e0e6",
        "purple"               : "#800080",
        "rebeccapurple"        : "#663399",
        "red"                  : "#ff0000",
        "rosybrown"            : "#bc8f8f",
        "royalblue"            : "#4169e1",
        "saddlebrown"          : "#8b4513",
        "salmon"               : "#fa8072",
        "sandybrown"           : "#f4a460",
        "seagreen"             : "#2e8b57",
        "seashell"             : "#fff5ee",
        "sienna"               : "#a0522d",
        "silver"               : "#c0c0c0",
        "skyblue"              : "#87ceeb",
        "slateblue"            : "#6a5acd",
        "slategray"            : "#708090",
        "slategrey"            : "#708090",
        "snow"                 : "#fffafa",
        "springgreen"          : "#00ff7f",
        "steelblue"            : "#4682b4",
        "tan"                  : "#d2b48c",
        "teal"                 : "#008080",
        "thistle"              : "#d8bfd8",
        "tomato"               : "#ff6347",
        "turquoise"            : "#40e0d0",
        "violet"               : "#ee82ee",
        "wheat"                : "#f5deb3",
        "white"                : "#ffffff",
        "whitesmoke"           : "#f5f5f5",
        "yellow"               : "#ffff00",
        "yellowgreen"          : "#9acd32"
    };

    return named;
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/color/Base', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/color/hexByName'
], function(
    pastry,
    declare,
    hexByName
) {
    'use strict';
    /*
     * @author      : 绝云
     * @description : 颜色构造函数
     * @note        : can be used in nodejs
     */
    var lc    = pastry.lc,
        round = Math.round,

        initProps = {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        },

        Color = function (/*Array|String|Object*/ color) {
            var instance = this;

            if (color) {
                instance.initialise(color);
            }
        },

        classMaker;

    pastry.extend(Color, {
        hexByName: hexByName,

        makeGrey: function (/*Number*/ g, /*Number?*/ a) {
            return Color.fromArray([g, g, g, a]);
        },

        blendColors : function(/*Color*/ start, /*Color*/ end, /*Number*/ weight, /*Color?*/ obj){
            var t = obj || new Color();
            pastry.each(['r', 'g', 'b', 'a'], function(x){
                t[x] = start[x] + (end[x] - start[x]) * weight;
                if (x !== 'a') {
                    t[x] = Math.round(t[x]);
                }
            });
            return t.sanitize();
        },

        fromHex: function (/*String*/ color, /*Color?*/ obj) {
            var result = obj || new Color(),
                bits   = (color.length === 4) ? 4 : 8,
                mask   = (1 << bits) - 1;

            color = Number('0x' + color.substr(1));

            if (pastry.isNaN(color)) {
                return null;
            }
            pastry.each(['b', 'g', 'r'], function (x) {
                var c = color & mask;
                color >>= bits;
                result[x] = bits === 4 ? 17 * c : c;
            });
            result.a = 1;
            return result;
        },
        fromRgb: function (/*String*/ color, /*Color?*/ obj) {
            var matches = lc(color).match(/^rgba?\(([\s\.,0-9]+)\)/);
            return matches && Color.fromArray(matches[1].split(/\s*,\s*/), obj);
        },
        fromHsl: function (/*String*/ color, /*Color?*/ obj) {
            var matches = lc(color).match(/^hsla?\(([\s\.,0-9]+)\)/);
            if (matches) {
                var c  = matches[2].split(/\s*,\s*/),
                    l  = c.length,
                    H  = ((parseFloat(c[0]) % 360) + 360) % 360 / 360,
                    S  = parseFloat(c[1]) / 100,
                    L  = parseFloat(c[2]) / 100,
                    m2 = L <= 0.5 ? L * (S + 1) : L + S - L * S,
                    m1 = 2 * L - m2,
                    a  = [
                        hue2rgb(m1, m2, H + 1 / 3) * 256,
                        hue2rgb(m1, m2, H) * 256,
                        hue2rgb(m1, m2, H - 1 / 3) * 256,
                        1
                    ];
                if(l === 4){
                    a[3] = c[3];
                }
                return Color.fromArray(a, obj);
            }
        },
        fromArray: function (/*Array*/ arr, /*Color?*/ obj) {
            var result = obj || new Color();
            result.set(Number(arr[0]), Number(arr[1]), Number(arr[2]), Number(arr[3]));
            if (isNaN(result.a)) {
                result.a = 1;
            }
            return result.sanitize();
        },
        fromString: function (/*String*/ str, /*Color?*/ obj) {
            var s = Color.hexByName[str];
            return s && Color.fromHex(s, obj) ||
                Color.fromRgb(str, obj) ||
                Color.fromHex(str, obj) ||
                Color.fromHsl(str, obj);
        }
    });


    function confine (c, low, high) {
        c = Number(c);
        return pastry.isFinite(c) ? (c < low ? low : c > high ? high : c) : high;
    }
    function hue2rgb (m1, m2, h) {
        if (h < 0) {
            ++h;
        }
        if (h > 1) {
            --h;
        }
        var h6 = 6 * h;
        if (h6 < 1) {
            return m1 + (m2 - m1) * h6;
        }
        if (2 * h < 1) {
            return m2;
        }
        if (3 * h < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        return m1;
    }
    function rgb2hsl (r, g, b, a) {
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h, s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2;               break;
                case b: h = (r - g) / d + 4;               break;
            }
            h /= 6;
        }
        return [h, s, l, a];
    }

    classMaker = pastry.extend(initProps, {
        constructor: Color,
        initialise: function (color) {
            var instance = this;
            if (pastry.isString(color)) {
                Color.fromString(color, this);
            } else if (pastry.isArray(color)) {
                Color.fromArray(color, this);
            } else {
                instance.set(color.r, color.g, color.b, color.a);
                if (!(color instanceof Color)) {
                    instance.sanitize();
                }
            }
            return instance;
        },
        set: function(r, g, b, a){
            var instance = this;
            instance.r = r;
            instance.g = g;
            instance.b = b;
            instance.a = a;
            return instance;
        },
        sanitize: function () {
            var instance = this;

            instance.r = round(confine(instance.r, 0, 255));
            instance.g = round(confine(instance.g, 0, 255));
            instance.b = round(confine(instance.b, 0, 255));
            instance.a = confine(instance.a, 0, 1);
            return instance;
        },
        toRgba: function () {
            var instance = this;
            return [instance.r, instance.g, instance.b, instance.a];
        },
        toHsla: function () {
            var instance = this;
            return rgb2hsl(instance.r, instance.g, instance.b, instance.a);
        },
        toHex: function () {
            var instance = this,
                arr = pastry.map(['r', 'g', 'b'], function (x) {
                    var str = instance[x].toString(16);
                    return str.length < 2 ? '0' + str : str;
                });
            return '#' + arr.join('');
        },
        toCss: function (/*Boolean?*/ includeAlpha) {
            var instance = this,
                rgb = instance.r + ', ' + instance.g + ', ' + instance.b;
            return (includeAlpha ? 'rgba(' + rgb + ',' + instance.a : 'rgb(' + rgb) + ')';
        },
        toString: function () {
            return this.toCss(true);
        },
        toGrey: function () {
            var instance = this,
                g = round((instance.r + instance.g + instance.b) / 3);
            return Color.makeGrey(g, instance.a);
        },
        destroy: function () {
            pastry.destroy(this);
        }
    });

    return pastry.Color = declare('Color', classMaker);
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/parser/json', [
    'pastry/pastry',
    'pastry/fmt/date'
], function (
    pastry,
    fmtDate
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : shim 模块 - JSON
     * @reference   : https://github.com/dojo/dojo/blob/master/json.js
     */
    function exportJSON (obj) {
        /*
         * export JSON object
         */
        pastry.json = obj;
        pastry.setGLOBAL('JSON', obj);
    }

    if (JSON && !!JSON.parse && !!JSON.stringify) {
        exportJSON(JSON);
        return JSON;
    }

    var D2JSON = Date.prototype.toJSON,
        // saving codes {
            isFunction = pastry.isFunction,
            isString   = pastry.isString,
            isNumber   = pastry.isNumber;
        // }

    // 补全基础数据类型的 toJSON 方法 {
        if (!isFunction(D2JSON)) {
            pastry.each([
                String.prototype,
                Number.prototype,
                Boolean.prototype
            ], function (p) {
                p.toJSON = function () {
                    return this.valueOf();
                };
            });
            D2JSON = function () {
                return isFinite(this.valueOf()) ? fmtDate(this) : null;
            };
        }
    // }

    var undef,
        escapeString = function (/*String*/str) {
            return ('"' + str.replace(/(["\\])/g, '\\$1') + '"')
                .replace(/[\f]/g, '\\f')
                .replace(/[\b]/g, '\\b')
                .replace(/[\n]/g, '\\n')
                .replace(/[\t]/g, '\\t')
                .replace(/[\r]/g, '\\r');
        },
        shim = {
            parse: function (str, strict) {
                /*
                 * @description: 从 JSON 字符串得到一个数据结构
                 */
                if (strict && !/^([\s\[\{]*(?:"(?:\\.|[^"])*"|-?\d[\d\.]*(?:[Ee][+-]?\d+)?|null|true|false|)[\s\]\}]*(?:,|:|$))+$/.test(str)) {
                    pastry.ERROR('Invalid characters in JSON');
                }
                /* jshint -W061 */
                return eval('(' + str + ')');
            },
            stringify: function (value, replacer, spacer) {
                /*
                 * @description: 把内置数据类型转为 JSON 字符串
                 */
                if (isString(replacer)) {
                    spacer = replacer;
                    replacer = null;
                }
                function stringify (it, indent, key) {
                    if (replacer) {
                        it = replacer(key, it);
                    }
                    var val;
                    if (isNumber(it)) {
                        return isFinite(it) ? it + '' : 'null';
                    }
                    if (pastry.isBoolean(it)) {
                        return it + '';
                    }
                    if (it === null) {
                        return 'null';
                    }
                    if (isString(it)) {
                        return escapeString(it);
                    }
                    if (isFunction(it) || !it) {
                        return undef;
                    }
                    if (isFunction(it.toJSON)) {
                        return stringify(it.toJSON(key), indent, key);
                    }
                    if (pastry.isDate(it)) {
                        return fmtDate(it);
                    }
                    if (it.valueOf() !== it) {
                        return stringify(it.valueOf(), indent, key);
                    }
                    var nextIndent= spacer ? (indent + spacer) : '',
                        sep = spacer ? ' ' : '',
                        newLine = spacer ? '\n' : '';

                    if (pastry.isArray(it)) {
                        var itl = it.length,
                            res = [];
                        for (key = 0; key < itl; key++) {
                            var obj = it[key];
                            val = stringify(obj, nextIndent, key);
                            if (!isString(val)) {
                                val = 'null';
                            }
                            res.push(newLine + nextIndent + val);
                        }
                        return '[' + res.join(',') + newLine + indent + ']';
                    }
                    var output = [];
                    for (key in it) {
                        var keyStr;
                        if (it.hasOwnProperty(key)) {
                            if (isNumber(key)) {
                                keyStr = '"' + key + '"';
                            } else if (isString(key)) {
                                keyStr = escapeString(key);
                            } else {
                                continue;
                            }
                            val = stringify(it[key], nextIndent, key);
                            if (!isString(val)) {
                                continue;
                            }
                            output.push(newLine + nextIndent + keyStr + ':' + sep + val);
                        }
                    }
                    return '{' + output.join(',') + newLine + indent + '}';
                }
                return stringify(value, '', '');
            }
        };

    exportJSON(shim);
    return shim;
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/html/utils', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : utils for html
     */
    var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        },
        unescapeMap = pastry.invert(escapeMap);

    function createEscaper (map) {
        // Regexes for identifying a key that needs to be escaped
        var source        = '(?:' + pastry.keys(map).join('|') + ')',
            testRegexp    = new RegExp(source),
            replaceRegexp = new RegExp(source, 'g');

        function escaper (match) {
            return map[match];
        }

        return function (string) {
            string = string === null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    }

    return {
        escape   : pastry.escape   = createEscaper(escapeMap),
        unescape : pastry.unescape = createEscaper(unescapeMap)
    };
});


/* jshint strict: true, undef: true */
/* global define */

define('pastry/parser/template', [
    'pastry/pastry',
    'pastry/html/utils'
], function(
    pastry,
    htmlUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : template engine
     */
    var template,
        cache     = {},
        helper    = {},
        RE_parser = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
        // defaultOpitons = {}; // TODO add grammar aliases, etc.

    function render (s, p1, p2, p3, p4, p5) {
        if (p1) { // whitespace, quote and backspace in HTML context
            return {
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t",
                " " : " "
            }[p1] || "\\" + p1;
        }
        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            p3 = pastry.trim(p3);
            if (p2 === "=") {
                return "'+_e(" + p3 + ")+'";
            }
            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
        }
        if (p4) { // evaluation start tag: {%
            return "';";
        }
        if (p5) { // evaluation end tag: %}
            return "_s+='";
        }
    }

    // add helpers to pastry to pass to compiled functions, can be extended {
        // helper.escape = htmlUtils.escape;
        pastry.extend(helper, htmlUtils);
    // }

    return pastry.template = template = {
        helper: helper,
        compile: function (str) {
            if (!pastry.isString(str)) {
                return str;
            }

            /*jshint -W054*/ // new Function()
            return cache[str] || (cache[str] = new Function('obj', 'helper', 'ne',
                    "var _e=ne?function(s){return s;}:helper.escape," +
                        "print=function(s,e){" +
                            "_s+=e?(s==null?'':s):_e(s);" +
                        "};" +
                    "obj=obj||{};" + // 当obj传空的时候
                    "with(obj){" +
                        // include helper {
                            // "include = function (s, d) {" +
                            //     "_s += tmpl(s, d);}" + "," +
                        // }
                        "_s='" +
                        str
                            .replace(RE_parser, render)
                            .replace(/\\n\s*/g, '') + // 要是存在回车符号，会引起多解释一个 #text 对象的 bug
                        "';" +
                    "}" +
                    "return _s;"
                )
            );
        },
        render: function (str, data, option) {
            option = option || {};
            return template.compile(str)(data, template.helper, option.ne);
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/dom/hotkey', [
    'pastry/pastry',
    'pastry/bom/utils',
    'pastry/dom/class',
    'pastry/dom/event'
], function(
    pastry,
    bomUtils,
    domClass,
    domEvent
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : bind / unbind / trigger hotkeys
     * @reference   : https://github.com/ccampbell/mousetrap/blob/master/mousetrap.js
     */
    var hotkey,
        doc = document,

        _MAP = {
            8   : 'backspace',
            9   : 'tab',
            13  : 'enter',
            16  : 'shift',
            17  : 'ctrl',
            18  : 'alt',
            20  : 'capslock',
            27  : 'esc',
            32  : 'space',
            33  : 'pageup',
            34  : 'pagedown',
            35  : 'end',
            36  : 'home',
            37  : 'left',
            38  : 'up',
            39  : 'right',
            40  : 'down',
            45  : 'ins',
            46  : 'del',
            91  : 'meta',
            93  : 'meta',
            224 : 'meta'
        },
        _KEYCODE_MAP = {
            106 : '*',
            107 : '+',
            109 : '-',
            110 : '.',
            111 : '/',
            186 : ';',
            187 : '=',
            188 : ',',
            189 : '-',
            190 : '.',
            191 : '/',
            192 : '`',
            219 : '[',
            220 : '\\',
            221 : ']',
            222 : '\''
        },
        _SHIFT_MAP = {
            '~'  : '`',
            '!'  : '1',
            '@'  : '2',
            '#'  : '3',
            '$'  : '4',
            '%'  : '5',
            '^'  : '6',
            '&'  : '7',
            '*'  : '8',
            '('  : '9',
            ')'  : '0',
            '_'  : '-',
            '+'  : '=',
            ':'  : ';',
            '\"' : '\'',
            '<'  : ',',
            '>'  : '.',
            '?'  : '/',
            '|'  : '\\'
        },
        _SPECIAL_ALIASES = {
            'option'  : 'alt',
            'command' : 'meta',
            'return'  : 'enter',
            'escape'  : 'esc',
            'mod'     : bomUtils.isApple
        },
        _REVERSE_MAP,

        _resetTimer,
        _callbacks          = {},
        _directMap          = {},
        _sequenceLevels     = {},
        _ignoreNextKeyup    = false,
        _ignoreNextKeypress = false,
        _nextExpectedAction = false,

        lc      = pastry.lc,
        indexOf = pastry.indexOf,
        each    = pastry.each;

    // fulfill key maps {
        for (var i = 1; i < 20; ++i) {
            _MAP[111 + i] = 'f' + i;
        }
        for (i = 0; i <= 9; ++i) {
            _MAP[i + 96] = i;
        }
    // }

    function _characterFromEvent(e) {
        var which = e.which;
        if (e.type === 'keypress') {
            var character = String.fromCharCode(which);

            if (!e.shiftKey) {
                character = lc(character);
            }
            return character;
        }

        if (_MAP[which]) {
            return _MAP[which];
        }
        if (_KEYCODE_MAP[which]) {
            return _KEYCODE_MAP[which];
        }
        return lc(String.fromCharCode(which));
    }
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }
    function _resetSequences(doNotReset) {
        doNotReset = doNotReset || {};

        var activeSequences = false,
            key;

        for (key in _sequenceLevels) {
            if (doNotReset[key]) {
                activeSequences = true;
                continue;
            }
            _sequenceLevels[key] = 0;
        }
        if (!activeSequences) {
            _nextExpectedAction = false;
        }
    }
    function _isModifier(key) {
        return indexOf(['shift', 'ctrl', 'alt', 'meta'], key) > -1;
    }
    function _getMatches(character, modifiers, e, sequenceName, combination, level) {
        var i,
            callback,
            matches = [],
            action = e.type;

        if (!_callbacks[character]) {
            return [];
        }
        if (action === 'keyup' && _isModifier(character)) {
            modifiers = [character];
        }

        for (i = 0; i < _callbacks[character].length; ++i) {
            callback = _callbacks[character][i];
            if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] !== callback.level) {
                continue;
            }
            if (action !== callback.action) {
                continue;
            }
            if ((action === 'keypress' && !e.metaKey && !e.ctrlKey) ||
                _modifiersMatch(modifiers, callback.modifiers)) {
                var deleteCombo = !sequenceName && callback.combo === combination,
                    deleteSequence = sequenceName &&
                        callback.seq === sequenceName &&
                        callback.level === level;
                if (deleteCombo || deleteSequence) {
                    _callbacks[character].splice(i, 1);
                }
                matches.push(callback);
            }
        }
        return matches;
    }
    function _eventModifiers(e) {
        var modifiers = [];

        each([
            'shift',
            'alt',
            'ctrl',
            'meta'
        ], function (type) {
            if (e[type + 'Key']) {
                modifiers.push(type);
            }
        });
        return modifiers;
    }
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }
        e.returnValue = false;
    }
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }
        e.cancelBubble = true;
    }
    function _fireCallback(callback, e, combo, sequence) {
        if (hotkey.stop(e, e.target || e.srcElement, combo, sequence)) {
            return;
        }
        if (callback(e, combo) === false) {
            _preventDefault(e);
            _stopPropagation(e);
        }
    }
    function _handleKey(character, modifiers, e) {
        var callbacks = _getMatches(character, modifiers, e),
            i,
            doNotReset = {},
            maxLevel = 0,
            processedSequenceCallback = false;

        for (i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].seq) {
                maxLevel = Math.max(maxLevel, callbacks[i].level);
            }
        }
        for (i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].seq) {
                if (callbacks[i].level !== maxLevel) {
                    continue;
                }
                processedSequenceCallback = true;
                doNotReset[callbacks[i].seq] = 1;
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                continue;
            }
            if (!processedSequenceCallback) {
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
            }
        }
        var ignoreThisKeypress = e.type === 'keypress' && _ignoreNextKeypress;
        if (e.type === _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
            _resetSequences(doNotReset);
        }

        _ignoreNextKeypress = processedSequenceCallback && e.type === 'keydown';
    }
    function _handleKeyEvent(e) {
        if (!pastry.isNumber(e.which)) {
            e.which = e.keyCode;
        }
        var character = _characterFromEvent(e);
        if (!character) {
            return;
        }
        if (e.type === 'keyup' && _ignoreNextKeyup === character) {
            _ignoreNextKeyup = false;
            return;
        }
        hotkey.handleKey(character, _eventModifiers(e), e);
    }
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }
    function _pickBestAction(key, modifiers, action) {
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }
        if (action === 'keypress' && modifiers.length) {
            action = 'keydown';
        }
        return action;
    }
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }
        return combination.split('+');
    }
    function _getKeyInfo(combination, action) {
        var keys,
            key,
            i,
            modifiers = [];
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            if (action && action !== 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        action = _pickBestAction(key, modifiers, action);
        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }
    function _resetSequenceTimer() {
        clearTimeout(_resetTimer);
        _resetTimer = setTimeout(_resetSequences, 1000);
    }
    function _bindSequence(combo, keys, callback, action) {
        _sequenceLevels[combo] = 0;

        function _increaseSequence(nextAction) {
            return function() {
                _nextExpectedAction = nextAction;
                ++_sequenceLevels[combo];
                _resetSequenceTimer();
            };
        }
        function _callbackAndReset(e) {
            _fireCallback(callback, e, combo);
            if (action !== 'keyup') {
                _ignoreNextKeyup = _characterFromEvent(e);
            }

            setTimeout(_resetSequences, 10);
        }

        for (var i = 0; i < keys.length; ++i) {
            var isFinal = i + 1 === keys.length,
                wrappedCallback = isFinal ? _callbackAndReset :
                    _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
            _bindSingle(keys[i], wrappedCallback, action, combo, i);
        }
    }
    function _bindSingle(combination, callback, action, sequenceName, level) {
        _directMap[combination + ':' + action] = callback;
        combination = combination.replace(/\s+/g, ' ');

        var sequence = combination.split(' '),
            info;

        if (sequence.length > 1) {
            _bindSequence(combination, sequence, callback, action);
            return;
        }

        info = _getKeyInfo(combination, action);

        _callbacks[info.key] = _callbacks[info.key] || [];

        _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

        _callbacks[info.key][sequenceName ? 'unshift' : 'push']({
            callback: callback,
            modifiers: info.modifiers,
            action: info.action,
            seq: sequenceName,
            level: level,
            combo: combination
        });
    }
    function _bindMultiple(combinations, callback, action) {
        each(combinations, function (combination) {
            _bindSingle(combination, callback, action);
        });
    }

    each([
        'keypress',
        'keydown' ,
        'keyup'
    ], function (type) {
        domEvent.on(doc, type, _handleKeyEvent);
    });

    return hotkey = {
        on: function (keys, callback, action) {
            keys = pastry.isArray(keys) ? keys : [keys];
            _bindMultiple(keys, callback, action);
            return this;
        },
        off: function (keys, action) {
            return hotkey.on(keys, function () {}, action);
        },
        trigger: function (keys, action) {
            if (_directMap[keys + ':' + action]) {
                _directMap[keys + ':' + action]({}, keys);
            }
            return this;
        },
        reset: function () {
            _callbacks = {};
            _directMap = {};
            return this;
        },
        stop: function (e, element) {
            // stop for input / select / textarea / contentEditable
            if (domClass.contains(element, 'js-hotkey')) {
                // if element has the classname 'js-hotkey', then no need to stop
                return false;
            }
            var tagName = element.tagName;
            return indexOf(['INPUT', 'SELECT', 'TEXTAREA'], tagName) > -1 ||
                element.isContentEditable;
        },
        handleKey: _handleKey
    };
});


define("pastry/dom/hotkey.js", function(){});

/* jshint strict: true, undef: true, unused: true */
/* global define, location, navigator, ActiveXObject */

define('pastry/bom/utils', [
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云 (wensen.lws@alibaba-inc.com)
     * @description : 记录各种浏览器相关的版本号
     * @note        : browser only
     */
    var nav       = navigator || {},
        userAgent = nav.userAgent,
        platform  = nav.platform,
        plugins   = nav.plugins,
        versions  = {},
        detectedPlatform,
        detectedPlugins;

    function toInt (value, base) {
        return parseInt(value, base || 10);
    }
    function setVerInt (versions, key, strVal) {
        versions[key] = toInt(strVal);
    }
    function setVer (versions, str, reg) {
        var matched = str.match(reg);
        if (matched) {
            setVerInt(versions, matched[0].match(/\w*/)[0], matched[1] || 0);
        }
    }
    function detectPlatform (str) {
        /*
         * @description : detect platform
         * @param       : {string} platformStr, platform defined string.
         * @syntax      : detectPlatform(platformStr)
         * @return      : {string} platform. (mac|windows|linux...)
         */
        if (!str) {
            return;
        }
        var result = pastry.lc(str).match(/mac|win|linux|ipad|ipod|iphone|android/);
        return pastry.isArray(result) ? result[0] : result;
    }
    function detectPlugin (arr) {
        /*
         * @description : detect plugins (now flash only)
         * @param       : {array } plugins, plugin list
         * @syntax      : detectPlugin(plugins)
         * @return      : {object} { 'flash' : 0|xx }
         */

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
                return toInt(v);
            }())
        };
    }
    function detectVersion (str) {
        /*
         * @description : detect versions
         * @param       : {string} userAgent, window.navigator.userAgent
         * @syntax      : detectVerion(userAgent)
         * @return      : {object} { 'flash' : 0|xx }
         */

        if (!str) {
            return;
        }
        str = pastry.lc(str);
        var ieVer,
            matched,
            result = {};

        // browser result {
            pastry.each([
                /msie ([\d.]+)/     ,
                /firefox\/([\d.]+)/ ,
                /chrome\/([\d.]+)/  ,
                /crios\/([\d.]+)/   ,
                /opera.([\d.]+)/    ,
                /adobeair\/([\d.]+)/
            ], function (reg) {
                setVer(result, str, reg);
            });
        // }
        // chrome {
            if (result.crios) {
                result.chrome = result.crios;
            }
        // }
        // safari {
            matched = str.match(/version\/([\d.]+).*safari/);
            if (matched) {
                setVerInt(result, 'safari', matched[1] || 0);
            }
        // }
        // safari mobile {
            matched = str.match(/version\/([\d.]+).*mobile.*safari/);
            if (matched) {
                setVerInt(result, 'mobilesafari', matched[1] || 0);
            }
        // }
        // engine result {
            pastry.each([
                /trident\/([\d.]+)/     ,
                /gecko\/([\d.]+)/       ,
                /applewebkit\/([\d.]+)/ ,
                /webkit\/([\d.]+)/      , // 单独存储 webkit 字段
                /presto\/([\d.]+)/
            ], function (reg) {
                setVer(result, str, reg);
            });
            // IE {
                ieVer = result.msie;
                if (ieVer === 6) {
                    result.trident = 4;
                } else if (ieVer === 7 || ieVer === 8) {
                    result.trident = 5;
                }
            // }
        // }
        return result;
    }

    detectedPlugins  = detectPlugin(plugins);
    detectedPlatform = detectPlatform(platform) || detectPlatform(userAgent) || 'unknown';

    pastry.extend(versions, detectVersion(userAgent), detectedPlugins);

    return {
        host      : location.host,
        platform  : detectPlatform,
        plugins   : detectedPlugins,
        userAgent : userAgent,
        versions  : versions,
        isWebkit  : !!versions.webkit,
        isIE      : !!versions.msie,
        isApple   : (
            detectedPlatform.mac    ||
            detectedPlatform.ipad   ||
            detectedPlatform.ipod   ||
            detectedPlatform.iphone
        )
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/utils', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : utils for dom operations
     * @note        : browser only
     */
    var doc     = document,
        html    = doc.documentElement,
        testDiv = doc.createElement('div');

    return {
        hasTextContent : 'textContent' in testDiv,
        hasClassList   : 'classList'   in testDiv,
        hasDataSet     : 'dataset'     in testDiv,
        isQuirks       : pastry.lc(doc.compatMode) === 'backcompat' || doc.documentMode === 5, // 怪异模式
        testDiv        : testDiv,

        contains: 'compareDocumentPosition' in html ?
            function (element, container) {
                return (container.compareDocumentPosition(element) & 16) === 16;
            } :
            function (element, container) {
                container = (container === doc || container === window) ?
                    html : container;
                return container !== element &&
                    container.contains(element);
            },
        isNode: function (element) {
            var t;
            return element &&
                typeof element === 'object' &&
                (t = element.nodeType) && (t === 1 || t === 9);
        },
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/query', [
    'pastry/pastry',
    'pastry/dom/utils'
], function(
    pastry,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : selector
     * @note        : browser only
     * @note        : MODERN browsers only
     */
    var // utils {
            toArray   = pastry.toArray,
            arrayLike = pastry.isArrayLike,
            isString  = pastry.isString,
            isNode    = domUtils.isNode,
            contains  = domUtils.contains,
            testDiv   = domUtils.testDiv,
        // }
        // matchesSelector {
            matchesSelector = testDiv.matches ||
                testDiv.webkitMatchesSelector ||
                testDiv.mozMatchesSelector    ||
                testDiv.msMatchesSelector     ||
                testDiv.oMatchesSelector,
            hasMatchesSelector = matchesSelector && matchesSelector.call(testDiv, 'div'),
        // }

        doc = document,
        win = window,
        nodeTypeStr   = 'nodeType',
        re_quick      = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, // 匹配快速选择器
        result        = {};

    function normalizeRoot (root) {
        if (!root) {
            return doc;
        }
        if (isString(root)) {
            return query(root)[0];
        }
        if (!root[nodeTypeStr] && arrayLike(root)) {
            return root[0];
        }
        return root;
    }
    function query (selector, optRoot) {
        /*
         * description: 选择器
         */
        var root = normalizeRoot(optRoot),
            match;

        if (!root || !selector) {
            return [];
        }
        if (selector === win || isNode(selector)) {
            return !optRoot || (selector !== win && isNode(root) && contains(selector, root)) ?
                [selector] : [];
        }
        if (selector.nodeType === 11) { // document fragment
            return pastry.toArray(selector.childNodes);
        }
        if (selector && arrayLike(selector)) {
            return pastry.flatten(selector);
        }

        // 简单查询使用快速查询方法 {
            if (isString(selector) && (match = re_quick.exec(selector))) {
                if (match[1]) {
                    return [root.getElementById(match[1])];
                } else if (match[2] ) {
                    return toArray(root.getElementsByTagName(match[2]));
                } else if (match[3]) {
                    return toArray(root.getElementsByClassName(match[3]));
                }
            }
        // }
        if (selector && (selector.document || (selector[nodeTypeStr] && selector[nodeTypeStr] === 9))) {
            return !optRoot ? [selector] : [];
        }
        return toArray((root).querySelectorAll(selector));
    }
    function queryOne (selector, optRoot) {
        return query(selector, optRoot)[0];
    }

    function match (element, selector) {
        /*
         * @matches selector
         */
        if (hasMatchesSelector) {
            return matchesSelector.call(element, selector);
        }
        var parentElem = element.parentNode,
            nodes;

        // if the element is an orphan, and the browser doesn't support matching
        // orphans, append it to a documentFragment
        if (!parentElem && !hasMatchesSelector) {
            parentElem = document.createDocumentFragment();
            parentElem.appendChild(element);
        }
            // from the parent element's context, get all nodes that match the selector
        nodes = query(selector, parentElem);

        // since support for `matches()` is missing, we need to check to see if
        // any of the nodes returned by our query match the given element
        return pastry.some(nodes, function (node) {
            return node === element;
        });
    }

    // 封装 api {
        return pastry.extend(result, {
            all   : query,
            one   : queryOne,
            match : match
        });
    // }
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/construct', [
    'pastry/pastry',
    'pastry/bom/utils',
    'pastry/dom/query'
], function(
    pastry,
    bomUtils,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom constructure related
     * @reference   : https://github.com/dojo/dojo/blob/master/dom-construct.js
     */
    var domConstruct,
        win      = window,
        doc      = document || win.document,
        queryOne = domQuery.one,
        tagWrap = {
            option   : ['select'],
            tbody    : ['table'],
            thead    : ['table'],
            tfoot    : ['table'],
            tr       : ['table', 'tbody'],
            td       : ['table', 'tbody', 'tr'],
            th       : ['table', 'thead', 'tr'],
            legend   : ['fieldset'],
            caption  : ['table'],
            colgroup : ['table'],
            col      : ['table', 'colgroup'],
            li       : ['ul']
        },
        RE_tag    = /<\s*([\w\:]+)/,
        masterDiv = doc.createElement('div');

    pastry.each(tagWrap, function (tw, param) {
        tw.pre  = param === 'option' ? '<select multiple="multiple">' : '<' + tw.join('><') + '>';
        tw.post = '</' + tw.reverse().join('></') + '>';
    });

    function insertBefore (node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            parent.insertBefore(node, ref);
        }
    }
    function insertAfter (node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            if (parent.lastChild === ref) {
                parent.appendChild(node);
            } else {
                parent.insertBefore(node, ref.nextSibling);
            }
        }
    }

    return domConstruct = {
        toDom: function (frag) {
            frag += '';


            var match  = frag.match(RE_tag),
                tag    = match ? pastry.lc(match[1]) : '',
                master = masterDiv, // 每次拷贝缓存好的 div，否则会引入问题
                wrap, i, fc, df;

            if (match && tagWrap[tag]) {
                wrap = tagWrap[tag];
                master.innerHTML = wrap.pre + frag + wrap.post;
                for (i = wrap.length; i; --i) {
                    master = master.firstChild;
                }
            } else {
                master.innerHTML = frag;
            }

            if (master.childNodes.length === 1) {
                return master.removeChild(master.firstChild);
            }

            df = doc.createDocumentFragment();
            while ((fc = master.firstChild)) {
                df.appendChild(fc);
            }
            return df;
        },
        place: function (node, refNode, position) {
            refNode = queryOne(refNode);
            if (pastry.isString(node)) {
                node = /^\s*</.test(node) ? domConstruct.toDom(node, refNode.ownerDocument) : queryOne(node);
            }
            if (pastry.isNumber(position)) {
                var childNodes = refNode.childNodes;
                if (!childNodes.length || childNodes.length <= position) {
                    refNode.appendChild(node);
                } else {
                    insertBefore(node, childNodes[position < 0 ? 0 : position]);
                }
            } else {
                switch (position) {
                    case 'before':
                        insertBefore(node, refNode);
                        break;
                    case 'after':
                        insertAfter(node, refNode);
                        break;
                    case 'replace':
                        refNode.parentNode.replaceChild(node, refNode);
                        break;
                    case 'only':
                        domConstruct.empty(refNode);
                        refNode.appendChild(node);
                        break;
                    case 'first':
                        if (refNode.firstChild) {
                            insertBefore(node, refNode.firstChild);
                        } else {
                            refNode.appendChild(node);
                        }
                        break;
                    default: // 'last' or others
                        refNode.appendChild(node);
                }
            }
        },
        create: function (/*DOMNode|String*/ tag, /*DOMNode|String?*/ refNode, /*String?*/ pos) {
            /*
             * @reference: 和 dojo/dom-construct 的差别在于，为了去耦合，去除了 attr 相关的处理
             */
            if (refNode) {
                refNode = queryOne(refNode);
                doc = refNode.ownerDocument;
            }
            if (pastry.isString(tag)) {
                tag = doc.createElement(tag);
            }
            if (refNode) {
                domConstruct.place(tag, refNode, pos);
            }
            return tag;
        },
        empty: function (node) {
            node = queryOne(node);
            if ('innerHTML' in node) {
                try {
                    node.innerHTML = '';
                    return;
                } catch(e) {
                }
            }
            for (var c; c = node.lastChild;) {
                node.removeChild(c);
            }
        },
        destroy: function (node) {
            node = queryOne(node);
            if (!node) {
                return;
            }
            var parent = node.parentNode;
            if (node.firstChild) {
                domConstruct.empty(node);
            }
            if (parent) {
                if (bomUtils.isIE && parent.canHaveChildren && 'removeNode' in node) {
                    node.removeNode(false);
                } else {
                    parent.removeChild(node);
                }
            }
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/data', [
    'pastry/dom/query',
    'pastry/dom/utils'
], function(
    domQuery,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom dataSet related
     * @note        : if DataSet is supported, use DataSet
     */
    var dataSetStr = 'dataset',
        dataPrefix = 'data-',
        hasDataSet = domUtils.hasDataSet,
        domData;

    return domData = {
        get: function (node, name) {
            node = domQuery.one(node);
            if (hasDataSet) {
                return node[dataSetStr][name];
            }
            return node[dataPrefix + name];
        },
        set: function (node, name, value) {
            node = domQuery.one(node);
            if (hasDataSet) {
                node[dataSetStr][name] = value;
            } else {
                node[dataPrefix + name] = value;
            }
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/style', [
    'pastry/pastry',
    'pastry/bom/utils',
    'pastry/dom/data',
    'pastry/dom/query',
    'pastry/dom/utils'
], function(
    pastry,
    bomUtils,
    domData,
    domQuery,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom style
     */

    var getComputedStyle,
        toPixel,
        domStyle,
        getOpacity,
        setOpacity,
        queryOne    = domQuery.one,
        bomVersions = bomUtils.versions,
        ieVersion   = bomVersions.msie || 0,
        isQuirks    = domUtils.isQuirks,
        astr        = 'DXImageTransform.Microsoft.Alpha',
        RE_pixel    = /margin|padding|width|height|max|min|offset/, // |border
        pixelNamesCache = {
            left : true,
            top  : true
        },
        floatAlias = {
            cssFloat   : 1,
            styleFloat : 1,
            'float'    : 1
        };

    function af (n, f) {
        try{
            return n.filters.item(astr);
        }catch(e){
            return f ? {} : null;
        }
    }
    function isHidden (element) {
        return domStyle.get(element, 'display') === 'none' ||
            domUtils.contains(element.ownerDocument, element);
    }
    function showHide (elements, show) {
        var display, hidden,
            values = [];

        pastry.each(elements, function (elem, index) {
            if (elem.style) {
                values[index] = domData.get(elem, 'olddisplay');
                display = elem.style.display;
                if (show) {
                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if ( !values[index] && display === 'none' ) {
                        elem.style.display = '';
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if (elem.style.display === '' && isHidden(elem)) {
                        values[index] = domData.set(elem, 'olddisplay', domStyle.get(elem, 'display'));
                    }
                } else {
                    hidden = isHidden(elem);

                    if ( display !== 'none' || !hidden ) {
                        domData.set(elem, 'olddisplay', hidden ? display : domStyle.get(elem, 'display'));
                    }
                }
            }
        });

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        pastry.each(elements, function (elem, index) {
            if (elem.style) {
                if (!show || elem.style.display === 'none' || elem.style.display === '') {
                    elem.style.display = show ? values[index] || '' : 'none';
                }
            }
        });
        return elements;
    }
    function toStyleValue (node, type, value) {
        type = pastry.lc(type);
        if (ieVersion || bomVersions.trident) {
            if (value === 'auto') {
                if (type === 'height') {
                    return node.offsetHeight;
                }
                if (type === 'width') {
                    return node.offsetWidth;
                }
            }
            if (type === 'fontweight') {
                switch(value){
                    case 700: return 'bold';
                    // case 400:
                    default: return 'normal';
                }
            }
        }
        if (!(type in pixelNamesCache)) {
            pixelNamesCache[type] = RE_pixel.test(type);
        }
        return pixelNamesCache[type] ? toPixel(node, value) : value;
    }

    if (ieVersion && (ieVersion < 9 || (ieVersion < 10 && isQuirks))) {
        getOpacity =  function (node) {
            try {
                return af(node).Opacity / 100; // Number
            } catch(e) {
                return 1; // Number
            }
        };
        setOpacity = function(/*DomNode*/ node, /*Number*/ opacity){
            if (opacity === '') {
                opacity = 1;
            }
            var ov = opacity * 100,
                fullyOpaque = opacity === 1;

            // on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (bug #2661),
            // but still update the opacity value so we can get a correct reading if it is read later:
            // af(node, 1).Enabled = !fullyOpaque;
            if (fullyOpaque) {
                node.style.zoom = '';
                if(af(node)){
                    node.style.filter = node.style.filter.replace(
                        new RegExp('\\s*progid:' + astr + '\\([^\\)]+?\\)', 'i'), '');
                }
            } else {
                node.style.zoom = 1;
                if (af(node)) {
                    af(node, 1).Opacity = ov;
                } else {
                    node.style.filter += ' progid:' + astr + '(Opacity=' + ov + ')';
                }
                af(node, 1).Enabled = true;
            }

            if (node.tagName.toLowerCase() === 'tr') {
                for (var td = node.firstChild; td; td = td.nextSibling) {
                    if(td.tagName.toLowerCase() === 'td'){
                        setOpacity(td, opacity);
                    }
                }
            }
            return opacity;
        };
    } else {
        getOpacity = function (node) {
            return getComputedStyle(node).opacity;
        };
        setOpacity = function (node, opacity) {
            return node.style.opacity = opacity;
        };
    }

    // getComputedStyle {
        if (bomUtils.isWebkit) {
            getComputedStyle = function (node) {
                var style;
                if (node.nodeType === 1) {
                    var dv = node.ownerDocument.defaultView,
                        oldDisplay;
                    style = dv.getComputedStyle(node, null);
                    if (!style && node.style) {
                        /*
                         * early version safari (2.0?) has this bug: when element is display:none,
                         * getComputedStyle returns null
                         */
                        oldDisplay = node.style.display;
                        node.style.display = '';
                        style = dv.getComputedStyle(node, null);
                    }
                    node.style.display = oldDisplay; // and we should change it back.
                }
                return style || {};
            };
        } else if (ieVersion && ieVersion < 9 || isQuirks) {
            getComputedStyle = function (node) {
                return node.nodeType === 1 && node.currentStyle ? node.currentStyle : {};
            };
        } else {
            getComputedStyle = function (node) {
                return node.nodeType === 1 ?
                    node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
            };
        }
    // }
    // toPixel {
        if (ieVersion) {
            toPixel = function(element, avalue){
                if (!avalue) {
                    return 0;
                }
                // on IE7, medium is usually 4 pixels
                if (avalue === 'medium') {
                    return 4;
                }
                // style values can be floats, client code may
                // want to round this value for integer pixels.
                if (avalue.slice && avalue.slice(-2) === 'px') {
                    return parseFloat(avalue);
                }
                var s  = element.style,
                    rs = element.runtimeStyle,
                    cs = element.currentStyle,
                    sLeft  = s.left,
                    rsLeft = rs.left;
                rs.left = cs.left;
                try {
                    // 'avalue' may be incompatible with style.left, which can cause IE to throw
                    // this has been observed for border widths using 'thin', 'medium', 'thick' constants
                    // those particular constants could be trapped by a lookup
                    // but perhaps there are more
                    s.left = avalue;
                    avalue = s.pixelLeft;
                } catch(e) {
                    avalue = 0;
                }
                s.left  = sLeft;
                rs.left = rsLeft;
                return avalue;
            };
        } else {
            toPixel = function (element, value) {
                return parseFloat(value) || 0;
            };
        }
    // }

    return domStyle = {
        getComputedStyle : getComputedStyle,
        toPixel          : toPixel,

        get: function (node, name) {
            var n  = queryOne(node),
                l  = arguments.length,
                op = (name === 'opacity'),
                style;
            if (l === 2 && op) {
                return getOpacity(n);
            }
            name  = floatAlias[name] ? 'cssFloat' in n.style ? 'cssFloat' : 'styleFloat' : name;
            style = domStyle.getComputedStyle(n);
            return (l === 1) ? style : toStyleValue(n, name, style[name] || n.style[name]);
        },
        set: function (node, name, value) {
            var n  = queryOne(node),
                l  = arguments.length,
                op = (name === 'opacity');

            name = floatAlias[name] ? 'cssFloat' in n.style ? 'cssFloat' : 'styleFloat' : name;
            if (l === 3) {
                return op ? setOpacity(n, value) : n.style[name] = value;
            }
            for (var x in name) {
                domStyle.set(node, x, name[x]);
            }
            return domStyle.getComputedStyle(n);
        },

        show: function (node) {
            showHide(domQuery.all(node), true);
        },
        hide: function (node) {
            showHide(domQuery.all(node), false);
        },
        toggle: function (node) {
            return domStyle.get(node, 'display') === 'none' ? domStyle.show(node) : domStyle.hide(node);
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/component/Base', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/dom/style'
], function(
    pastry,
    declare,
    domConstruct,
    domQuery,
    domStyle
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : base constructor for ui components
     */
    var body = document.body,
        Component = declare('pastry-Component', [], {
            initialise: function (info) {
                var instance = this;

                pastry.extend(instance, {
                    container : null, // DOM 相关操作
                    // events    : {},
                    // methods   : {}
                }, info);
                return instance;
            },
            destroy: function () {
                var instance = this;

                domConstruct.destroy(instance.container);
                pastry.destroy(instance);
                return instance;
            },
            placeAt: function (refNode, position) {
                var instance = this,
                    container;

                refNode = domQuery.one(refNode) || body;
                if (container = instance.container) {
                    domConstruct.place(container, refNode, position);
                }
                return instance;
            },
            show: function () {
                var instance = this,
                    container;

                if (container = instance.container) {
                    domStyle.show(container);
                }
                return instance;
            },
            hide: function () {
                var instance = this,
                    container;

                if (container = instance.container) {
                    domStyle.hide(container);
                }
                return instance;
            }
        });

    return Component;
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/class', [
    'pastry/pastry',
    'pastry/dom/utils',
    'pastry/dom/query'
], function(
    pastry,
    domUtils,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom classList related
     * @note        : if ClassList is supported, use ClassList
     */
    var RE_spaces    = /\s+/,
        className    = 'className',
        spaceStr     = ' ',
        hasClassList = domUtils.hasClassList,
        tmpArray     = [''],
        domClass;

    function str2array (str) {
        if (pastry.isString(str)) {
            if (str && !RE_spaces.test(str)) {
                tmpArray[0] = str;
                return tmpArray;
            }
            var arr = str.split(RE_spaces);
            if (arr.length && !arr[0]) {
                arr.shift();
            }
            if (arr.length && !arr[arr.length - 1]) {
                arr.pop();
            }
            return arr;
        }
        if (!str) {
            return [];
        }
        return pastry.filter(str, function (x) {
            return x;
        });
    }
    function fillSpace (str) {
        return spaceStr + str + spaceStr;
    }

    return domClass = {
        contains: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = pastry.trim(classStr);
            if (hasClassList) {
                return node.classList.contains(classStr);
            }
            return fillSpace(node[className]).indexOf(fillSpace(classStr)) >= 0;
        },
        add: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = str2array(classStr);
            if (hasClassList) {
                pastry.each(classStr, function (c) {
                    node.classList.add(c);
                });
            } else {
                var oldClassName = node[className],
                    oldLen, newLen;
                oldClassName = oldClassName ? fillSpace(oldClassName) : spaceStr;
                oldLen = oldClassName.length;
                pastry.each(classStr, function (c) {
                    if (c && oldClassName.indexOf(fillSpace(c)) < 0) {
                        oldClassName += c + spaceStr;
                    }
                });
                newLen = oldClassName.length;
                if (oldLen < newLen) {
                    node[className] = oldClassName.substr(1, newLen - 2);
                }
            }
        },
        remove: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = str2array(classStr);
            if (hasClassList) {
                pastry.each(classStr, function (c) {
                    node.classList.remove(c);
                });
            } else {
                var cls = fillSpace(node[className]);
                pastry.each(classStr, function (c) {
                    cls = cls.replace(fillSpace(c), spaceStr);
                });
                cls = pastry.trim(cls);
                if (node[className] !== cls) {
                    node[className] = cls;
                }
            }
        },
        clear: function (node) {
            node = domQuery.one(node);
            node[className] = '';
        },
        toggle: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = str2array(classStr);
            if (hasClassList) {
                pastry.each(classStr, function (c) {
                    node.classList.toggle(c);
                });
            } else {
                pastry.each(classStr, function (c) {
                    domClass[domClass.contains(node, c) ? 'remove' : 'add'](node, c);
                });
            }
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/event', [
    'pastry/pastry',
    'pastry/dom/query',
    'pastry/dom/utils'
], function(
    pastry,
    domQuery,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : event firing
     * @reference   : http://dean.edwards.name/weblog/2005/10/add-event/
     */
    var doc = document,
        win = window;

    function addEvent(element, type, handler) {
        element = domQuery.one(element);
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            // assign each event handler a unique ID
            if (!handler.$$guid) {
                handler.$$guid = addEvent.guid++;
            }
            // create a hash table of event types for the element
            if (!element.events) {
                element.events = {};
            }
            // create a hash table of event handlers for each element/event pair
            var handlers = element.events[type];
            if (!handlers) {
                handlers = element.events[type] = {};
                // store the existing event handler (if there is one)
                if (element['on' + type]) {
                    handlers[0] = element["on" + type];
                }
            }
            // store the event handler in the hash table
            handlers[handler.$$guid] = handler;
            // assign a global event handler to do all the work
            element['on' + type] = handleEvent;
        }
    }
    // a counter used to create unique IDs
    addEvent.guid = 1;

    function removeEvent(element, type, handler) {
        var delegateWrapper = handler._delegateWrapper;
        element = domQuery.one(element);
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
            element.removeEventListener(type, delegateWrapper, false);
        } else {
            // delete the event handler from the hash table
            if (element.events && element.events[type]) {
                delete element.events[type][handler.$$guid];
                delete element.events[type][delegateWrapper.$$guid];
            }
        }
    }

    function handleEvent(event) {
        /* jshint validthis:true */
        var returnValue = true,
            elem        = this;
        // grab the event object (IE uses a global event object)
        event = event ||
            fixEvent((doc.parentWindow || win).event);
        // get a reference to the hash table of event handlers
        var handlers = elem.events[event.type];
        // execute each event handler
        for (var i in handlers) {
            elem.$$handleEvent = handlers[i];
            if (elem.$$handleEvent(event) === false) {
                returnValue = false;
            }
        }
        return returnValue;
    }

    function fixEvent(event) {
        // add W3C standard event methods
        event.preventDefault  = fixEvent.preventDefault;
        event.stopPropagation = fixEvent.stopPropagation;
        return event;
    }
    fixEvent.preventDefault = function() {
        this.returnValue = false;
    };
    fixEvent.stopPropagation = function() {
        this.cancelBubble = true;
    };

    function delegate (element, type, selector, handler, capture, once) {
        if (pastry.isFunction(selector)) {
            addEvent(element, type, selector);
            return;
        }
        element = domQuery.one(element); // delegation is only for one element
        if (!domUtils.isNode(element)) {
            pastry.ERROR('cannot bind events to non-elements: ' + element);
        }
        function wrapper (e) {
            // if this event has a delegateTarget, then we add it to the event
            // object (so that handlers may have a reference to the delegator
            // element) and fire the callback
            if (e.delegateTarget = _getDelegateTarget(element, e.target, selector)) {
                if (once === true) {
                    removeEvent(element, type, wrapper);
                }
                handler.call(element, e);
            }
        }
        handler._delegateWrapper = wrapper;
        addEvent(element, type, wrapper, capture || false);
        return handler;
    }
    function _getDelegateTarget (element, target, selector) {
        while (target && target !== element) {
            if (domQuery.match(target, selector)) {
                return target;
            }
            target = target.parentElement;
        }
        return null;
    }

    function once (element, type, selector, callback, capture) {
        delegate(element, type, selector, callback, capture, true);
    }

    return {
        on   : delegate,
        once : once,
        off  : removeEvent
    };
});


/* jshint ignore:start */
define("pastry/template/collapse", ["pastry/pastry","pastry/html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="panel-group" id="'+_e(id)+'"></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint ignore:start */
define("pastry/template/collapseSection", ["pastry/pastry","pastry/html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse">'+_e(head)+'</a></h4></div><div class="panel-collapse collapse"><div class="panel-body">'+_e(body)+'</div></div></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/component/Collapse', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/component/Base',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/utils',
    'pastry/template/collapse',
    'pastry/template/collapseSection'
], function (
    pastry,
    declare,
    Component,
    domClass,
    domConstruct,
    domEvent,
    domQuery,
    domUtils,
    templateWrapper,
    templateSection
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Collapse component
     */

    var
        NS         = '__collapse__',
        NS_SECTION = '__collapse.section__',
        Section = declare('CollapseSection', [Component], {
            constructor: function (option) {
                var instance = this;
                pastry.extend(instance, {
                    isOpen: false
                }, option);
                domEvent.on(instance.head, 'click', function () {
                    instance._onClick();
                });
                return instance.isOpen ? instance.open() : instance.close();
            },
            _onClick: function () {
                var instance = this;
                runIfIsFunction(instance.onClick, instance);
                return instance;
            },
            open: function () {
                var instance = this;
                instance.isOpen = true;
                domClass.add(instance.body, 'in');
                // domStyle.show(instance.body);
                return instance;
            },
            close: function () {
                var instance = this;
                instance.isOpen = false;
                domClass.remove(instance.body, 'in');
                // domStyle.hide(instance.content);
                return instance;
            },
            toggle: function () {
                var instance = this;
                domClass.toggle(instance.body, 'in');
                // return instance.isOpen ? instance.close() : instance.open();
                return instance;
            },
            destroy: function () {
                var instance = this;
                domConstruct.destroy(instance.head);
                domConstruct.destroy(instance.body);
                Component.prototype.destroy.call(instance);
                return instance;
            }
        }),
        Collapse = declare('Collapse', [Component], {
            constructor: function (element, option) {
                var instance = this;
                option = option || {};
                if (domUtils.isNode(element)) {
                    option.container = element;
                } else {
                    option = element;
                }
                pastry.extend(instance, {
                    isAccordion : true,
                    _sections   : {}
                }, option);
                instance.id = instance.id || pastry.uuid(NS);
                if (!instance.container) {
                    instance.container = domConstruct.toDom(templateWrapper(instance));
                } else {
                    instance.id = instance.container.id || instance.id;
                }
                pastry.each(domQuery.all('.panel', instance.container), function (element) {
                    instance.addSection(element);
                });
                if (pastry.isArray(instance.sections)) {
                    pastry.each(instance.sections, function (section) {
                        instance.addSection(section);
                    });
                }
                return instance;
            },
            eachSection: function (callback) {
                var instance = this;
                pastry.each(instance._sections, function (section) {
                    runIfIsFunction(callback, section);
                });
                return instance;
            },
            addSection: function (option) {
                /*
                 * option can be an element(or string) or object
                 */
                var container,
                    id,
                    section,
                    onClick,
                    instance = this;
                if (option instanceof Section) {
                    instance._sections[option.id] = option;
                    return instance;
                }

                if (domUtils.isNode(option) || pastry.isString(option)) {
                    container = domQuery.one(option);
                    option = {
                        container : container
                    };
                } else {
                    if (option.head && pastry.isString(option.head)) {
                        container = domConstruct.toDom(templateSection(option));
                        pastry.extend(option, {
                            container: container
                        });
                    } else if (option.container) {
                        container = option.container;
                    }
                }
                if (!option.id) {
                    option.id = container.id || pastry.uuid(NS_SECTION);
                }
                id = option.id;
                pastry.extend(option, {
                    head : domQuery.one('.panel-title [data-toggle=collapse]', container),
                    body : domQuery.one('.panel-collapse.collapse', container)
                });

                onClick = option.onClick;
                option.onClick = function (obj) {
                    runIfIsFunction(onClick, obj);
                    instance.toggleSection(obj.id);
                };

                section = new Section(option);
                instance._sections[id] = section;
                if (!domUtils.contains(section.container, instance.container)) {
                    section.placeAt(instance.container);
                }
                return instance;
            },
            removeSection: function (id) {
                var instance = this;
                instance._sections[id].destroy();
                delete instance._sections[id];
                return instance;
            },
            openSection: function (id) {
                var instance = this,
                    section  = instance._sections[id];
                if (instance.isAccordion) {
                    instance.eachSection(function (section) {
                        section.close();
                    });
                }
                section.open();
                return instance;
            },
            closeSection: function (id) {
                var instance = this;
                instance._sections[id].close();
                return instance;
            },
            toggleSection: function (id) {
                var instance = this,
                    section  = instance._sections[id];
                return section.isOpen ? instance.closeSection(id) : instance.openSection(id);
            },
            destroy: function () {
                var instance = this;
                instance.eachSection(function (section) {
                    section.destroy();
                });
                Component.prototype.destroy.call(instance);
                instance = null;
            }
        });

    Collapse.Section = Section;
    Collapse.render  = function (container, option) {
        container = domQuery.one(container);
        return new Collapse(container, option);
    };

    function runIfIsFunction (func, args) {
        if (pastry.isFunction(func)) {
            func.call(null, args);
        }
    }

    return pastry.Collapse = Collapse;
});


/* jshint ignore:start */
define("pastry/template/notify", ["pastry/pastry","pastry/html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="notify-wrapper" id="'+_e(id)+'"></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint ignore:start */
define("pastry/template/notifyMessage", ["pastry/pastry","pastry/html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="notify-message notify-message-'+_e(type)+'" id="'+_e(id)+'"><div class="notify-message-inner"><div class="notify-icon notify-icon-'+_e(type)+'">'; if (type === 'info') { _s+='<span class="icon icon-info-o"></span>'; } _s+=''; if (type === 'error') { _s+='<span class="icon icon-close-o"></span>'; } _s+=''; if (type === 'warning') { _s+='<span class="icon icon-warning-o"></span>'; } _s+=''; if (type === 'success') { _s+='<span class="icon icon-ok-o"></span>'; } _s+='</div><div class="notify-text"> '+_e(text)+' </div></div></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/component/Notify', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/component/Base',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/template/notify',
    'pastry/template/notifyMessage'
], function(
    pastry,
    declare,
    Component,
    domConstruct,
    domEvent,
    templateWrapper,
    templateMessage
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Notify component
     */
    var NS         = '__notify__',
        NS_MESSAGE = '__notify_message__',

        defaultOption = {
            type     : 'info',
            text     : 'message',
            maxCount : 10,
            lifetime : 5000,
        },

        Notify = declare('Notify', [Component], {
            constructor: function (option) {
                var instance = this;
                option = option || {};

                pastry.extend(instance, {
                    id           : pastry.uuid(NS),
                    message      : {},
                    messageCount : 0,
                    messageQueue : [],
                    status       : {},
                    option       : defaultOption,
                }, option);
                option.container = option.container || domConstruct.toDom(templateWrapper({
                    id: instance.id
                }));
                instance.initialise(option);
                instance.placeAt();
                return instance;
            },
            _initMessage: function (option) {
                var instance = this,
                    message  = pastry.extend({}, option, {
                        domNode: domConstruct.toDom(templateMessage(option))
                    });

                domEvent.on(message.domNode, 'click', function () {
                    instance._hideById(message.id);
                });
                return message;
            },
            _showById: function (id) {
                var instance = this,
                    message  = instance.message[id];

                if (message) {
                    domConstruct.place(message.domNode, instance.container, 'first');
                    instance.messageCount ++;
                    if (pastry.isFunction(message.onShow)) {
                        message.onShow();
                    }
                    message.timeout = setTimeout(function () {
                        if (instance.message[message.id]) {
                            instance._hideById(message.id);
                        }
                    }, message.lifetime ? message.lifetime : instance.option.lifetime);
                }
                return instance;
            },
            _hideById: function (id) {
                var instance = this,
                    message  = instance.message[id];

                if (message) {
                    domConstruct.destroy(message.domNode);
                    instance.messageCount --;
                    clearTimeout(message.timeout);
                    instance._showNext();
                    if (pastry.isFunction(message.onHide)) {
                        message.onHide();
                    }
                    Component.prototype.destroy.apply(message);
                    delete instance.message[id];
                }
                return instance;
            },
            _showNext: function () {
                var instance = this,
                    id = instance.messageQueue.pop();
                if (id) {
                    instance._showById(id);
                }
                return instance;
            },
            config: function (option) {
                var instance = this;
                pastry.extend(instance.option, option);
                return instance;
            },
            log: function (option) {
                var instance = this,
                    id = option.id || pastry.uuid(NS_MESSAGE),
                    message;

                // instance.show();
                option = pastry.extend({
                    id: id
                }, instance.option, option);

                instance.message[id] = message = instance._initMessage(option);
                if (instance.messageCount >= instance.option.maxCount) {
                    instance.messageQueue.push(id);
                } else {
                    instance._showById(id);
                }
            }
        });

    return pastry.Notify = Notify;
});


/* jshint ignore:start */
define("pastry/template/tooltip", ["pastry/pastry","pastry/html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="tooltip" id="'+_e(id)+'"><div class="tooltip-arrow"></div><div class="tooltip-body"></div></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/component/Tooltip', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/component/Base',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/template/tooltip'
], function(
    pastry,
    declare,
    Component,
    domClass,
    domConstruct,
    domQuery,
    domStyle,
    templateWrapper
) {
    'use strict';
    /*
     * @author      : 绝云
     * @date        : 2015-01-06
     * @description : 自定义ToolTip
     * @syntax      :
    //     var tooltip = new Tooltip();
    //     tooltip.show(text, node, opt);
    //     tooltip.show('some tips', $node, {
    //         gravity : 's',   // 方向
    //             // gravity:
    //             // ---------------
    //             // | nw | n | ne |
    //             // ---------------
    //             // | w  |   | e  |
    //             // ---------------
    //             // | sw | s | se |
    //             // ---------------
    //         html    : false, // 显示内容是否是 html
    //         offset  : 10     // 偏移量
    //     });
    //     tooltip.hide();
    //     tooltip.hide();
     */
    var
        NS = '__tooltip__',

        extend = pastry.extend,
        each   = pastry.each,
        body   = document.body,

        Tooltip = declare('Tooltip', [Component], {
            constructor: function (option) {
                option = option || {};
                var tooltip = this,
                    container;

                tooltip.option = extend({
                    gravity : 'n',   // 方向
                    html    : false, // 是否显示html
                    offset  : 6      // 偏移
                }, option);
                tooltip.id = option.id || pastry.uuid(NS);

                container = tooltip.container = domConstruct.toDom(templateWrapper(tooltip));
                tooltip.placeAt(body);
                tooltip.wrapArrow = domQuery.one('.tooltip-arrow', container);
                tooltip.wrapBody  = domQuery.one('.tooltip-body' , container);
                tooltip.hide();
                tooltip.isShown = false;
                return tooltip;
            },
            show: function (text, node, option) {
                /*
                 * @description : 显示 tooltip
                 * @syntax      : tooltip.show(text, node, option);
                 * @param       : {string } text , 要显示的 tooltip 内容
                 * @param       : {domNode} node , 要显示 tooltip 的节点
                 * @param       : {object } option  , 显示 tooltip 的参数
                 *     option.gravity : 方向
                 *     option.html    : tooltip 是否是 html
                 *     option.offset  : tooltip 显示偏移量
                 */
                var tooltip = this,
                    container = tooltip.container,
                    wrapArrow = tooltip.wrapArrow,
                    wrapBody  = tooltip.wrapBody,
                    showOpt   = extend({}, tooltip.option, option),
                    gravity   = showOpt.gravity,
                    bodyNode,
                    nPos,
                    tPos;

                // 插入内容 {
                    if (text && text !== ''){
                        wrapBody.innerHTML = '';
                        if (showOpt.html) {
                            bodyNode = domConstruct.toDom(text);
                            domConstruct.place(bodyNode, wrapBody, 'only');
                        } else {
                            wrapBody.innerHTML = text;
                        }
                    }
                // }
                // 显示 {
                    domClass.clear(wrapArrow);
                    domClass.add(wrapArrow, 'tooltip-arrow tooltip-arrow-' + gravity.charAt(0));

                    domClass.clear(container);
                    domClass.add(container, 'tooltip tooltip-' + gravity);
                    if (showOpt.className) {
                        domClass.add(container, 'tooltip-' + showOpt.className);
                    }
                    Component.prototype.show.call(tooltip);
                    tooltip.isShown = true;
                // }

                // 获取位置信息 {
                    nPos = extend({}, node.getBoundingClientRect(), {
                        width  : node.offsetWidth,
                        height : node.offsetHeight
                    });

                    // svg处理，解决矢量图放大缩小后坐标不正确问题 {
                        if (typeof node.nearestViewportElement === 'object') {
                            // SVG
                            var rect = node.getBoundingClientRect();
                            nPos.width = rect.width;
                            nPos.height = rect.height;
                        }
                    // }
                    tPos = {
                        width  : wrapBody.offsetWidth,
                        height : wrapBody.offsetHeight
                    };
                    showOpt.offset = showOpt.offset || 0;
                    switch (gravity.charAt(0)) {
                        case 'n':
                            tPos = {
                                top  : nPos.top + nPos.height + showOpt.offset,
                                left : nPos.left + nPos.width/2 - tPos.width/2
                            };
                            break;
                        case 's':
                            tPos = {
                                top  : nPos.top - tPos.height - showOpt.offset,
                                left : nPos.left + nPos.width/2 - tPos.width/2
                            };
                            break;
                        case 'e':
                            tPos = {
                                top  : nPos.top + nPos.height/2 - tPos.height/2,
                                left : nPos.left - tPos.width - showOpt.offset
                            };
                            break;
                        case 'w':
                            tPos = {
                                top  : nPos.top + nPos.height/2 - tPos.height/2,
                                left : nPos.left + nPos.width + showOpt.offset
                            };
                            break;
                    }
                    // 加上滚动量 {
                        tPos.top  += body.scrollTop;
                        tPos.left += body.scrollLeft;
                    //
                    if (gravity.length === 2) {
                        if (gravity.charAt(1) === 'w') {
                            tPos.left = nPos.left + nPos.width/2 - 15;
                        } else {
                            tPos.left = nPos.left + nPos.width/2 - tPos.width + 15;
                        }
                    }
                // }
                // 定位 {
                    each(tPos, function (value, key) {
                        domStyle.set(container, key, value + 'px');
                    });
                // }
                return tooltip;
            },
            hide: function () {
                var tooltip = this;
                tooltip.isShown = false;
                return Component.prototype.hide.call(tooltip);
            }
        });
    return pastry.Tooltip = Tooltip;
});


/* jshint ignore:start */
define("pastry/template/treeNode", ["pastry/pastry","pastry/html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<tr class="tree-node '; if (isSelected) { _s+='selected'; } _s+='" data-id="'+_e(id)+'"><td><span class="tree-node-indenter" style="margin-left: '+_e(indent)+'px;">'; if (isBranch) { _s+='<span class="tree-node-expander icon '+_e(expanderIconClass)+'" data-id="'+_e(id)+'"></span>'; } _s+='</span>'; if (hasCheckbox) { _s+='<label class="tree-node-checkbox checkbox-inline"><input type="checkbox" value="'+_e(id)+'"></label>'; } _s+='<span class="tree-node-icon icon '+_e(iconClass)+'"></span><span class="tree-node-label">'+_e(label)+'</span></td>'; if (extraColumns) { _s+=''; helper.each(extraColumns, function (col) { _s+='<td>'+_e(obj[col.key])+'</td>'; }); _s+=''; } _s+='</tr>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/component/TreeNode', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/component/Base',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/event/base',
    'pastry/template/treeNode'
], function(
    pastry,
    declare,
    Component,
    domClass,
    domConstruct,
    domQuery,
    domStyle,
    event,
    templateNode
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : tree Node
     */
    var INDENT_LENGTH = 16, // indent for one level

        NODE_SELECTED_CLASS          = 'selected',
        BRANCH_ICON_CLASS            = 'icon-folder',
        BRANCH_EXPANDED_ICON_CLASS   = 'icon-folder-open',
        LEAF_ICON_CLASS              = 'icon-file',
        EXPANDER_ICON_CLASS          = 'icon-arrow-right',
        EXPANDER_EXPANDED_ICON_CLASS = 'icon-arrow-down',

        extend  = pastry.extend,
        indexOf = pastry.indexOf,
        remove  = pastry.remove,
        each    = pastry.each,
        every   = pastry.every,

        TreeNode = declare('ui/tree/Node', [Component], {
            constructor: function (data) {
                if (data instanceof TreeNode) {
                    return data;
                }
                var node = this;
                // initialize private attributes {
                    extend(node, {
                        // attributes {
                            isRoot       : false , // 根节点
                            isBranch     : false , // 枝干节点
                            isLeaf       : true  , // 叶子节点
                            isExpanded   : true  , // expanded
                            isExpandable : false , // expandable
                            isSelected   : false , // selected
                            isFocused    : false , // focused
                            isLoaded     : false , // loaded
                        // }
                        // elements {
                            container       : null,
                            indenterElement : null,
                            expanderElement : null,
                            labelElement    : null,
                            iconElement     : null,
                        // }
                        // connections {
                            children : [],
                            parent   : null
                        // }
                    }, data);
                // }
                // bind events {
                    // instance events {
                        event(node); // add node instance events
                        node.on('clicked'     , function () { node.onClicked();     });
                        node.on('collapsed'   , function () { node.onCollapsed();   });
                        node.on('contextmenu' , function () { node.onContextmenu(); });
                        node.on('dblclicked'  , function () { node.onDblclicked();  });
                        node.on('expanded'    , function () { node.onExpanded();    });
                        node.on('selected'    , function () { node.onSelected();    });
                    // }
                    // dom events {
                    // }
                // }
                return node;
            },
            // attributes {
                hasCheckbox       : false , // checkbox
                id                : null  ,
                label             : null  , // label
                indent            : 0     , // indent of the node
                parentId          : null  ,
                iconClass         : null  ,
                expanderIconClass : null  ,
            // }
            // private methods {
                _setLabel: function () {
                    var node = this,
                        label;
                    if (node.getLabel) {
                        label = node.getLabel();
                    } else if (node.tree.getLabel) {
                        label = node.tree.getLabel(node);
                    } else {
                        // alias
                        label = node.label || node.name || '';
                    }
                    node.label = label;
                    if (node.labelElement) {
                        node.labelElement.innerHTML = label;
                    }
                    return node;
                },
                _setIconClass: function () {
                    var node = this,
                        iconClass;

                    if (node.getIconClass) {
                        iconClass = node.getIconClass();
                    } else if (node.tree.getIconClass) {
                        iconClass = node.tree.getIconClass(node);
                    } else {
                        if (node.isBranch) {
                            iconClass = node.isExpanded ?
                                BRANCH_EXPANDED_ICON_CLASS : BRANCH_ICON_CLASS;
                        } else {
                            iconClass = LEAF_ICON_CLASS;
                        }
                    }
                    node.iconClass = iconClass;
                    if (node.iconElement) {
                        domClass.clear(node.iconElement);
                        domClass.add(node.iconElement, 'tree-node-icon icon ' + iconClass);
                    }
                    return node;
                },
                _setSelectedClass: function () {
                    var node = this,
                        container = node.container;
                    if (container) {
                        domClass[node.isSelected ? 'add' : 'remove'](container, NODE_SELECTED_CLASS);
                    }
                    return node;
                },
                _setExpanderIconClass: function () {
                    var node = this,
                        expanderIconClass;

                    if (node.isExpandable) {
                        if (node.getExpanderIconClass) {
                            expanderIconClass = node.getExpanderIconClass();
                        } else if (node.tree.getExpanderIconClass) {
                            expanderIconClass = node.tree.getExpanderIconClass(node);
                        } else {
                            expanderIconClass = node.isExpanded ?
                                EXPANDER_EXPANDED_ICON_CLASS : EXPANDER_ICON_CLASS;
                        }
                        node.expanderIconClass = expanderIconClass;
                        if (node.expanderElement) {
                            domClass.clear(node.expanderElement);
                            domClass.add(node.expanderElement, 'tree-node-expander icon ' + expanderIconClass);
                        }
                    }
                    return node;
                },
                _setIndent: function () {
                    var node = this,
                        indent;

                    indent = INDENT_LENGTH * node.getLevel(); // 计算缩进
                    node.indent = indent;
                    if (node.indenterElement) {
                        domStyle.set(node.indenterElement, 'margin-left', indent + 'px');
                    }
                    return node;
                },
                _setLoaded: function () {
                    var node = this;

                    node.isLoaded = true;
                    node.eachChild(function (child) {
                        child.load();
                    });
                },
                _setSelected: function () {
                    var node = this,
                        tree = node.tree,
                        oldSelectedNode = tree.selectedNode;
                    node.isSelected = true;
                    if (oldSelectedNode) {
                        oldSelectedNode.isSelected = false;
                        oldSelectedNode._updateLayout();
                    }
                    tree.selectedNode = node;
                    return node._updateLayout();
                },
                _reload: function () {
                    var node = this;
                    node.eachChild(function (child) {
                        child.reload();
                    });
                },
                _updateLayout: function () {
                    return this
                        ._setLabel()
                        ._setIconClass()
                        ._setSelectedClass()
                        ._setExpanderIconClass()
                        ._setIndent();
                },
                _canMoveTo: function (target) {
                    var node = this;
                    if (
                        target.id === node.id || // 不能移动到自身
                        target.isLeaf || // 不能移动到叶子节点
                        indexOf(node.children, target) > -1 || // 不能移动到子节点
                        indexOf(target.getAncestors(), node) > -1 // 也不能移动到子孙节点
                    ) {
                        return false;
                    }
                    return true;
                },
                _isAncestorsExpanded: function () {
                    return every(this.getAncestors(), function (ancestor) {
                        return ancestor.isExpanded;
                    });
                },
            // }
            // methods {
                addChild: function (child) {
                    var node = this;
                    if (indexOf(node.children, child) === -1) {
                        node.children.push(child);
                    }
                    child.isRoot   = false;
                    child.parentId = node.id;
                    child.parent   = node;
                    if (child.isLoaded) {
                        child.reload();
                        if (child._isAncestorsExpanded()) {
                            child.show();
                        } else {
                            child.hide();
                        }
                    }
                    return node;
                },
                removeChild: function (child) {
                    var node = this,
                        index;
                    if ((index = indexOf(node.children, child)) !== -1) {
                        remove(node.children, index);
                        if (child.isLoaded && node.isExpanded) {
                            child.hide();
                        }
                    }
                    return node;
                },
                moveTo: function (target) {
                    /*
                     * @description: move to a target node
                     */
                    var node = this;
                    if (node._canMoveTo(target)) {
                        if (node.parent) {
                            node.parent.removeChild(node);
                        }
                        target.addChild(node);
                    }
                    return node;
                },
                eachChild: function (callback) {
                    /*
                     * @description: collapse the node
                     */
                    var node = this;
                    each(node.children, function (child) {
                        callback(child);
                    });
                    return node;
                },
                getParent: function () {
                    var node = this,
                        parentId = node.parentId;
                    if (node.parent) {
                        return node.parent;
                    }
                    if (typeof parentId !== 'undefined') {
                        return node.tree.nodeById[parentId];
                    }
                    return null;
                },
                getAncestors: function () {
                    var node = this,
                        ancestors = [];
                    while(node = node.getParent()) {
                        ancestors.push(node);
                    }
                    return ancestors;
                },
                getLevel: function () {
                    return this.getAncestors().length;
                },
                select: function () {
                    /*
                     * @description: set to be selected
                     */
                    return this._setSelected();
                },
                show: function () {
                    /*
                     * @description: show the node
                     */
                    var node = this;
                    Component.prototype.show.apply(node);
                    if (node.isExpanded) {
                        node.eachChild(function (child) {
                            child.show();
                        });
                    }
                    return node;
                },
                hide: function () {
                    /*
                     * @description: hide the node
                     */
                    var node = this;
                    Component.prototype.hide.apply(node);
                    if (node.isExpanded) {
                        node.eachChild(function (child) {
                            child.hide();
                        });
                    }
                    return node;
                },
                expand: function () {
                    /*
                     * @description: expand the node
                     */
                    var node = this;
                    node.isExpanded = true;
                    node.eachChild(function (child) {
                        child.show();
                    });
                    node._updateLayout();
                    node.trigger('expanded');
                    node.tree.trigger('node-expanded', node);
                    return node;
                },
                collapse: function () {
                    /*
                     * @description: collapse the node
                     */
                    var node = this;
                    node.isExpanded = false;
                    node.eachChild(function (child) {
                        child.hide();
                    });
                    return node._updateLayout();
                },
                toggle: function () {
                    /*
                     * @description: expand or collapse the node
                     */
                    var node = this;
                    return node.isExpanded ? node.collapse() : node.expand();
                },
                render: function () {
                    /*
                     * @description: render the node,
                     *      get attributes
                     *      get Elements
                     */
                    var node = this,
                        container;

                    // get attributes {
                        if (!node.parent) {
                            node.isRoot = true;
                        }
                        if (node.children.length) {
                            node.isBranch = true;
                            node.isLeaf = false;
                        }
                        node.isExpandable = node.isBranch;
                    // }
                    // get nodes {
                        container = node.container = node.container ||
                            domConstruct.toDom(templateNode(node, true)); // unescape
                        node.indenterElement = node.indenterElement ||
                            domQuery.one('.tree-node-indenter', container);
                        node.expanderElement = node.expanderElement ||
                            domQuery.one('.tree-node-expander', container);
                        node.labelElement = node.labelElement ||
                            domQuery.one('.tree-node-label', container);
                        node.iconElement = node.iconElement ||
                            domQuery.one('.tree-node-icon', container);
                    // }
                    node._updateLayout();
                    if (!node._isAncestorsExpanded()) {
                        node.hide();
                    }
                    return node;
                },
                load: function () {
                    /*
                     * @description: load the node to the tree;
                     */
                    var node = this;

                    if (!node.isLoaded) {
                        if (node.isRoot) {
                            node.placeAt(node.tree.bodyElement, 'first');
                            node._setLoaded();
                        } else if (node.parent.isLoaded) {
                            node.placeAt(node.parent.container, 'after');
                            node._setLoaded();
                        }
                    }
                    return node;
                },
                reload: function () {
                    var node = this;
                    if (!node.isLoaded) {
                        node.load();
                    } else {
                        node._updateLayout();
                        if (node.isRoot) {
                            node.placeAt(node.tree.bodyElement, 'first');
                            node._reload();
                        } else if (node.parent.isLoaded) {
                            node.placeAt(node.parent.container, 'after');
                            node._reload();
                        }
                    }
                    return node;
                },
                update: function (option) {
                    return extend(this, option).render();
                },
            // }
            // events {
                onClicked     : function () { },
                onCollapsed   : function () { },
                onContextmenu : function () { },
                onDblclicked  : function () { },
                onExpanded    : function () { },
                onSelected    : function () { },
            // }
        });

    return TreeNode;
});


/* jshint ignore:start */
define("pastry/template/tree", ["pastry/pastry","pastry/html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<table class="tree-wrapper table table-hover" id="'+_e(id)+'">'; if (hasHead) { _s+='<thead><tr><th>'+_e(treeColumnName)+'</th>'; helper.each(extraColumns, function (col) { _s+='<th>'+_e(col.label)+'</th>'; }); _s+='</tr></thead>'; } _s+='<tbody></tbody></table>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/component/Tree', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/component/Base',
    'pastry/dom/construct',
    'pastry/dom/data',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/component/TreeNode',
    'pastry/event/base',
    'pastry/template/tree'
], function(
    pastry,
    declare,
    Component,
    domConstruct,
    domData,
    domEvent,
    domQuery,
    TreeNode,
    event,
    templateWrapper
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Tree
     */
    var NS      = '__tree__',
        NS_NODE = '__tree_node__',

        isArray = pastry.isArray,
        indexOf = pastry.indexOf,
        remove  = pastry.remove,
        each    = pastry.each,
        extend  = pastry.extend,
        uuid    = pastry.uuid,

        getTreeNodeFromDelegateEventAndTree = function (e, tree) {
            return tree.nodeById[domData.get(e.delegateTarget, 'id')];
        },

        Tree = declare('ui/Tree', [Component], {
            // constructor {
                constructor: function (option) {
                    option = option || {};
                    var tree = this,
                        container;

                    extend(tree, {
                        id           : uuid(NS),
                        data         : [],
                        nodes        : [],   // node instances
                        nodeById     : {},   // node instances by id
                        container    : null, // element
                        headElement  : null, // element
                        bodyElement  : null, // element
                        selectedNode : null, // selected node
                    }, option);
                    // render container {
                        if (option.container) {
                            tree.container = domQuery.one(option.container);
                        }
                        if (!tree.container) {
                            tree.container = domConstruct.toDom(templateWrapper(tree));
                        }
                        container = tree.container;
                    // }
                    // get other dom nodes {
                        if (tree.hasHead) {
                            tree.headElement = domQuery.one('thead', container);
                        }
                        tree.bodyElement = domQuery.one('tbody', container);
                    // }
                    // add nodes {
                        tree.addNodes(tree.data);
                        delete tree.data;
                    // }
                    // bind events {
                        // instance events {
                            event(tree); // add tree instance events
                            tree.on('node-clicked'     , function (node) { tree.onNodeClicked(node);     });
                            tree.on('node-collapsed'   , function (node) { tree.onNodeCollapsed(node);   });
                            tree.on('node-contextmenu' , function (node) { tree.onNodeContextmenu(node); });
                            tree.on('node-dblclicked'  , function (node) { tree.onNodeDblclicked(node);  });
                            tree.on('node-expanded'    , function (node) { tree.onNodeExpanded(node);    });
                            tree.on('node-selected'    , function (node) { tree.onNodeSelected(node);    });
                        // }
                        // dom events {
                            // domEvent.on(container, 'contextmenu', function () {
                            //     return false;
                            // });
                            domEvent.on(container, 'click', '.tree-node-expander', function (e) {
                                getTreeNodeFromDelegateEventAndTree(e, tree).toggle();
                            });
                            domEvent.on(container, 'click', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                treeNode.trigger('clicked');
                                tree.trigger('node-clicked', treeNode);
                            });
                            domEvent.on(container, 'contextmenu', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                e.preventDefault();
                                treeNode.trigger('contextmenu');
                                tree.trigger('node-contextmenu', treeNode);
                            });
                            domEvent.on(container, 'dblclick', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                treeNode.trigger('dblclicked');
                                tree.trigger('node-dblclicked', treeNode);
                            });
                            domEvent.on(container, 'mousedown', '.tree-node', function (e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                treeNode.select();
                                treeNode.trigger('selected');
                                tree.trigger('node-selected', treeNode);
                            });
                        // }

                    // }
                    return tree;
                },
            // }
            // attributes {
                hasHead        : false,
                treeColumnName : 'tree',
                extraColumns   : [], // extra columns
            // }
            // private methods {
                _processData: function (items) {
                    var tree = this;

                    // add id, extraColumns, tree, etc {
                        each(items, function (item) {
                            var id = item.id;
                            extend(item, {
                                extraColumns : tree.extraColumns,
                                tree         : tree,
                            });
                            if (typeof item.id === 'undefined') {
                                id = item.id = uuid(NS_NODE);
                            }
                            if (!tree.nodeById[id]) {
                                tree.nodeById[item.id] = item; // for counting length
                            }
                        });
                    // }
                    return tree;
                },
                _processNodes: function (nodes) {
                    /*
                     * @description: processing nodes
                     */
                    var tree = this,
                        parentId,
                        parent;

                    each(nodes, function (node) {
                        // add parent-child connections {
                            parent = node.getParent();
                            if (node.parentId !== null) {
                                if (parent) {
                                    node.parent = parent;
                                    parent.addChild(node);
                                } else {
                                    pastry.ERROR('node with id ' + parentId + ' does not exists');
                                }
                            }
                        // }
                    });
                    return tree;
                },
            // }
            // methods {
                addNodes: function (items) {
                    /*
                     * @description: add nodes
                     */
                    var tree  = this,
                        nodes = [];

                    items = items || [];
                    if (!isArray(items)) {
                        items = [items];
                    }
                    tree._processData(items);
                    // turn items into nodes {
                        each(items, function (item) {
                            var id = item.id,
                                node = tree.nodeById[id];
                            if (node instanceof TreeNode) {
                                return;
                            }
                            item = new TreeNode(item);
                            tree.nodes.push(item);
                            nodes.push(item);
                            tree.nodeById[item.id] = item;
                        });
                    // }
                    // process nodes {
                        tree._processNodes(nodes);
                    // }
                    // load nodes {
                        tree.eachNode(function (node) {
                            node.render(); // 必须和 load 分开做
                        });
                        tree.eachNode(function (node) {
                            node.load();
                        });
                    // }
                    return tree;
                },
                addNode: function (item) {
                    return this.addNodes([item]);
                },
                removeNodes: function (nodes) {
                    /*
                     * @description: remove nodes
                     */
                    var tree = this,
                        parent;
                    if (!isArray(nodes)) {
                        nodes = [nodes];
                    }
                    tree.eachNode(nodes, function (node) {
                        var treeNodeIndex = indexOf(tree.nodes, node);
                        if (treeNodeIndex > -1) {
                            remove(tree.nodes, treeNodeIndex);
                        }
                        delete tree.nodeById[node.id];
                        if (parent = node.parent) {
                            parent.removeChild(node);
                        }
                        node.eachChild(function (child) {
                            child.destroy();
                        });
                        node.destroy();
                    });
                    return tree;
                },
                queryNodes: function (query) {
                    /*
                     * @description: find nodes
                     */
                    var tree  = this;
                    if (isArray(query)) {
                        return query;
                    } else if (pastry.isPlainObject(query)) {
                        return pastry.filter(tree.nodes, function (node) {
                            return queryFilter(node, query);
                        });
                    }
                },
                eachNode: function (query, callback) {
                    /*
                     * @description: processing each node
                     */
                    var tree = this,
                        nodes = [];
                    if (!pastry.isFunction(query)) {
                        nodes = tree.queryNodes(query);
                    } else {
                        nodes = tree.nodes;
                        callback = query;
                    }
                    each(nodes, function (node) {
                        callback(node);
                    });
                    return tree;
                },
                expandNodes: function (/* node */) {
                },
            // }
            // events {
                onNodeClicked      : function (/* node */) { },
                onNodeContextmenu  : function (/* node */) { },
                onNodeDblclicked   : function (/* node */) { },
                onNodeExpanded     : function (/* node */) { },
                onNodeRightClicked : function (/* node */) { },
                onNodeSelected     : function (/* node */) { }
            // }
        });

    function queryFilter (target, queryObj) {
        return pastry.every(queryObj, function (value, key) {
            return target[key] === value;
        });
    }

    // Tree.render = function (/* container, option */) {
    // };

    Tree.Node = TreeNode;
    return Tree;
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('all-components-modules',[
    // amd loader {
        'pastry/module/loader',
    // }
    // formatting {
        'pastry/fmt/date',
        'pastry/fmt/sprintf',
        'pastry/fmt/vsprintf',
        'pastry/fmt/camelCase',
    // }
    // Color {
        'pastry/color/Base',
    // }
    // parsers {
        'pastry/parser/json',
        'pastry/parser/template',
    // }
    // html utils {
        'pastry/html/utils',
    // }
    // dom {
        'pastry/dom/hotkey.js',
    // }
    // all components {
        'pastry/component/Collapse',
        'pastry/component/Notify',
        'pastry/component/Tooltip',
        'pastry/component/Tree',
    // }
], function() {
    /*
     * @author      : 绝云（wensen.lws）
     * @description : for building an amd-debug version of pastry
     */
});


