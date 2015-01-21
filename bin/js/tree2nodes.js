#!/usr/bin/env node

'use strict';

var // requirements {
        fs   = require('fs'),
        pastry = require('../../dist/node-debug.js'),
        argv = require('optimist')
            .alias('f', 'file')
            .alias('t', 'target')
            .default('f' , 'data/json/sampleTree.json')
            .default('t' , 'data/json/sampleTreeNodes.json')
            .argv,
    // }
    // helpers {
        each = pastry.each,
    // }
    // global variables {
        counter     = 0,
        resultNodes = [];
    // }

function getNode (obj, parentId) {
    var node = {};
    if (typeof parentId !== 'undefined') {
        node.parentId = parentId;
    }
    each(obj, function (value, key) {
        if (key !== 'children') {
            node[key] = value;
        }
    });
    if (typeof node.id === 'undefined') {
        node.id = counter ++;
    }
    return node;
}
function getNodesFromTree (tree, parentId) {
    var node = getNode(tree, parentId);
    resultNodes.push(node);
    if (tree.children) {
        each(tree.children, function (child) {
            getNodesFromTree(child, node.id);
        });
    }
}

fs.readFile(argv.file, function (err, data) {
    if (err) {
        console.err(err);
    }

    getNodesFromTree(JSON.parse(String(data)));

    fs.writeFile(argv.target, JSON.stringify(resultNodes, null, 2), function (err) {
        if (err) {
            console.err(err);
        }
    });
});

