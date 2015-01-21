/* jshint strict: true, undef: true, unused: true */
/* global define */

define('ui/tree/node/event', [
    // 'pastry',
    'event'
    // 'dom/data',
    // 'dom/event'
], function(
    // pastry,
    event
    // domData,
    // domEvent
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : bind events for ui/Tree
     */
    return function (node) {
        // instance events {
            event(node); // add node instance events
            node.on('clicked'     , function () { node.onClicked();     });
            node.on('collapsed'   , function () { node.onCollapsed();   });
            node.on('contextmenu' , function () { node.onContextmenu(); });
            node.on('dblclicked'  , function () { node.onDblclicked();  });
            node.on('expanded'    , function () { node.onExpanded();    });
            node.on('selected'    , function () { node.onSelected();    });
        // }
        // dom events {
        // }
        return node;
    };
});

