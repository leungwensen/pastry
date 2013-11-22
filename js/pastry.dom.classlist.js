/**
 * @description : PT.DOM.classList
 * @filename    : pastry.dom.classlist.js
 * @requires    : [pastry.js, pastry.string.js, pastry.array.js, pastry.dom.js, pastry.css.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var classStr     = 'class',
        classListStr = 'classList';

    if (!PT.DOM.hasElementProperty(classListStr)) {
        var validateClass = function (token) {
                return (token === '' || /\s/.test(token)) ? false : true;
            },
            /**
             * @description : classList shim.
             * @return      : {Array} a list of classes of an element.
             * @syntax      : Element.classList
             * @refference  : https://github.com/eligrey/classList.js
             */
            ClassList = function (elem) {
                var $self = this;
                elem.getAttribute(classStr).trim().split(/\s+/).each(function (value) {
                    $self.push(value);
                });
                $self._updateClassName = function () {
                    elem.setAttribute(classStr, $self.toString());
                };
            },
            classListGetter = function () {
                return new ClassList(this);
            };

        ClassList.prototype = {
            /**
             * @description : check if an element has a class.
             * @param       : {String } token, class name.
             * @return      : {Boolean} if contans.
             * @syntax      : Element.classList.contains(token)
             */
            contains : function (token) {
                token = PT.S(token);
                return validateClass(token) && this.has(token);
            },
            /**
             * @description : get a class by index.
             * @param       : {Number} index, index of class.
             * @return      : {String} class name.
             * @syntax      : Element.classList.item(index)
             */
            item : function (index) {
                return this[index] || null;
            },
            /**
             * @description : add classes to an element.
             * @param       : {String} token, class name.
             * @syntax      : Element.classList.add(token1[, token2, ...,])
             */
            add : function () {
                var $self   = this,
                    updated = false;
                arguments.each(function (token) {
                    token = PT.S(token);
                    if (validateClass(token) && !$self.has(token)) {
                        $self.push(token);
                        updated = true;
                    }
                });
                if (updated) {
                    $self._updateClassName();
                }
            },
            /**
             * @description : remove classes from an element.
             * @param       : {String} token, class name.
             * @syntax      : Element.classList.remove(token1[, token2, ...,])
             */
            remove : function () {
                var $self   = this,
                    updated = false;
                arguments.each(function (token) {
                    token = PT.S(token);
                    if (validateClass(token) && $self.has(token)) {
                        $self.splice($self.indexOf(token), 1);
                        updated = true;
                    }
                });
                if (updated) {
                    $self._updateClassName();
                }
            },
            /**
             * @description : if element has the given class then remove it, otherwise add it.
             * @param       : {String } token, class name.
             * @param       : {Boolean} forse, if forse toggle.
             * @syntax      : Element.classList.toggle(token[, forse])
             */
            toggle : function (token, forse) {
                token = PT.S(token);
                if (!validateClass(token)) {
                    return;
                }
                var $self  = this,
                    method = $self.contains(token) ? forse !== true && 'remove' : forse !== false && 'add';
                if (method) {
                    $self[method](token);
                }
            },
            /**
             * @description : stringify the class list.
             * @syntax      : Element.classList.toString()
             */
            toString : function () {
                return this.join(' ');
            }
        };

        PT.DOM.setElementProperty(classListStr, classListGetter);
    }
}(PT));
