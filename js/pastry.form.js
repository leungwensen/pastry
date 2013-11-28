/**
 * @description : PT.Form
 * @filename    : pastry.form.js
 * @requires    : [pastry.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }
    var data = function (form) {
            var resultObj         = {},
                elementArray      = [],
                rcheckableTypes   = /^(?:checkbox|radio)$/i,
                rsubmitterTypes   = /^(?:submit|button|image|reset|file)$/i,
                rsubmittableTypes = /^(?:input|select|textarea|keygen)/i;
            PT.each(form.elements, function (elem) {
                elementArray.push(elem);
            });

            PT.map(PT.filter(elementArray, function (elem) {
                    return elem.name                                          &&
                           !elem.disabled                                     &&
                           rsubmittableTypes.test(elem.nodeName)              &&
                           !rsubmitterTypes.test(elem.type)                   &&
                           (!rcheckableTypes.test(elem.type) || elem.checked);
                }), function (elem) {
                    var val = elem.value;
                    if (val) {
                        if (PT.isArr(val)) {
                            PT.map(val, function (element) {
                                resultObj[element.name] = element.value;
                            });
                        } else {
                            resultObj[elem.name] = elem.value;
                        }
                    }
                });
            return resultObj;
        };

    PT.Form = {
        /*
         * @description : return form data object.
         * @syntax      : PT.Form.data(form)
         * @param       : {HTMLFormElement} form, form to be get data from.
         * @return      : {Object} form data object.
         */
        data      : data,
        /*
         * @description : return form data query string.
         * @syntax      : PT.Form.serialize(form)
         * @param       : {HTMLFormElement} form, form to be get data query string from.
         * @return      : {String} form data query string.
         */
        serialize : function (form) {
            return PT.QueryStr.stringify(data(form));
        }
    };
}(PT));
