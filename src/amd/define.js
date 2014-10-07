/* jshint strict: true, undef: true, unused: true */
// /* global xxx, yyy */
(function (pastry) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-09-18
     * @description : amd 模块 - define
     * @reference   : https://github.com/jivesoftware/tamd.git
     * @reference   : https://gist.github.com/388e70bccd3fdb8a6617
     */

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
    function define (/* [id], [dependencies], factory */) {
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
    }

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
        pastry.setGLOBAL('define'  , define );
        pastry.setGLOBAL('require' , require);
    // }
}(this.pastry));
