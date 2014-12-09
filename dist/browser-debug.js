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
        P = {},
    // }
    // 局部变量 {
        A  = Array,
        F  = Function,
        O  = Object,
        S  = String,
        PS = 'prototype',
        U  = 'undefined',
        AP = A[PS],
        FP = F[PS],
        OP = O[PS],
        SP = S[PS],

        isObject,
        isFunction,

        toStr = {}.toString,
        slice = AP.slice,

        noop = function () { },

        isType = function (type, obj) {
            return toStr.call(obj) === '[object ' + type + ']';
        };
    // }
    // 版本号 {
        P.VERSION = '0.2.0';
    // }
    // ES5 && ES6 函数集 {
        P.index = function (up) {
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
        P.indexOf = AP.indexOf ?
            /*
             * @description : 返回 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : pastry.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr, searchElement, fromIndex) {
                return arr.indexOf(searchElement, fromIndex);
            } : P.index(true);
        P.lastIndexOf = AP.lastIndexOf ?
            /*
             * @description : 返回最后一个 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : pastry.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr, searchElement, fromIndex) {
                return arr.lastIndexOf(searchElement, fromIndex);
            } : P.index();

        P.each = P.forEach = OP.forEach ?
            /*
             * @description : 遍历
             * @parameter*  : {Object  } obj      , 待循环变量
             * @parameter*  : {Function} callback , 回调函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @syntax      : pastry.each(obj Object, callback Function[, thisObj Object]);
             * @syntax      : pastry.forEach(obj Object, callback Function[, thisObj Object]);
             */
            function (obj, callback, thisObj) {
                obj.forEach(callback, thisObj);
            } : function (obj, callback, thisObj) {
                for (var key in obj) {
                    callback.call(thisObj, obj[key], key, obj);
                }
            };

        P.eachReverse = function (arr, callback, thisObj) {
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
        };

        P.every = AP.every ?
            /*
             * @description : 测试是否对于 arr 中的元素，callback 都返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 结果
             * @syntax      : pastry.every(arr, callback[, thisObj])
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

        P.filter = AP.filter ?
            /*
             * @description : 根据 callback 是否通过来过滤 arr 中的元素，返回过滤后的数组
             * @parameter*  : {Array   } arr      , 待过滤数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : pastry.filter(arr, callback[, thisObj])
             */
            function (arr, callback, thisObj) {
                return arr.filter(callback, thisObj);
            } : function (arr, callback, thisObj) {
                var res = [];
                P.each(arr, function (element, key) {
                    if (callback.call(thisObj, element, key, arr)) {
                        res.push(element);
                    }
                });
                return res;
            };

        P.map = AP.map ?
            /*
             * @description : 用 arr 通过 callback 函数加工各个元素得到新的数组
             * @parameter*  : {Array   } arr      , 待加工数组
             * @parameter*  : {Function} callback , 加工函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : pastry.map(arr, callback[, thisObj])
             */
            function (arr, callback, thisObj) {
                return arr.map(callback, thisObj);
            } : function (arr, callback, thisObj) {
                var res = [];
                P.each(arr, function (element, key) {
                    res.push(callback.call(thisObj, element, key, arr));
                });
                return res;
            };

        P.some = AP.some ?
            /*
             * @description : 测试 arr 中每个元素，当有真的时候退出并返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 测试函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 真值
             * @syntax      : pastry.some(arr, callback[, thisObj])
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

        P.reduce = AP.reduce ?
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
        P.reduceRight = AP.reduceRight ?
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

        P.trim = SP.trim ?
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
        P.trimLeft = SP.trimLeft ?
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
        P.trimRight = SP.trimRight ?
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
            P.lc = function (str) {
                /*
                 * @syntax: pastry.lc(str String);
                 */
                return str.toString().toLowerCase();
            };
            P.uc = function (str) {
                /*
                 * @syntax: pastry.uc(str String);
                 */
                return str.toString().toUpperCase();
            };
            P.hasSubString = function (str, subStr) {
                /*
                 * @syntax: pastry.hasSubString(str String, subStr String);
                 */
                return (str.indexOf(subStr) > -1);
            };
        // }
        // 类型判断 pastry.is$Type(obj) {
            /*
             * @description : 类型判断
             * @parameter*  : {Any} obj, 待判断对象
             * @syntax      : pastry.is$Type(obj Any);
             */
            P.each([
                'Array',
                'Arguments',
                'Boolean',
                'Date',
                'Error',
                'Number',
                'RegExp',
                'String'
            ], function (type) {
                P['is' + type] = function (obj) {
                    return isType(type, obj);
                };
            });
            P.isFunction = isFunction = function (obj) {
                return isType('Function', obj);
            };
            P.isObject = isObject = function (obj) {
                var type = typeof obj;
                return type === 'object' && !!obj;
            };
            P.isNaN = function (obj) {
                return P.isNumber(obj) && obj !== +obj;
            };
            P.isFinite = function (obj) {
                return P.isNumber(obj) && isFinite(obj) && !isNaN(obj);
            };
            P.isUndefined = function (obj) {
                return obj === undefined;
            };
            P.isNull = function (obj) {
                return obj === null;
            };
            if (A.isArray) {
                P.isArray = A.isArray;
            }
        // }
        // 数组、对象相关 {
            P.isArrayLike = function (obj) {
                return (typeof obj === 'object' && isFinite(obj.length));
            };
            P.toArray = function (obj) {
                return P.isArrayLike(obj) ? slice.call(obj) : [];
            };
            P.flatten = function (array) {
                /*
                 * @description: 扁平化二维数组
                 */
                for (var r = [], i = 0, l = array.length; i < l; ++i) {
                    if (P.isArrayLike(array[i])) {
                        r = r.concat(array[i]);
                    } else {
                        r[r.length] = array[i];
                    }
                }
                return r;
            };
            P.merge = function (dest) {
                /*
                 * @description : 合并对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : pastry.merge(dest Object[, src1 Object, src2 Object, ...]);
                 */
                if (isObject(dest) || isFunction(dest)) {
                    P.each(P.toArray(arguments).slice(1), function (source) {
                        if (source) {
                            for (var prop in source) {
                                if (isObject(source[prop])) {
                                    dest[prop] = dest[prop] || {};
                                    P.merge(dest[prop], source[prop]);
                                } else {
                                    dest[prop] = source[prop];
                                }
                            }
                        }
                    });
                }
                return dest;
            };
            P.extend = function (dest) {
                /*
                 * @description : 扩展对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : pastry.extend(dest Object[, src1 Object, src2 Object, ...]);
                 */
                if (isObject(dest) || isFunction(dest)) {
                    P.each(P.toArray(arguments).slice(1), function (source) {
                        if (source) {
                            for (var prop in source) {
                                dest[prop] = source[prop];
                            }
                        }
                    });
                }
                return dest;
            };
            P.remove = function (arr, fromIndex, toIndex) {
                /*
                 * @description : 删除数组元素
                 * @parameter*  : {Array } arr       , 待处理数组
                 * @parameter   : {Number} fromIndex , 起始 index
                 * @parameter   : {Number} toIndex   , 结束 index
                 * @syntax      : pastry.remove(arr, [fromIndex[, toIndex]])
                 */
                var rest,
                    len = arr.length;
                if (!P.isNumber(fromIndex)) {
                    return arr;
                }
                rest = arr.slice((toIndex || fromIndex) + 1 || len);
                arr.length = fromIndex < 0 ? len + fromIndex : fromIndex;
                return arr.push.apply(arr, rest);
            };
            P.keys = O.keys ?
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
                        P.each(obj, function (value, key) {
                            if (key !== P) {
                                result.push(key);
                            }
                        });
                    } else {
                        P.each(obj, function (value, key) {
                            result.push(key);
                        });
                    }
                    return result;
                };

            P.values = function (obj) {
                /*
                 * @description : 获取对象值集合
                 * @parameter*  : {object} obj, 对象
                 * @syntax      : pastry.values(obj)
                 */
                var values = [];
                P.each(obj, function (value) {
                    values.push(value);
                });
                return values;
            };
            P.hasKey = function (obj, key) {
                /*
                 * @description : 检查是否存在键
                 * @parameter*  : {Object} obj, 待检查对象
                 * @parameter*  : {String} key, 键
                 * @syntax      : pastry.hasKey(obj, key)
                 */
                return obj.hasOwnProperty(key);
            };
            P.hasValue = function (obj, value) {
                /*
                 * @description : 检查是否存在值
                 * @parameter*  : {Object} obj   , 待检查对象
                 * @parameter*  : {String} value , 值
                 * @syntax      : pastry.hasValue(obj, value)
                 */
                return (P.indexOf(P.values(obj), value) > -1);
            };
            P.uniq = function (arr) {
                /*
                 * @description : 求集合
                 * @parameter*  : {Array} arr, 求集合数组
                 * @syntax      : pastry.uniq(arr Array);
                 */
                var resultArr = [];
                P.each(arr, function (element) {
                    if (!P.hasValue(resultArr, element)) {
                        resultArr.push(element);
                    }
                });
                return resultArr;
            };
            P.union = function (/*arr1, arr2 */) {
                /*
                 * @description : 合集
                 * @parameter*  : {Array} arr1, 求合集数组
                 * @syntax      : pastry.union([arr1 Array, arr2 Array, ...]);
                 */
                var resultArr = [],
                    sourceArrs = P.toArray(arguments).slice();
                P.each(sourceArrs, function (arr) {
                    resultArr.concat(arr);
                });
                return P.uniq(resultArr);
            };
        // }
        // 函数相关 {
            P.bind = FP.bind ?
                /*
                 * @description : 绑定函数运行上下文
                 * @parameter*  : {Function} func, 目标函数
                 * @parameter*  : {Object  } oThis, 上下文
                 * @syntax      : pastry.uuid(func Function, oThis Object);
                 */
                function (func, oThis) {
                    return func.bind(oThis, P.toArray(arguments).slice(2));
                } : function (func, oThis) {
                    if (isFunction(oThis) && isFunction(func)) {
                        var aArgs  = P.toArray(arguments).slice(2),
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
        // debug {
            /*
             * @description : debug 相关函数
             * @syntax      : pastry.[INFO|LOG|WARN|ERROR]
             */
            P.each([
                'info',
                'log',
                'warn'
            ], function (type) {
                P[type.toUpperCase()] = (typeof console === U) ? noop : P.bind(console[type], console);
            });
            P.ERROR = function (err) {
                P.WARN(err);
                throw new Error(err);
            };
        // }
        // 其它 {
            P.getAny = function (callbackList) {
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
            P.uuid = function (prefix) {
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
        P.mixin = function (obj, override) {
            P.each(obj, function (value, key) {
                if (P[key] && !override) {
                    P.ERROR('P.' + key + ' already exists');
                } else {
                    P[key] = value;
                }
            });
        };
    // }
    // 输出全局变量 {
        P.setGLOBAL = function (key, value) {
            /*
             * @description : 设置全局变量
             * @parameter   : {String} key, 变量名
             * @parameter   : {Any   } value, 值
             * @syntax      : pastry.setGLOBAL(key String, value Any);
             */
            if (typeof exports !== U) {
                exports[key] = value;
            }
            GLOBAL[key] = value;
        };
        P.each([
            'P',
            'pastry',
            'PASTRY'
        ], function (alias) {
            P.setGLOBAL(alias, P);
        });

        if (typeof exports !== U) {
            if (typeof module !== U && module.exports) {
                module.exports = P;
            }
        }
    // }
    // 获取全局变量 {
        P.getGLOBAL = function (key) {
            return GLOBAL[key];
        };
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

    var
        pastry = GLOBAL.pastry,

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
                    pastry.each(list, function (event) {
                        event.callback.apply(event.context, args);
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
// /* global document */

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
        event  = pastry.event,

        Module = function (meta) {
            /*
             * @description: 模块构造函数
             */
            var mod = this;
            mod.init(meta);
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
        init: function (meta) {
            /*
             * @description: 初始化
             */
            var mod = this;
            pastry.extend(mod, meta);
            Module.emit('module-inited', mod);
            moduleByUri[mod.uri] = mod;
            moduleByUri[mod.id]  = mod;
            queueByUri[mod.uri]  = mod;
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
                return mod;
            }

            if (pastry.every(mod.deps, function (uri) {
                return !!executedByUri[uri];
            })) {
                var modFactory = mod.factory,
                    modUri     = mod.uri,
                    modId      = mod.id;

                pastry.each(mod.deps, function (uri) {
                    depModExports.push(exportsByUri[uri]);
                });
                mod.exports = exportsByUri[modUri] = exportsByUri[modId] = pastry.isFunction(modFactory) ?
                    modFactory.apply(undef, depModExports) : modFactory;
                executedByUri[modUri] = true;
                executedByUri[modId]  = true;
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
        pastry.each(queueByUri, function (mod2BeExecuted/*, uri */) {
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
        define('Module', function () {
            return Module;
        });
        define('pastry', function () {
            return pastry;
        });
        define('event', function () {
            return event;
        });
    // }
    // 输出 require 函数 {
        pastry.setGLOBAL('require' , require);
    // }
}(this));

/* jshint strict: true, undef: true, unused: true */
/* global define, document, location */

define('module/path', [
    'pastry',
    'Module'
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
        id2Uri: id2Uri
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('module/request', [
    'pastry',
    'Module'
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

define('module/loader', [
    'pastry',
    'Module',
    'module/path',
    'module/request'
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
        } catch(e) { // safari的错误对象只有line, sourceId, sourceURL
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
            if (src === '' || (pastry.isString(src) && src.indexOf(data.cwd) > -1)) {
                if (meta.id) { // script tag 中的具名模块
                    // meta.id = './' + meta.id; // @FIXME 去掉这个处理
                } else { // script tag 中的匿名模块
                    meta.uri = data.cwd + ('#' + pastry.uuid());
                }
            }
        })
        .on('module-inited', function (mod) {
            if (!(pastry.isString(mod.uri) && mod.uri.indexOf('/') > -1)) {
                pastry.extend(mod, {
                    uri: id2Uri(mod.id)
                });
            }
        })
        .on('module-depsProcessed', function (mod) {
            pastry.each(mod.deps, function (id, index) {
                var uri;
                if (moduleByUri[id]) {
                    uri = id;
                } else {
                    uri = id2Uri(id, mod.uri);
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

define('module/config', [
    'Module'
], function (
    Module
) {
    'use strict';
    /*
     * @author      : 绝云 (wensen.lws@alibaba-inc.com)
     * @description : configuration
     * @TODO
     */
    Module.config = function () { };
    // var  module;
    // return  module;
});

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('fmt/date', [
    'pastry'
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

    return function (date, pattern) {
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

define('fmt/sprintf', [
    'pastry'
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

define('fmt/vsprintf', [
    'pastry',
    'fmt/sprintf'
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

define('json', [
    'pastry',
    'fmt/date'
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
        pastry.JSON = obj;
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

define('Class', [
    'pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云
     * @description : Class utils
     */

    var
        str_className   = '__className',
        str_constructor = '__constructor',
        Class = function () { };

    Class[str_className] = 'Class';
    Class.instanceof = function (instance, superClass) {
        return instance instanceof superClass || (
            instance[str_constructor] &&
            instance[str_constructor][str_className] === superClass[str_className]
        );
    };

    Class.prototype = {
        init: function (info) {
            var instance = this;
            pastry.extend(instance, info);
            return instance;
        },
        destroy: function () {
            var instance = this;
            for (var p in instance) {
                if (instance.hasOwnProperty(p)) {
                    delete instance[p];
                }
            }
            // instance.prototype = instance['__proto__'] = null;
            // instance = null;
        }
    };

    return pastry.Class = Class;
});

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('declare', [
    'pastry',
    'Class'
], function(
    pastry,
    Class
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Class utils
     */
    var undef,

        str_class        = '__class',
        NS               = str_class + '__',
        str_className    = str_class + 'Name',
        str_prototype    = 'prototype',
        str_superClasses = '__superClasses',
        str_constructor  = '__constructor',

        declare = function (/*className, superClasses, props*/) {
            var args          = pastry.toArray(arguments),
                className     = pastry.isString(args[0]) ? args.shift() : undef,
                superClasses  = args.length > 1 ? args.shift() : [],
                props         = args[0],
                constructor   = props && props.constructor ? props.constructor : function (info) {
                    return this.init(info);
                };

            constructor[str_prototype]    = {};
            constructor[str_superClasses] = superClasses;

            if (superClasses.length === 0) {
                constructor[str_prototype] = Class[str_prototype];
                constructor[str_superClasses] = [Class];
            } else {
                pastry.each(superClasses, function (superClass) {
                    pastry.extend(constructor[str_prototype], superClass[str_prototype]);
                });
            }

            constructor[str_className] = className || pastry.uuid(NS);

            pastry.extend(constructor[str_prototype], props);
            constructor[str_prototype][str_class] = constructor[str_prototype][str_constructor] = constructor;

            return constructor;
        };

    return pastry.declare = declare;
});

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('color/named', [
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

define('class/Color', [
    'pastry',
    'declare',
    'color/named'
], function(
    pastry,
    declare,
    namedColor
) {
    'use strict';
    /*
     * @author      : 绝云
     * @description : 颜色构造函数
     * @TODO        : 构建基类，完成基础的继承／生命周期／事件／方法等封装
     * @note        : can be used in nodejs
     */
    var
        lc    = pastry.lc,
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
                instance.init(color);
            }
        },

        classMaker;

    pastry.extend(Color, {
        named: namedColor,

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
            var s = Color.named[str];
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
        init: function (color) {
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
        }
    });

    return pastry.Color = declare('Color', classMaker);
});
/* jshint strict: true, undef: true, unused: true */
/* global define, decodeURIComponent, encodeURIComponent */

define('querystring', [
    'pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-11-19
     * @description : querystring 模块
     * @note        : browsers only
     */
    var escape = encodeURIComponent,

        unescape = function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        },

        querystring = {
            /*
             * @description : override default encoding method
             * @syntax      : querystring.escape(str)
             * @param       : {String} str, unescaped string.
             * @return      : {String} escaped string.
             */
            escape: escape,

            /*
             * @description : override default decoding method
             * @syntax      : querystring.unescape(str)
             * @param       : {String} str, escaped string.
             * @return      : {String} unescaped string.
             */
            unescape: unescape,

            parse: function (qs, sep, eq) {
                /*
                 * @description : accept query strings and return native javascript objects.
                 * @syntax      : querystring.parse(str)
                 * @param       : {String} str, query string to be parsed.
                 * @return      : {Object} parsed object.
                 */
                sep = sep || '&';
                eq  = eq  || '=';
                var tuple,
                    obj    = {},
                    pieces = qs.split(sep);

                pastry.each(pieces, function (elem) {
                    tuple = elem.split(eq);
                    if (tuple.length > 0) {
                        obj[unescape(tuple.shift())] = unescape(tuple.join(eq));
                    }
                });
                return obj;
            },
            stringify: function (obj, c) {
                /*
                 * @description : converts an arbitrary value to a query string representation.
                 * @syntax      : querystring.stringify(obj)
                 * @param       : {object} obj, object to be stringified
                 * @return      : {String} query string.
                 */
                var qs = [],
                    s  = c && c.arrayKey ? true : false;

                pastry.each(obj, function (value, key) {
                    if (pastry.isArray(value)) {
                        pastry.each(value, function (elem) {
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

    return querystring;
});

/* jshint strict: true, undef: true, unused: true */
/* global define, location, navigator, ActiveXObject */

define('bom/utils', [
    'pastry'
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

    detectedPlugins = detectPlugin(plugins);

    pastry.extend(versions, detectVersion(userAgent), detectedPlugins);

    return {
        host      : location.host,
        platform  : detectPlatform(platform) || detectPlatform(userAgent) || 'unknown',
        plugins   : detectedPlugins,
        userAgent : userAgent,
        versions  : versions,
        isWebkit  : !!versions.webkit,
        isIE      : !!versions.msie,
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('dom/utils', [
    'pastry'
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

    return pastry.domUtils = {
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
        isQuirks       : pastry.lc(doc.compatMode) === 'backcompat' || doc.documentMode === 5, // 怪异模式
        hasTextContent : 'textContent' in testDiv,
        hasClassList   : 'classList'   in testDiv,
        hasDataSet     : 'dataset'     in testDiv,
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('dom/query', [
    'pastry',
    'dom/utils'
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
        // }
        doc = document,
        win = window,
        nodeTypeStr = 'nodeType',
        re_quick    = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, // 匹配快速选择器
        result      = {};

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

    // 封装 api {
        return pastry.domQuery = pastry.extend(result, {
            all : query,
            one : queryOne,
        });
    // }
});

/* jshint strict: true, undef: true, unused: true */
/* global define, document, self, top */

define('dom/ready', [
    'pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : domready
     * @reference   : https://github.com/ded/domready/tree/v0.3.0
     */
    var
        fn,
        ready,
        fns    = [],
        f      = false,
        doc    = document,
        testEl = doc.documentElement,
        hack   = testEl.doScroll,
        domContentLoaded   = 'DOMContentLoaded',
        addEventListener   = 'addEventListener',
        onreadystatechange = 'onreadystatechange',
        readyState         = 'readyState',
        loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/,
        loaded    = loadedRgx.test(doc[readyState]);

    function flush(f) {
        loaded = 1;
        while (f = fns.shift()) {
            f();
        }
    }
    function checkLoaded (fn) {
        if (loaded) {
            fn();
        } else {
            fns.push(fn);
        }
    }

    if (doc[addEventListener]) {
        doc[addEventListener](domContentLoaded, fn = function () {
            doc.removeEventListener(domContentLoaded, fn, f);
            flush();
        }, f);
    }
    if (hack) {
        doc.attachEvent(onreadystatechange, fn = function () {
            if (/^c/.test(doc[readyState])) {
              doc.detachEvent(onreadystatechange, fn);
              flush();
            }
        });
    }

    return pastry.domReady = ready = hack ? function (fn) {
        if (self !== top) {
            checkLoaded(fn);
        } else {
            try {
                testEl.doScroll('left');
            } catch (e) {
                return setTimeout(function() { ready(fn); }, 50);
            }
            fn();
        }
    } : checkLoaded;
});

/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('dom/construct', [
    'pastry',
    'bom/utils',
    'dom/query'
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

    domConstruct = {
        toDom: function (frag) {
            frag += '';

            var match  = frag.match(RE_tag),
                tag    = match ? pastry.lc(match[1]) : '',
                master = masterDiv, // 每次拷贝缓存好的 div，否则会引入问题
                wrap, i, fc, df;

            if (match && tagWrap[tag]) {
                wrap = tagWrap[tag];
                master.innerHTML = wrap.pre + frag + wrap.post;
                for(i = wrap.length; i; --i){
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
                        }
                        break;
                    default:
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

    return pastry.domConstruct = domConstruct;
});

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('dom/style', [
    'pastry',
    'bom/utils',
    'dom/utils',
    'dom/query'
], function(
    pastry,
    bomUtils,
    domUtils,
    domQuery
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

            if(node.tagName.toLowerCase() === 'tr'){
                for(var td = node.firstChild; td; td = td.nextSibling){
                    if(td.tagName.toLowerCase() === 'td'){
                        setOpacity(td, opacity);
                    }
                }
            }
            return opacity;
        };
    } else {
        getOpacity = function(node){
            return getComputedStyle(node).opacity;
        };
        setOpacity = function(node, opacity){
            return node.style.opacity = opacity;
        };
    }


    // getComputedStyle {
        if (bomUtils.isWebkit) {
            getComputedStyle = function (node) {
                var style;
                if (node.nodeType === 1) {
                    var dv = node.ownerDocument.defaultView;
                    style = dv.getComputedStyle(node, null);
                    if (!style && node.style) {
                        node.style.display = '';
                        style = dv.getComputedStyle(node, null);
                    }
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
                if(!avalue){
                    return 0;
                }
                // on IE7, medium is usually 4 pixels
                if(avalue === 'medium'){
                    return 4;
                }
                // style values can be floats, client code may
                // want to round this value for integer pixels.
                if(avalue.slice && avalue.slice(-2) === 'px'){
                    return parseFloat(avalue);
                }
                var s = element.style,
                    rs = element.runtimeStyle,
                    cs = element.currentStyle,
                    sLeft = s.left,
                    rsLeft = rs.left;
                rs.left = cs.left;
                try{
                    // 'avalue' may be incompatible with style.left, which can cause IE to throw
                    // this has been observed for border widths using 'thin', 'medium', 'thick' constants
                    // those particular constants could be trapped by a lookup
                    // but perhaps there are more
                    s.left = avalue;
                    avalue = s.pixelLeft;
                }catch(e){
                    avalue = 0;
                }
                s.left = sLeft;
                rs.left = rsLeft;
                return avalue;
            };
        } else {
            toPixel = function(element, value){
                return parseFloat(value) || 0;
            };
        }
    // }

    return pastry.domStyle = domStyle = {
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
        }
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('dom/attr', [
    'pastry',
    'bom/utils',
    'dom/utils',
    'dom/query',
    'dom/construct',
    'dom/style'
], function(
    pastry,
    bomUtils,
    domUtils,
    domQuery,
    domConstruct,
    domStyle
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : 获取／设置 dom 元素的属性
     */
    var bomVersions    = bomUtils.versions,
        ieVersion      = bomVersions.msie || 0,
        lcStr          = pastry.lc,
        isBoolean      = pastry.isBoolean,
        isFunction     = pastry.isFunction,
        isString       = pastry.isString,
        hasTextContent = domUtils.hasTextContent,
        queryOne       = domQuery.one,
        propNames = {
            'class'     : 'className',
            'for'       : 'htmlFor',
            tabindex    : 'tabIndex',
            readonly    : 'readOnly',
            colspan     : 'colSpan',
            frameborder : 'frameBorder',
            rowspan     : 'rowSpan',
            textcontent : 'textContent',
            valuetype   : 'valueType'
        },
        forcePropNames = {
            innerHTML   : 1,
            textContent : 1,
            className   : 1,
            htmlFor     : !!ieVersion,
            value       : 1
        },
        attrNames = {
            classname : 'class',
            htmlfor   : 'for',
            tabindex  : 'tabIndex',
            readonly  : 'readOnly'
        },
        domAttr;

    function hasAttr (node, name) {
        var attr = node.getAttributeNode && node.getAttributeNode(name);
        return !!attr && attr.specified;
    }
    function getText (node) {
        var text = '',
            ch   = node.childNodes;
        for(var i = 0, n; n = ch[i]; i++){
            //Skip comments.
            if(n.nodeType !== 8){
                if(n.nodeType === 1){
                    text += getText(n);
                }else{
                    text += n.nodeValue;
                }
            }
        }
        return text;
    }
    function getProp (node, name) {
        var lc       = name.toLowerCase(),
            propName = exports.names[lc] || name;
        if (propName === 'textContent' && !hasTextContent) {
            return getText(node);
        }
        return node[propName];  // Anything
    }
    function setProp (node, name, value) {
        var l = arguments.length;
        if(l === 2 && !isString(name)){ // inline'd type check
            // the object form of setter: the 2nd argument is a dictionary
            for(var x in name){
                setProp(node, x, name[x]);
            }
            return node; // DomNode
        }
        var lc = lcStr(name),
            propName = propNames[lc] || name;
        if (propName === 'style' && !isString(value)) { // inline'd type check
            // special case: setting a style
            domStyle.set(node, value);
            return node; // DomNode
        }
        if (propName === 'innerHTML') {
            if(ieVersion && lcStr(node.tagName) in {
                col      : 1,
                colgroup : 1,
                table    : 1,
                tbody    : 1,
                tfoot    : 1,
                thead    : 1,
                tr       : 1,
                title    : 1
            }){
                domConstruct.empty(node);
                node.appendChild(domConstruct.toDom(value, node.ownerDocument));
            } else {
                node[propName] = value;
            }
            return node; // DomNode
        }
        if (propName === 'textContent' && !hasTextContent) {
            domConstruct.empty(node);
            node.appendChild(node.ownerDocument.createTextNode(value));
            return node;
        }
        node[propName] = value;
        return node;
    }

    return pastry.domAttr = domAttr = {
        has: function (node, name) {
            var lc = lcStr(name);
            return forcePropNames[propNames[lc] || name] || hasAttr(queryOne(node), attrNames[lc] || name);
        },
        get: function (node, name) {
            node = queryOne(node);
            var lc        = lcStr(name),
                propName  = propNames[lc] || name,
                forceProp = forcePropNames[propName],
                value     = node[propName],
                attrName; // should we access this attribute via a property or via getAttribute()?

            if (forceProp && !pastry.isUndefined(value)) {
                // node's property
                return value;   // Anything
            }

            if (propName === 'textContent') {
                return getProp(node, propName);
            }

            if (propName !== 'href' && (isBoolean(value) || isFunction(value))) {
                // node's property
                return value;   // Anything
            }
            // node's attribute
            // we need _hasAttr() here to guard against IE returning a default value
            attrName = attrNames[lc] || name;
            return hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
        },
        set: function (node, name, value) {
            node = queryOne(node);
            if(arguments.length === 2){ // inline'd type check
                // the object form of setter: the 2nd argument is a dictionary
                for(var x in name){
                    domAttr.set(node, x, name[x]);
                }
                return node; // DomNode
            }
            var lc        = name.toLowerCase(),
                propName  = propNames[lc] || name,
                forceProp = forcePropNames[propName];
            if (propName === 'style' && isString(value)) { // inline'd type check
                // special case: setting a style
                domStyle.set(node, value);
                return node; // DomNode
            }
            if (forceProp || isBoolean(value) || isFunction(value)) {
                return setProp(node, name, value);
            }
            // node's attribute
            node.setAttribute(attrNames[lc] || name, value);
            return node; // DomNode
        },
        remove: function (node, name) {
            queryOne(node).removeAttribute(attrNames[lcStr(name)] || name);
        },
        getNodeProp: function (node, name) {
            node = queryOne(node);
            var lc       = lcStr(name),
                propName = propNames[lc] || name,
                attrName;
            if ((propName in node) && propName !== "href") {
                // node's property
                return node[propName];  // Anything
            }
            // node's attribute
            attrName = attrNames[lc] || name;
            return hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
        }
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('dom/class', [
    'pastry',
    'dom/utils',
    'dom/query'
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

    return pastry.domClass = domClass = {
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
/* global define */

define('dom/data', [
    'pastry',
    'dom/attr',
    'dom/utils',
    'dom/query'
], function(
    pastry,
    domAttr,
    domUtils,
    domQuery
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

    return pastry.domData = domData = {
        get: function (node, name) {
            node = domQuery.one(node);
            if (hasDataSet) {
                return node[dataSetStr][name];
            }
            return domAttr.get(node, dataPrefix + name);
        },
        set: function (node, name, value) {
            node = domQuery.one(node);
            if (hasDataSet) {
                node[dataSetStr][name] = value;
            } else {
                domAttr.set(node, dataPrefix + name, value);
            }
        }
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define, XMLHttpRequest, ActiveXObject, location */

define('io/ajax', [
    'pastry',
    'json',
    'querystring',
    'bom/utils'
], function (
    pastry,
    JSON,
    querystring,
    bomUtils
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-11-19
     * @description : io 模块 - ajax
     * @note        : browser only
     */

    function getXHR () {
        return pastry.getAny([
            function () { return new XMLHttpRequest();                   },
            function () { return new ActiveXObject('MSXML2.XMLHTTP');    },
            function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
        ]);
    }

    var ajax = function (uri, option) {
        /*
         * @description : ajax.
         * @syntax      : [pastry.]ajax(uri[, option])[.error(callback)][.success(callback)]..
         * @param       : {String} uri, uri.
         * @param       : {Object} option, option.
         * @return      : {this  } return itself for chain operations.
         */
        option = option || {};
        var xhr         = getXHR(),
            method      = option.method ? pastry.uc(option.method)           : 'GET',
            type        = option.type   ? pastry.lc(option.type)             : 'xml',
            data        = option.data   ? querystring.stringify(option.data) : null,
            contentType = option.contentType,
            isAsync     = option.isAsync;

        // add handlers {
            pastry.each([
                'abort'     ,
                'error'     ,
                'load'      ,
                'loadend'   ,
                'loadstart' ,
                'progress'  ,
                'success'   ,
                'timeout'
            ], function (handler) {
                /*
                 * @description : event handlers.
                 * @param       : {Function} callback, callback function.
                 */
                if (option[handler]) {
                    xhr['on' + handler] = option[handler];
                }
            });
        // }
        // success / error callback {
            xhr.isSuccess = function () {
                /*
                 * @description : is ajax request success
                 * @syntax      : pastry.ajax.isSuccess()
                 * @return      : {Boolean} is ajax request successfully porformed
                 */
                var status = xhr.status;
                return (status >= 200 && status < 300)            ||
                       (status === 304)                           ||
                       (!status && location.protocol === 'file:') ||
                       (!status && bomUtils.versions.safari);
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.isSuccess() && option.success) {
                        var response = xhr.responseText;
                        if (type === 'json') {
                            response = pastry.getAny([function () { return JSON.parse(response); }]) || response;
                        }
                        xhr.onsuccess(response);
                    } else if (option.error) {
                        xhr.onerror(xhr.statusText);
                    }
                }
            };
        // }
        // progress ajax {
            if (method === 'GET') {
                if (data) {
                    uri += (pastry.hasSubString(uri, '?') ? '&' : '?') + data;
                }
                xhr.open(method, uri, isAsync);
                xhr.setRequestHeader(
                        'Content-Type',
                        contentType || 'text/plain;charset=UTF-8'
                    );
            } else if (method === 'POST') {
                xhr.open(method, uri, isAsync);
                xhr.setRequestHeader(
                        'Content-Type',
                        contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
                    );
            } else {
                xhr.open(method, uri, isAsync);
            }
            xhr.send(data);
        // }
    };

    return pastry.ajax = ajax;
});

