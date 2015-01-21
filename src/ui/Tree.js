/* jshint strict: true, undef: true, unused: true */
/* global define */

define('ui/Tree', [
    'pastry',
    'declare',
    // 'event',
    'Component',
    'dom/construct',
    'dom/query',
    'ui/tree/Node',
    'ui/tree/event',
    'ui/tree/template/wrapper'
], function(
    pastry,
    declare,
    // event,
    Component,
    domConstruct,
    domQuery,
    TreeNode,
    bindTreeEvent,
    templateWrapper
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Tree
     */
    var NS      = '__tree__',
        NS_NODE = '__tree_node__',

        isArray = pastry.isArray,
        indexOf = pastry.indexOf,
        remove  = pastry.remove,
        each    = pastry.each,
        extend  = pastry.extend,
        uuid    = pastry.uuid,

        Tree = declare('ui/Tree', [Component], {
            // constructor {
                constructor: function (option) {
                    option = option || {};
                    var tree = this,
                        container;

                    extend(tree, {
                        id           : uuid(NS),
                        data         : [],
                        nodes        : [],   // node instances
                        nodeById     : {},   // node instances by id
                        container    : null, // element
                        headElement  : null, // element
                        bodyElement  : null, // element
                        selectedNode : null, // selected node
                    }, option);
                    // render container {
                        if (option.container) {
                            tree.container = domQuery.one(option.container);
                        }
                        if (!tree.container) {
                            tree.container = domConstruct.toDom(templateWrapper(tree));
                        }
                        container = tree.container;
                    // }
                    // get other dom nodes {
                        if (tree.hasHead) {
                            tree.headElement = domQuery.one('thead', container);
                        }
                        tree.bodyElement = domQuery.one('tbody', container);
                    // }
                    // add nodes {
                        tree.addNodes(tree.data);
                        delete tree.data;
                    // }
                    // bind events {
                        bindTreeEvent(tree);
                    // }
                    return tree;
                },
            // }
            // attributes {
                hasHead        : false,
                treeColumnName : 'tree',
                extraColumns   : [], // extra columns
            // }
            // private methods {
                _processData: function (items) {
                    var tree = this;

                    // add id, extraColumns, tree, etc {
                        each(items, function (item) {
                            var id = item.id;
                            extend(item, {
                                extraColumns : tree.extraColumns,
                                tree         : tree,
                            });
                            if (typeof item.id === 'undefined') {
                                id = item.id = uuid(NS_NODE);
                            }
                            if (!tree.nodeById[id]) {
                                tree.nodeById[item.id] = item; // for counting length
                            }
                        });
                    // }
                    return tree;
                },
                _processNodes: function (nodes) {
                    /*
                     * @description: processing nodes
                     */
                    var tree = this,
                        parentId,
                        parent;

                    each(nodes, function (node) {
                        // add parent-child connections {
                            parent = node.getParent();
                            if (node.parentId !== null) {
                                if (parent) {
                                    node.parent = parent;
                                    parent.addChild(node);
                                } else {
                                    pastry.ERROR('node with id ' + parentId + ' does not exists');
                                }
                            }
                        // }
                    });
                    return tree;
                },
            // }
            // methods {
                addNodes: function (items) {
                    /*
                     * @description: add nodes
                     */
                    var tree  = this,
                        nodes = [];

                    items = items || [];
                    if (!isArray(items)) {
                        items = [items];
                    }
                    tree._processData(items);
                    // turn items into nodes {
                        each(items, function (item) {
                            var id = item.id,
                                node = tree.nodeById[id];
                            if (node instanceof TreeNode) {
                                return;
                            }
                            item = new TreeNode(item);
                            tree.nodes.push(item);
                            nodes.push(item);
                            tree.nodeById[item.id] = item;
                        });
                    // }
                    // process nodes {
                        tree._processNodes(nodes);
                    // }
                    // load nodes {
                        tree.eachNode(function (node) {
                            node.render(); // 必须和 load 分开做
                        });
                        tree.eachNode(function (node) {
                            node.load();
                        });
                    // }
                    return tree;
                },
                addNode: function (item) {
                    return this.addNodes([item]);
                },
                removeNodes: function (nodes) {
                    /*
                     * @description: remove nodes
                     */
                    var tree = this,
                        parent;
                    if (!isArray(nodes)) {
                        nodes = [nodes];
                    }
                    tree.eachNode(nodes, function (node) {
                        var treeNodeIndex = indexOf(tree.nodes, node);
                        if (treeNodeIndex > -1) {
                            remove(tree.nodes, treeNodeIndex);
                        }
                        delete tree.nodeById[node.id];
                        if (parent = node.parent) {
                            parent.removeChild(node);
                        }
                        node.eachChild(function (child) {
                            child.destroy();
                        });
                        node.destroy();
                    });
                    return tree;
                },
                queryNodes: function (query) {
                    /*
                     * @description: find nodes
                     */
                    var tree  = this;
                    if (isArray(query)) {
                        return query;
                    } else if (pastry.isPlainObject(query)) {
                        return pastry.filter(tree.nodes, function (node) {
                            return queryFilter(node, query);
                        });
                    }
                },
                eachNode: function (query, callback) {
                    /*
                     * @description: processing each node
                     */
                    var tree = this,
                        nodes = [];
                    if (!pastry.isFunction(query)) {
                        nodes = tree.queryNodes(query);
                    } else {
                        nodes = tree.nodes;
                        callback = query;
                    }
                    each(nodes, function (node) {
                        callback(node);
                    });
                    return tree;
                },
                expandNodes: function (/* node */) {
                },
            // }
            // events {
                onNodeClicked      : function (/* node */) { },
                onNodeContextmenu  : function (/* node */) { },
                onNodeDblclicked   : function (/* node */) { },
                onNodeExpanded     : function (/* node */) { },
                onNodeRightClicked : function (/* node */) { },
                onNodeSelected     : function (/* node */) { }
            // }
        });

    function queryFilter (target, queryObj) {
        return pastry.every(queryObj, function (value, key) {
            return target[key] === value;
        });
    }

    // Tree.render = function (/* container, option */) {
    // };

    Tree.Node = TreeNode;
    return pastry.Tree = Tree;
});

