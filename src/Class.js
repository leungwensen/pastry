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

