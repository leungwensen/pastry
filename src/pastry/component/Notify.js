/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/component/Notify', [
    'pastry/pastry',
    'pastry/class/declare',
    'pastry/component/Base',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/template/notify',
    'pastry/template/notifyMessage'
], function(
    pastry,
    declare,
    Component,
    domConstruct,
    domEvent,
    templateWrapper,
    templateMessage
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Notify component
     */
    var NS         = '__notify__',
        NS_MESSAGE = '__notify_message__',

        defaultOption = {
            type     : 'info',
            text     : 'message',
            maxCount : 10,
            lifetime : 5000,
        },

        Notify = declare('Notify', [Component], {
            constructor: function (option) {
                var instance = this;
                option = option || {};

                pastry.extend(instance, {
                    id           : pastry.uuid(NS),
                    message      : {},
                    messageCount : 0,
                    messageQueue : [],
                    status       : {},
                    option       : defaultOption,
                }, option);
                option.container = option.container || domConstruct.toDom(templateWrapper({
                    id: instance.id
                }));
                instance.initialise(option);
                instance.placeAt();
                return instance;
            },
            _initMessage: function (option) {
                var instance = this,
                    message  = pastry.extend({}, option, {
                        domNode: domConstruct.toDom(templateMessage(option))
                    });

                domEvent.on(message.domNode, 'click', function () {
                    instance._hideById(message.id);
                });
                return message;
            },
            _showById: function (id) {
                var instance = this,
                    message  = instance.message[id];

                if (message) {
                    domConstruct.place(message.domNode, instance.container, 'first');
                    instance.messageCount ++;
                    if (pastry.isFunction(message.onShow)) {
                        message.onShow();
                    }
                    message.timeout = setTimeout(function () {
                        if (instance.message[message.id]) {
                            instance._hideById(message.id);
                        }
                    }, message.lifetime ? message.lifetime : instance.option.lifetime);
                }
                return instance;
            },
            _hideById: function (id) {
                var instance = this,
                    message  = instance.message[id];

                if (message) {
                    domConstruct.destroy(message.domNode);
                    instance.messageCount --;
                    clearTimeout(message.timeout);
                    instance._showNext();
                    if (pastry.isFunction(message.onHide)) {
                        message.onHide();
                    }
                    Component.prototype.destroy.apply(message);
                    delete instance.message[id];
                }
                return instance;
            },
            _showNext: function () {
                var instance = this,
                    id = instance.messageQueue.pop();
                if (id) {
                    instance._showById(id);
                }
                return instance;
            },
            config: function (option) {
                var instance = this;
                pastry.extend(instance.option, option);
                return instance;
            },
            log: function (option) {
                var instance = this,
                    id = option.id || pastry.uuid(NS_MESSAGE),
                    message;

                // instance.show();
                option = pastry.extend({
                    id: id
                }, instance.option, option);

                instance.message[id] = message = instance._initMessage(option);
                if (instance.messageCount >= instance.option.maxCount) {
                    instance.messageQueue.push(id);
                } else {
                    instance._showById(id);
                }
            }
        });

    return pastry.Notify = Notify;
});

