/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('dom/event', [
    'pastry',
    'dom/query'
], function(
    pastry,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : event firing
     * @reference   : http://dean.edwards.name/weblog/2005/10/add-event/
     */
    var doc = document,
        win = window;

    function addEvent(element, type, handler) {
        element = domQuery.one(element);
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            // assign each event handler a unique ID
            if (!handler.$$guid) {
                handler.$$guid = addEvent.guid++;
            }
            // create a hash table of event types for the element
            if (!element.events) {
                element.events = {};
            }
            // create a hash table of event handlers for each element/event pair
            var handlers = element.events[type];
            if (!handlers) {
                handlers = element.events[type] = {};
                // store the existing event handler (if there is one)
                if (element['on' + type]) {
                    handlers[0] = element["on" + type];
                }
            }
            // store the event handler in the hash table
            handlers[handler.$$guid] = handler;
            // assign a global event handler to do all the work
            element['on' + type] = handleEvent;
        }
    }
    // a counter used to create unique IDs
    addEvent.guid = 1;

    function removeEvent(element, type, handler) {
        element = domQuery.one(element);
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else {
            // delete the event handler from the hash table
            if (element.events && element.events[type]) {
                delete element.events[type][handler.$$guid];
            }
        }
    }

    function handleEvent(event) {
        /* jshint validthis:true */
        var returnValue = true,
            elem        = this;
        // grab the event object (IE uses a global event object)
        event = event ||
            fixEvent((doc.parentWindow || win).event);
        // get a reference to the hash table of event handlers
        var handlers = elem.events[event.type];
        // execute each event handler
        for (var i in handlers) {
            elem.$$handleEvent = handlers[i];
            if (elem.$$handleEvent(event) === false) {
                returnValue = false;
            }
        }
        return returnValue;
    }

    function fixEvent(event) {
        // add W3C standard event methods
        event.preventDefault = fixEvent.preventDefault;
        event.stopPropagation = fixEvent.stopPropagation;
        return event;
    }
    fixEvent.preventDefault = function() {
        this.returnValue = false;
    };
    fixEvent.stopPropagation = function() {
        this.cancelBubble = true;
    };

    return pastry.domEvent = {
        on  : addEvent,
        off : removeEvent
    };
});

