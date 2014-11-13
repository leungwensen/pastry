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

        noop = function() { };
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
                for (var key in obj){
                    callback.call(thisObj, obj[key], key, obj);
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
            function(arr, callback, thisObj) {
                return arr.map(callback, thisObj);
            } : function(arr, callback, thisObj) {
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
            P.isNaN = function(obj) {
                return P.isNumber(obj) && obj !== +obj;
            };
            P.isFinite = function(obj) {
                return P.isNumber(obj) && isFinite(obj) && !isNaN(obj);
            };
            P.isUndefined = function(obj) {
                return obj === undefined;
            };
            P.isNull = function(obj) {
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
                    P.each(P.toArray(arguments).slice(1), function(source) {
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
                    P.each(P.toArray(arguments).slice(1), function(source) {
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
            ], function(type) {
                P[type.toUpperCase()] = (typeof console === U) ? noop : console[type];
            });
            P.ERROR = function(err) {
                P.warn(P.toArray(arguments));
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
            P.uuid = function(prefix){
                /*
                 * @description : 生成uuid
                 * @parameter   : {String} prefix, 前缀
                 * @syntax      : pastry.uuid(prefix String);
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
    // 增加 pastry 函数 {
        /*
         * @description : 把对象中的属性／方法加到 pastry 这个 namespace 下
         * @parameter   : {Object } obj, 扩展对象
         * @parameter   : {Boolean} override, 是否覆盖
         * @syntax      : pastry.mixin(obj Object[, override Boolean]);
         */
        P.mixin = function(obj, override) {
            P.each(obj, function(value, key) {
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

var define;

(function (GLOBAL) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-09-18
     * @description : amd 模块 - define
     * @reference   : https://github.com/jivesoftware/tamd.git
     * @reference   : https://gist.github.com/388e70bccd3fdb8a6617
     */

    var pastry = GLOBAL.pastry;

    function stubHook (next) {
        next.apply(undef, pastry.toArray(arguments).slice(1));
    }
    function addDefinition (id, dependencies, factory) {
        amd._post(function(id_, moduleValue) {
                if (moduleValue && id_) {
                    definitions[id_] = moduleValue;
                    satisfy(id_);
                }
            }, id,
            (pastry.isFunction(factory) ? factory.apply(undef, dependencies) : factory)
        );
    }
    function requireSync (id, contextId, skipHook) {
        if (id === 'require') {
            return function(id) {
                return requireSync(id, contextId);
            };
        }
        var ret;

        if (skipHook) {
            ret = definitions[id];
        } else {
            amd._req(function(id_) {
                ret = definitions[id_];
            }, id, contextId);
        }
        return ret;
    }
    function run (fn, dependencies) {
        var ifn,
            len = dependencies.length,
            getDepFn = function (originFn) {
                return function () {
                    originFn();
                    ifn();
                };
            };

        if (!len) {
            fn();
        } else if (1 === len) {
            ifn = fn;
        } else {
            var count = len;

            ifn = function() {
                if (!--count) {
                    fn();
                }
            };
        }

        pastry.each(dependencies, function (dep) {
            var depFn = required[dep];

            if (depFn === true) {
                ifn();
            } else {
                required[dep] = dep ? getDepFn(depFn) : ifn;
            }
        });
    }
    function satisfy (dep) {
        var go = required[dep];

        required[dep] = true;
        if (go && go !== true) {
            go();
        }
    }

    define = GLOBAL.define = function (/* [id], [dependencies], factory */) {
        // 解释参数 {
            var args         = pastry.toArray(arguments).slice(),
                id           = pastry.isString(args[0]) ? args.shift() : undef,
                dependencies = args.length > 1 ? args.shift() : [],
                factory      = args[0];
        // }
        // 定义 define 函数 {
            amd._pre(function(id_, dependencies_, factory_) {
                run(function() {
                    addDefinition(
                        id_,
                        pastry.map(dependencies_, function(d) {
                            return requireSync(d, id_, 1);
                        }),
                        factory_
                    );
                }, dependencies_);
            }, id, dependencies, factory);
        // }
    };

    var undef,
        definitions = {},
        required    = {},
        amd         = {
            _pre  : stubHook,
            _post : stubHook,
            _req  : stubHook
        },
        require = define;

    define.amd = {}; // 根据 amd 标准定义，要有这样一个属性

    // 核心模块 {
        define('pastry', pastry);
        define('amd', amd);
    // }

    satisfy('require');

    // 全局变量 {
        pastry.setGLOBAL('require' , require);
    // }
}(this));

/* jshint strict: true, undef: true, unused: true */
/* global define */
define('amd/hooks', [
    'amd',
    'pastry'
], function(
    amd,
    pastry,
    undef
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - hooks
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var allId  = '**',
        queues = {};

    function getQueue (eventType, id) {
        var typeSpecific = queues[eventType] = queues[eventType] || {},
            queue = typeSpecific[id] = typeSpecific[id] || [];

        return queue;
    }
    function runCallbacks (eventType, args, callback) {
        var callbacks = getQueue(eventType, allId).concat(getQueue(eventType, args[0]));

        (function run(as) {
            if (callbacks.length) {
                callbacks.shift().apply(undef, as.concat(function() {
                    run([].slice.call(arguments));
                }));
            } else {
                callback.apply(undef, as);
            }
        }(args));
    }
    function on (eventType, id, callback) {
        if (!callback) {
            callback = id;
            id = allId; // hook runs on every module
        }
        getQueue(eventType, id).push(callback);
    }
    function off (eventType, id, callback) {
        if (pastry.isFunction(id)) {
            callback = id;
            id = allId; // hook runs on every module
        }
        var queue = getQueue(eventType, id || allId);

        for (var i = 0; i < queue.length; i++) {
            if (queue[i] === callback || !callback) {
                queue.splice(i, 1); // Removes the matching callback from the array.
                i -= 1; // Compensate for array length changing within the loop.
            }
        }
    }

    pastry.extend(amd, {
        _pre: function(callback, id, dependencies, factory) {
            runCallbacks('define', [
                id,
                dependencies,
                factory
            ], function(
                id_,
                deps_,
                factory_
            ) {
                var finalDeps = [],
                    count = deps_.length,
                    len = count,
                    getDep = function (n) {
                        return function(dep) {
                            finalDeps[n] = dep;
                            if (!--count) {
                                callback(id_, finalDeps, factory_);
                            }
                        };
                    };

                pastry.each(deps_, function (dep, i) {
                    runCallbacks('require', [
                        dep,
                        id_
                    ], getDep(i));
                });
                if (!len) {
                    callback(id_, finalDeps, factory_);
                }
            });

        },
        _post: function(callback, id, moduleValue) {
            if (id) {
                runCallbacks('publish', [
                    id,
                    moduleValue
                ], callback);
            } else {
                callback(id, moduleValue);
            }
        },
        _req: function(callback, id, contextId) {
            runCallbacks('require', [
                id,
                contextId
            ], callback);
        }
    });

    return {
        on  : on,
        off : off
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define */
define('amd/normalize', [
    'pastry',
    'amd/hooks'
], function(
    pastry,
    hooks
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - normalize
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var relative = /^\.\.?\//;

    function normalize(id, contextId) {
        if (!id) {
            return id;
        }
        var parts = id.split('/'), contextParts, normalized = [];

        if (relative.test(id)) {
            contextParts = contextId ? contextId.split('/').slice(0, -1) : [];
            parts = contextParts.concat(parts);
        }

        pastry.each(parts, function (part) {
            switch (part) {
                case '.':
                    break;
                case '..':
                    if (normalized.length < 1) {
                        pastry.ERROR("Module id, "+ id +", with context, "+ contextId +", has too many '..' components.");
                    }
                    normalized.pop();
                    break;
                default:
                    normalized.push(part);
            }
        });

        return normalized.join('/');
    }

    hooks.on('define', function(id, dependencies, factory, next) {
        next(id, pastry.map(dependencies, function(d) {
            return normalize(d, id);
        }), factory);
    });
    hooks.on('require', function(id, contextId, next) {
        next(normalize(id, contextId), contextId);
    });

    return normalize;
});

/* jshint strict: true, undef: true, unused: true */
/* global define */
define('amd/plugins', [
    'amd/hooks',
    'amd/normalize'
], function(
    hooks,
    normalize
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - plugins
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var started = {},
        exp = /^(.*?)!(.*)/;

    hooks.on('require', function(id, contextId, next) {
        var matches = exp.exec(id),
            plugin, resource;

        if (!matches) {
            next(id, contextId);
        } else {
            plugin   = normalize(matches[1], contextId);
            resource = matches[2];

            require([plugin], function(p) {
                var normResource, normDep;

                if (p.normalize) {
                    normResource = p.normalize(resource, function(r) {
                        return normalize(r, contextId);
                    });
                } else {
                    normResource = normalize(resource, contextId);
                }

                normDep = plugin +'!'+ normResource;
                if (!started[normDep]) {
                    started[normDep] = true;
                    p.load(normResource, require, function(value) {
                        define(normDep, function() {
                            return value;
                        });
                    });
                }
                next(normDep, contextId);
            });
        }
    });
});

/* jshint strict: true, undef: true, unused: true */
/* global define, document */
define('amd/loader', [
    'pastry',
    'require',
    'amd/hooks'
], function(
    pastry,
    require,
    hooks
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : amd 模块 - hooks
     * @reference   : https://github.com/jivesoftware/amd.git
     */

    var mappings  = {},
        callbacks = {},
        loaded    = {},
        requested = {};

    function noop () {}
    function maybeLoad (id) {
        var urls, callback;

        if (!require(id) && (urls = mappings[id])) {
            delete mappings[id];
            callback = callbacks[id];
            clearValue(callbacks, callback);
            loadInOrder(urls, callback);
        } else {
            requested[id] = true;
        }
    }
    function loadInOrder (urls, callback) {
        if (urls[0]) {
            load(urls[0], function() {
                loadInOrder(urls.slice(1), callback);
            });
        } else if (callback) {
            callback();
        }
    }
    function load (src, callback) {
        var prevCallback = loaded[src];

        if (true === prevCallback) {
            if (pastry.isFunction(callback)) {
                callback();
            }
        } else if (callback) {
            loaded[src] = chain(prevCallback, callback);
        }
        if (prevCallback) {
            return;
        }
        var firstScript = document.getElementsByTagName('script')[0],
            head        = firstScript.parentNode,
            script      = document.createElement('script');

        script.src   = src;
        script.async = true;
        script.onreadystatechange = script.onload = function() {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = noop;
                head.removeChild(script);

                (loaded[src] || noop)();
                loaded[src] = true;
            }
        };
        head.insertBefore(script, firstScript);
    }
    function clearValue (map, value) {
        pastry.each(map, function (v, key) {
            if (v === value) {
                delete map[key];
            }
        });
    }
    function chain (f, g) {
        return function() {
            if (pastry.isFunction(f)) {
                f();
            }
            g();
        };
    }
    function map (ids, urls, callback) {
        pastry.each(ids, function (id) {
            mappings[id] = urls;
            callbacks[id] = callback;
            if (requested[id]) {
                maybeLoad(id);
            }
        });
    }

    hooks.on('define', function(id, dependencies, factory, next) {
        pastry.each(dependencies, function (dep) {
            maybeLoad(dep);
        });
        next(id, dependencies, factory);
    });

    return {
        map: map
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define */
define('fmt/date', [
    // 'pastry',
], function(
    // pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - date
     */

    // 私有函数 {
        function f (n) {
            return n < 10 ? '0' + n : n;
        }
        function lms (ms) {
            var str = ms + '',
                len = str.length;
            return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
        }
    // }

    return function (date, pattern) {
        /**
         * @description : return stringified date according to given pattern.
         * @parameter*  : {date  } date, input Date object
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @return      : {string} result string.
         * @syntax      : fmtDate(date, [pattern])
         * @example     :
        //     '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{lms}Z' => '2013-10-03T00:57::13.180Z'
        //     '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}'        => '2013-10-03 00:57::13'
        //     '{YY}-{M}-{D} {h}:{m}:{s}'               => '13-10-3 0:57::13'
         */

        var y  = date.getFullYear() + '',
            mo = date.getMonth() + 1,
            d  = date.getDate(),
            h  = date.getHours(),
            mi = date.getMinutes(),
            s  = date.getSeconds(),
            ms = date.getMilliseconds();
        pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';

        return pattern
            .replace( '{YYYY}', y              )
            .replace( '{MM}'  , f(mo)          )
            .replace( '{DD}'  , f(d )          )
            .replace( '{hh}'  , f(h )          )
            .replace( '{mm}'  , f(mi)          )
            .replace( '{ss}'  , f(s )          )
            .replace( '{lms}' , lms(ms)        )
            .replace( '{YY}'  , y.substring(2) )
            .replace( '{M}'   , mo             )
            .replace( '{D}'   , d              )
            .replace( '{h}'   , h              )
            .replace( '{m}'   , mi             )
            .replace( '{s}'   , s              )
            .replace( '{ms}'  , ms             );
    };
});

/* jshint strict: true, undef: true, unused: true */
/* global define */
define('fmt/sprintf', [
    'pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - sprintf
     */
    var reg = /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([%bcdfosxX])/g,

        sprintf = function(format) {
            if (!pastry.isString(format)) {
                pastry.ERROR('sprintf: The first arguments need to be a valid format string.');
            }

            var part,
                parts = [],
                paramIndex = 1,
                args = pastry.toArray(arguments);

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
                start = 0;

            for (i = 0; i < parts.length; i ++) {
                newString += format.substring(start, parts[i].begin);

                start = parts[i].end;

                preSubStr = '';
                switch (parts[i].type) {
                    case '%':
                        preSubStr = '%';
                        break;
                    case 'b':
                        preSubStr = Math.abs(parseInt(parts[i].data)).toString(2);
                        break;
                    case 'c':
                        preSubStr = String.fromCharCode(Math.abs(parseInt(parts[i].data)));
                        break;
                    case 'd':
                        preSubStr = String(Math.abs(parseInt(parts[i].data)));
                        break;
                    case 'f':
                        preSubStr = (parts[i].precision === false) ?
                            (String((Math.abs(parseFloat(parts[i].data))))) :
                            (Math.abs(parseFloat(parts[i].data)).toFixed(parts[i].precision));
                        break;
                    case 'o':
                        preSubStr = Math.abs(parseInt(parts[i].data)).toString(8);
                        break;
                    case 's':
                        preSubStr = parts[i].data.substring(0, parts[i].precision ? parts[i].precision : parts[i].data.length);
                        break;
                    case 'x':
                        preSubStr = Math.abs(parseInt(parts[i].data)).toString(16).toLowerCase();
                        break;
                    case 'X':
                        preSubStr = Math.abs(parseInt(parts[i].data)).toString(16).toUpperCase();
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
], function(
    pastry,
    sprintf
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-29
     * @description : fmt 模块 - vsprintf
     */

    var vsprintf = function(fmt, argv) {
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
define('shim/json', [
    'pastry',
    'fmt/date'
], function(
    pastry,
    fmtDate
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : shim 模块 - JSON
     * @reference   : https://github.com/douglascrockford/JSON-js
     */

    function exportJSON (obj) {
        pastry.mixin({
            JSON: obj
        });
        pastry.setGLOBAL('JSON', obj);
    }

    if (JSON && !!JSON.parse && !!JSON.stringify) {
        exportJSON(JSON);
        return JSON;
    }

    // 补全基础数据类型的 toJSON 方法 {
        var D2JSON = Date.prototype.toJSON;

        if (!pastry.isFunction(D2JSON)) {
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
                return isFinite(this.valueOf()) ? fmtDate(this, '{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
            };
        }
    // }

    var gap, indent, rep,
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
                return pastry.isString(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },

        str = function (key, holder) {
            var v, partial,
                mind = gap,
                value = holder[key];

            if (value && pastry.isFunction(value.toJSON)) {
                value = value.toJSON(key);
            }
            if (pastry.isFunction(rep)) {
                value = rep.call(holder, key, value);
            }
            switch (true) {
                case pastry.isString(value):
                    return quote(value);
                case pastry.isNumber(value):
                    return isFinite(value) ? value + '' : 'null';
                case pastry.isObject(value):
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (pastry.isArray(value)) {
                        pastry.each(value, function (item, index) {
                            partial[index] = str(index, value) || 'null';
                        });
                        v = (partial.length === 0) ?
                            '[]' :
                            gap ?
                                '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                                '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && pastry.isObject(rep)) {
                        pastry.each(rep, function (element) {
                            if (pastry.isString(element)) {
                                v = str(element, value);
                                if (v) {
                                    partial.push(quote(element) + (gap ? ': ' : ':') + v);
                                }
                            }
                        });
                    } else {
                        pastry.each(value, function (element, k) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        });
                    }
                    v = (partial.length === 0) ?
                        '{}' :
                        gap ?
                            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                            '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                default :
                    return value + '';
            }
        },

        shim = {
            stringify: function (value, replacer, space) {
                /**
                 * @description : stringify a JSON object.
                 * @param       : {unknown} value, value to be stringified
                 * @return      : {string } result string.
                 * @syntax      : JSON.stringify(value).
                 */
                var i;
                gap = '';
                indent = '';
                rep = replacer;

                if (pastry.isNumber(space)) {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                } else if (pastry.isString(space)) {
                    indent = space;
                }
                rep = replacer;
                if (
                    replacer &&
                    !pastry.isFunction(replacer) && (
                        !pastry.isObject(replacer) ||
                        !pastry.isNumber(replacer.length)
                    )
                ) {
                    pastry.ERROR('JSON.stringify');
                }
                return str('', {'': value});
            },

            parse: function (text, reviver) {
                /**
                 * @description : parse a string to JSON object
                 * @param       : {string } string, string to parse
                 * @return      : {unknown} result object.
                 * @syntax      : JSON.parse(string).
                 */
                var j;

                function walk(holder, key) {
                    var v,
                        value = holder[key];

                    if (value && pastry.isObject(value)) {
                        pastry.each(value, function (element, k) {
                            v = walk(value, k);
                            if (v) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        });
                    }
                    return reviver.call(holder, key, value);
                }

                text = text + '';
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(
                    text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
                )) {
                    /* jshint -W061 */ j = eval('(' + text + ')');
                    return pastry.isFunction(reviver) ? walk({'': j}, '') : j;
                }
                pastry.ERROR('JSON.parse');
            }
        };

    exportJSON(shim);
    return shim;
});
