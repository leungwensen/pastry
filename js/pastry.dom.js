/**
 * @description : PT.DOM
 * @filename    : pastry.dom.js
 * @requires    : [pastry.core.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var DOC = PT.DOC ,
        Obj = PT.O   ,
        WIN = PT.ON  ,
        HAS = PT.has ,
        elementStr = 'Element',
        /**
         * @description : check if Element has a property.
         * @return      : {Boolean} if has or not.
         * @syntax      : PT.DOM.elemHas(name)
         */
        elemHas = function (name) {
            return (
                    HAS(WIN, elementStr) && (
                        HAS(DOC.createElement('_'), name) &&
                        HAS(DOC.createElementNS('http://www.w3.org/2000/svg', 'svg'), name)
                ));
        },
        /**
         * @description : set a property of Element.
         * @param       : {String  } name, property name.
         * @param       : {Function} Getter, property getter method.
         * @param       : {Function} Setter, property setter method.
         * @param       : {Object  } option, defineProperty options.
         * @syntax      : PT.DOM.elemSet(name, Getter[, Setter, option])
         */
        elemSet = function (name, Getter, Setter, option) {
            if (elemHas(name)) {
                return;
            }
            var propDesc  = {},
                elemProto = WIN[elementStr][PT.PS];
            if (Obj.defineProperty) {
                if (Getter) {
                    propDesc.get = Getter;
                }
                if (Setter) {
                    propDesc.set = Setter;
                }
                if (option) {
                    propDesc = PT.merge(propDesc, option);
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
        elemHas : elemHas,
        elemSet : elemSet
    };
}(PT));
