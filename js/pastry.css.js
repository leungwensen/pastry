/**
 * @description : PT.DOM.style
 * @filename    : pastry.dom.style.js
 * @requires    : [pastry.js, pastry.array.js, pastry.dom.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }
    var assets = {
        /**
         * @description : set a property of Element.
         * @param       : {String  } name, property name.
         * @param       : {Function} Getter, property getter method.
         * @param       : {Function} Setter, property setter method.
         * @param       : {Object  } option, defineProperty options.
         * @syntax      : PT.DOM.setElementProperty(name, Getter[, Setter, option])
         */
        show : function () {
            this.style.display = 'block';
        },
        hide : function () {
            this.style.display = 'none';
        },
        toggle : function () {
            var $self = this,
                oldDisplay = $self.style.display;
            $self.style.display = (oldDisplay === 'block') ? 'none' : 'block';
        }
    };

    [
        'show'   ,
        'hide'   ,
        'toggle'
    ].each(function (prop) {
        if (!PT.DOM.hasElementProperty(prop)) {
            PT.DOM.setElementProperty(prop, function () {
                return assets[prop];
            });
        }
    });
}(PT));
