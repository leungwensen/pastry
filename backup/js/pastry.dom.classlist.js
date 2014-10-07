/**
 * @description : PT.DOM.classList
 * @filename    : pastry.dom.classlist.js
 * @requires    : [pastry.core.js, pastry.dom.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var classStr     = 'class',
        classListStr = 'classList',
        validateClass = function (token) {
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
            $self.list = [];
            PT.each(PT.trim(elem.getAttribute(classStr)).split(/\s+/), function (value) {
                $self.list.push(value);
            });
            $self._updateClassName = function () {
                elem.setAttribute(classStr, $self.toString());
            };
        },
        classListGetter = function () {
            return new ClassList(this);
        };

    ClassList[PT.PS] = {
        /**
         * @description : check if an element has a class.
         * @param       : {String } token, class name.
         * @return      : {Boolean} if contans.
         * @syntax      : Element.classList.contains(token)
         */
        contains : function (token) {
            token = PT.S(token);
            return validateClass(token) && PT.hasVal(this.list, token);
        },
        /**
         * @description : get a class by index.
         * @param       : {Number} index, index of class.
         * @return      : {String} class name.
         * @syntax      : Element.classList.item(index)
         */
        item : function (index) {
            return this.list[index] || null;
        },
        /**
         * @description : add classes to an element.
         * @param       : {String} token, class name.
         * @syntax      : Element.classList.add(token1[, token2, ...,])
         */
        add : function () {
            var $self   = this,
                updated = false;
            PT.each(arguments, function (token) {
                token = PT.S(token);
                if (validateClass(token) && !PT.hasVal($self.list, token)) {
                    $self.list.push(token);
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
            PT.each(arguments, function (token) {
                token = PT.S(token);
                if (validateClass(token) && PT.hasVal($self.list, token)) {
                    $self.list.splice(PT.indexOf($self.list, token), 1);
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
            return this.list.join(' ');
        }
    };

    PT.DOM.elemSet(classListStr, classListGetter);
}(PT));