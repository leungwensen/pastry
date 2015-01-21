/* jshint strict: true, undef: true, unused: true */
/* global define */

define('ui/tree/event', [
    // 'pastry',
    'event',
    'dom/data',
    'dom/event'
], function(
    // pastry,
    event,
    domData,
    domEvent
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : bind events for ui/Tree
     */
    function getTreeNodeFromDelegateEventAndTree (e, tree) {
        return tree.nodeById[domData.get(e.delegateTarget, 'id')];
    }
    return function (tree) {
        var treeContainer = tree.container;

        // instance events {
            event(tree); // add tree instance events
            tree.on('node-clicked'     , function (node) { tree.onNodeClicked(node);     });
            tree.on('node-collapsed'   , function (node) { tree.onNodeCollapsed(node);   });
            tree.on('node-contextmenu' , function (node) { tree.onNodeContextmenu(node); });
            tree.on('node-dblclicked'  , function (node) { tree.onNodeDblclicked(node);  });
            tree.on('node-expanded'    , function (node) { tree.onNodeExpanded(node);    });
            tree.on('node-selected'    , function (node) { tree.onNodeSelected(node);    });
        // }
        // dom events {
            // domEvent.on(treeContainer, 'contextmenu', function () {
            //     return false;
            // });
            domEvent.on(treeContainer, 'click', '.tree-node-expander', function (e) {
                getTreeNodeFromDelegateEventAndTree(e, tree).toggle();
            });
            domEvent.on(treeContainer, 'click', '.tree-node', function (e) {
                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                treeNode.trigger('clicked');
                tree.trigger('node-clicked', treeNode);
            });
            domEvent.on(treeContainer, 'contextmenu', '.tree-node', function (e) {
                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                e.preventDefault();
                treeNode.trigger('contextmenu');
                tree.trigger('node-contextmenu', treeNode);
            });
            domEvent.on(treeContainer, 'dblclick', '.tree-node', function (e) {
                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                treeNode.trigger('dblclicked');
                tree.trigger('node-dblclicked', treeNode);
            });
            domEvent.on(treeContainer, 'mousedown', '.tree-node', function (e) {
                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                treeNode.select();
                treeNode.trigger('selected');
                tree.trigger('node-selected', treeNode);
            });
        // }

        return tree;
    };
});

