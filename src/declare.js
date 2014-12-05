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

