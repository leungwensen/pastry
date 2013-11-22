/**
 * @description : PT.DOM
 * @filename    : pastry.dom.js
 * @requires    : [pastry.js, pastry.object.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var DOC = PT.DOC ,
        Obj = PT.O   ,
        WIN = PT.ON  ,
        elementStr = 'Element',
        /**
         * @description : check if Element has a property.
         * @return      : {Boolean} if has or not.
         * @syntax      : PT.DOM.hasElementProperty(name)
         */
        hasElementProperty = function (name) {
            return (
                    WIN.has(elementStr) && (
                        DOC.createElement('_').has(name) &&
                        DOC.createElementNS('http://www.w3.org/2000/svg', 'svg').has(name)
                ));
        },
        /**
         * @description : set a property of Element.
         * @param       : {String  } name, property name.
         * @param       : {Function} Getter, property getter method.
         * @param       : {Function} Setter, property setter method.
         * @param       : {Object  } option, defineProperty options.
         * @syntax      : PT.DOM.setElementProperty(name, Getter[, Setter, option])
         */
        setElementProperty = function (name, Getter, Setter, option) {
            var propDesc  = {},
                elemProto = WIN[elementStr].prototype;
            if (Obj.defineProperty) {
                if (Getter) {
                    propDesc.get = Getter;
                }
                if (Setter) {
                    propDesc.set = Setter;
                }
                if (option) {
                    propDesc = propDesc.merge(option);
                }
                Obj.defineProperty(elemProto, name, propDesc);
            } else if (PT.OP.__defineGetter__) {
                elemProto.__defineGetter__(name, Getter);
                elemProto.__defineSetter__(name, Setter);
            }
        };

    /**
     * @description : DOM
     * @syntax      : PT.DOM
     */
    PT.DOM = {
        hasElementProperty : hasElementProperty,
        setElementProperty : setElementProperty
    };
}(PT));
