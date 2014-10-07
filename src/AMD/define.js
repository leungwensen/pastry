
/* jshint strict: true, undef: true, unused: true */
// /* global xxx, yyy */
/*
 * @author      : 绝云(wensen.lws@alibaba-inc.com)
 * @date        : 2014-09-18
 * @description : AMD 模块 - define
 * @reference   : https://github.com/jivesoftware/tAMD.git
 */
(function (C) {
    'use strict';

    var definitions = {},
        required    = {},
        undef,

        stubHook = function (next) {
            next.apply(undef, C.toArray(arguments).slice(1));
        },

        AMD = {
            _pre  : stubHook,
            _post : stubHook,
            _req  : stubHook
        },

        addDefinition = function (id, dependencies, factory) {
            AMD._post(function(id_, moduleValue) {
                    if (moduleValue && id_) {
                        definitions[id_] = moduleValue;
                        satisfy(id_);
                    }
                }, id,
                (C.isFunction(factory) ? factory.apply(undef, dependencies) : factory)
            );
        },

        requireSync = function (id, contextId, skipHook) {
            if (id === 'require') {
                return function(id) {
                    return requireSync(id, contextId);
                };
            }
            var ret;

            if (skipHook) {
                ret = definitions[id];
            } else {
                AMD._req(function(id_) {
                    ret = definitions[id_];
                }, id, contextId);
            }
            return ret;
        },

        map = function (f, array) {
            var results = [];
            C.each(array, function (item) {
                results.push(f(item));
            });
            return results;
        },

        run = function (fn, dependencies) {
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

            C.each(dependencies, function (dep) {
                var depFn = required[dep];
                if (depFn === true) {
                    ifn();
                } else {
                    required[dep] = dep ? getDepFn(depFn) : ifn;
                }
            });
        },

        satisfy = function (dep) {
            var go = required[dep];
            required[dep] = true;
            if (go && go !== true) {
                go();
            }
        },

        define = function (/* [id], [dependencies], factory */) {
            // 解释参数 {
                var args         = C.toArray(arguments).slice(),
                    id           = C.isString(args[0]) ? args.shift() : undef,
                    dependencies = args.length > 1 ? args.shift() : [],
                    factory      = args[0];
            // }
            // 定义 define 函数 {
                AMD._pre(function(id_, dependencies_, factory_) {
                    run(function() {
                        addDefinition(
                            id_,
                            map(function(d) {
                                return requireSync(d, id_, 1);
                            }, dependencies_),
                            factory_
                        );
                    }, dependencies_);
                }, id, dependencies, factory);
            // }
        },

        require = define;

    define.amd = {}; // 根据 AMD 标准定义，要有这样一个属性

    define('AMD', AMD);
    satisfy('require');

    C.setGLOBAL('define'  , define );
    C.setGLOBAL('require' , require);
}(this.C));

