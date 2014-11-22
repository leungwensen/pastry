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

        toStr = {}.toString,
        slice = AP.slice,

        noop = function () { };
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
                'Function',
                'Number',
                'RegExp',
                'String'
            ], function (type) {
                P['is' + type] = function (obj) {
                    return toStr.call(obj) === '[object ' + type + ']';
                };
            });
            P.isArray = A.isArray ? A.isArray : P.isArray;

            P.isObject = function (obj) {
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
        // }
        // 数组、对象相关 {
            P.toArray = function (obj) {
                return slice.call(obj);
            };
            P.merge = function (dest) {
                /*
                 * @description : 合并对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : pastry.merge(dest Object[, src1 Object, src2 Object, ...]);
                 */
                if (P.isObject(dest)) {
                    P.each(P.toArray(arguments).slice(1), function (source) {
                        if (source) {
                            for (var prop in source) {
                                if (P.isObject(source[prop])) {
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
                if (P.isObject(dest)) {
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
                    if (P.isFunction(obj)) {
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
                    if (P.isFunction(oThis) && P.isFunction(func)) {
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

    // add .event to pastry {
        pastry.mixin({
            event: event
        });
    // }
    // add on(), off(), emit(), trigger() to pastry {
        event(pastry);
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
     */
    if (define) { // 避免反复执行
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

        data = Module._data = {},

        moduleByUri   = data.moduleByUri   = {},
        exportsByUri  = data.exportsByUri  = {},
        executedByUri = data.executedByUri = {},
        queueByUri    = data.queueByUri    = {},

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

    pastry.mixin({
        sprintf: sprintf
    });
    return sprintf;
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

    pastry.mixin({
        vsprintf: vsprintf
    });
    return vsprintf;
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
        pastry.mixin({
            JSON: obj
        });
        pastry.setGLOBAL('JSON', obj);
    }
    // saving codes {
        function isFunction (obj) { return pastry.isFunction(obj); }
        function isString   (obj) { return pastry.isString(obj);   }
        function isNumber   (obj) { return pastry.isNumber(obj);   }
    // }

    if (JSON && !!JSON.parse && !!JSON.stringify) {
        exportJSON(JSON);
        return JSON;
    }
    // 补全基础数据类型的 toJSON 方法 {
        var D2JSON = Date.prototype.toJSON;

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

