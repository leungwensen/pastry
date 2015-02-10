/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/component/Collapse', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/base/Component',
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
        NS_SECTION = '__collapse_section__',
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

