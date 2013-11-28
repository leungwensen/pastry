/**
 * @description : PT.DOM.dataset
 * @filename    : pastry.dom.dataset.js
 * @requires    : [pastry.core.js, pastry.dom.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    /**
     * @description : dataset shim.
     * @syntax      : Element.dataset
     * @refference  : https://gist.github.com/brettz9/4093766
     */
    PT.DOM.elemSet('dataset', function () {
        var attrVal, attrName, propName,
            $this              = this,
            HTML5_DOMStringMap = {},
            attributes         = $this.attributes,
            toUpperCase        = function (n0) {
                return PT.uc(n0.charAt(1));
            },
            getter = function () {
                return this;
            },
            setter = function (attrName, value) {
                return value ? this.setAttribute(attrName, value) : this.removeAttribute(attrName);
            };
        PT.each(attributes, function (attribute) {
            if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
                attrVal  = attribute.value;
                attrName = attribute.name;
                propName = attrName.substr(5).replace(/-./g, toUpperCase); // Change to CamelCase
                try {
                    PT.O.defineProperty(HTML5_DOMStringMap, propName, {
                        get : PT.bind(getter, attrVal || ''  ),
                        set : PT.bind(setter, $this, attrName)
                    });
                } catch (e) { // if accessors are not working
                    HTML5_DOMStringMap[propName] = attrVal;
                }
            }
        });
        return HTML5_DOMStringMap;
    });
}(PT));
