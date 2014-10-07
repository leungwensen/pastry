/**
 * @description : PT.DOM.style
 * @filename    : pastry.dom.style.js
 * @requires    : [pastry.core.js, pastry.dom.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }
    var BS = 'block',
        NS = 'none' ,
        assets = {
            /**
             * @description : show an element.
             * @syntax      : element.show().
             */
            show : function () {
                this.style.display = BS;
            },
            /**
             * @description : hide an element.
             * @syntax      : element.hide().
             */
            hide : function () {
                this.style.display = NS;
            },
            /**
             * @description : show or hide an element.
             * @syntax      : element.toggle().
             */
            toggle : function () {
                var $self = this,
                    oldDisplay = $self.style.display;
                $self.style.display = (oldDisplay === BS) ? NS : BS;
            }
        };

    PT.each(PT.keys(assets), function (prop) {
        PT.DOM.elemSet(prop, function () {
            return assets[prop];
        });
    });
}(PT));
