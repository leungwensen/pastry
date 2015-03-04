/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/ui/Component', [
    'pastry/pastry',
    'pastry/oop/declare',
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

