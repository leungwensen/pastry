/* jshint strict: true, undef: true, unused: true */
// /* global document */

var define;

(function (GLOBAL, undef) {
    /*
     * @author      : wensen.lws
     * @description : 模块加载
     * @note        : 和 seajs、requirejs 的不同之一：define 的模块即时运行
     */
    'use strict';

    if (define) { // 避免反复执行
        return;
    }

    var pastry = GLOBAL.pastry,
        event  = pastry.event,

        Module = function (meta) {
            var mod = this;
            mod.init(meta);
            return mod;
        },

        data = Module._data = {
            moduleByUri  : {}, // 缓存的模块
            exportsByUri : {}  // 缓存的模块输出
        },

        moduleByUri  = data.moduleByUri ,
        exportsByUri = data.exportsByUri,

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
            return mod;
        },
        load: function (callback) {
            /*
             * @description: 加载
             */
            var mod = this;
            callback();
            Module.emit('module-loaded', mod);
            return mod;
        },
        save: function () {
            /*
             * @description: 保存
             */
            var mod = this;
            moduleByUri[mod.uri] = mod;
            Module.emit('module-saved', mod);
            return mod;
        },
        processDeps: function (callback) {
            /*
             * @description : 获取依赖项，并且运行工厂函数得到返回值
             * @note        : 这里要记得处理迟早会遇到的循环依赖的问题
             */
            var mod         = this,
                deps        = mod.deps,
                depsExports = [],
                length      = pastry.isArray(deps) ? deps.length : 0,
                count       = 0, // 标记递归逻辑退出点
                depModule;

            if (length === 0) {
                callback(depsExports);
            } else {
                pastry.each(deps, function (depId, index) {
                    depModule = moduleByUri[depId];
                    if (depModule) {
                        depsExports[index] = exportsByUri[depId];
                        // 递归结束点 {
                            count ++;
                            if (count === length) {
                                callback(depsExports);
                            }
                        // }
                    } else {
                        depModule = new Module({
                            id: depId
                        });
                        depModule.load(function () {
                            depModule
                                .save()
                                .execute(function () {
                                    depsExports[index] = depModule.exports;
                                    // 递归结束点 {
                                        count ++;
                                        if (count === length) {
                                            callback(depsExports);
                                        }
                                    // }
                                });
                        });
                    }
                });
            }
            return mod;
        },
        execute: function (callback) {
            /*
             * @description: 执行
             */
            var mod = this;
            if (mod.exports) {
                return mod;
            }
            // 获取依赖项并得到 exports 值 {
                mod.processDeps(function (depsList) {
                    mod.exports = exportsByUri[mod.uri] = mod.factory.apply(undef, depsList);
                    Module.emit('module-executed', mod);
                    if (pastry.isFunction(callback)) {
                        callback();
                    }
                });
            // }
            return mod;
        }
    };

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
                };
        // }
        // 需要对元数据进行处理就绑定这个事件 {
            Module.emit('meta-got', meta);
        // }
        // 新建实例、保存并且即时运行 {
            new Module(meta)
                .save()
                .execute();
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

