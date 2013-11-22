/**
 * @description : PT.DOM.dataset
 * @filename    : pastry.dom.dataset.js
 * @requires    : [pastry.js, pastry.function.js, pastry.array.js, pastry.dom.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var datasetStr = 'dataset';

    if (!PT.DOM.hasElementProperty(datasetStr)) {
        /**
         * @description : dataset shim.
         * @syntax      : Element.dataset
         * @refference  : https://gist.github.com/brettz9/4093766
         */
        PT.DOM.setElementProperty(datasetStr, function () {
            var attrVal, attrName, propName,
                $this              = this,
                HTML5_DOMStringMap = {},
                attributes         = $this.attributes,
                toUpperCase        = function (n0) {
                    return n0.charAt(1).toUpperCase();
                },
                getter = function () {
                    return this;
                },
                setter = function (attrName, value) {
                    return value ? this.setAttribute(attrName, value) : this.removeAttribute(attrName);
                };
            attributes.each(function (attribute) {
                if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
                    attrVal  = attribute.value;
                    attrName = attribute.name;
                    propName = attrName.substr(5).replace(/-./g, toUpperCase); // Change to CamelCase
                    try {
                        PT.O.defineProperty(HTML5_DOMStringMap, propName, {
                            get : getter.bind(attrVal || '')  ,
                            set : setter.bind($this, attrName)
                        });
                    }
                    catch (e) { // if accessors are not working
                        HTML5_DOMStringMap[propName] = attrVal;
                    }
                }
            });
            return HTML5_DOMStringMap;
        });
    }
}(PT));
