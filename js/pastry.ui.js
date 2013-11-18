/**
 * @description : PT.UI
 * @filename    : pastry.ui.js
 * @requires    : [pastry.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }
    PT.UI = {
        addClass    : function ($node, style) {
            var oldClass = $node.getAttribute('class').trim();
            $node.setAttribute('class', oldClass + ' ' + style);
        },
        removeClass : function ($node, style) {
            var oldClass = $node.getAttribute('class').trim();
            $node.setAttribute('class', oldClass.replace(style, ''));
        },
        show : function ($node) {
            $node.style.display = 'block';
        },
        hide : function ($node) {
            $node.style.display = 'none';
        }
    };
 }(PT));
