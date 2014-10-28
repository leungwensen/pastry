#!/usr/bin/env node
// !!!!! WARNING ONLY works on OS X with Chrome.app installed !!!!!
/* jshint strict: true, undef: true, unused: true */
// /* global */

'use strict';
/*
 * @author      : 绝云
 * @description : 分析项目的依赖情况，并图形化显示
 * @syntax      : 在 bin 文件夹所在的父文件夹中 ./bin/dependencyTree.js
 * @TODO        :
 *     * 筛选 namespace
 *     * 定位某个 模块
 */

// 数据准备 {
    var
    // graph 相关变量 {
        nodes      = [],
        links      = [],
        nodeLoaded = {},
    // }
    // 文件服务器相关 {
        fileServer,
        port = 3000,
        path = 'demo/depTree',
    // }
    // 系统依赖 {
        exec        = require('child_process').exec,
        fs          = require('fs'),
        madge       = require('madge'),
        pastry      = require('pastry'),
        staticSever = require('node-static'),
    // }
    // 获取分析结果 {
        madgeObj = madge('src/', {
            // exclude           : /core/,
            format            : 'amd',
            // mainRequireModule : 'src/pastry',
            // requireConfig     : ''
        }),

        depTree  = madgeObj.tree,
        circular = madgeObj.circular(),
        ids      = pastry.keys(depTree);
    // }
// }
// 私有函数 {
    function addNodeById (id) {
        if (!nodeLoaded[id]) {
            nodes.push({
                id   : id,
                name : id
            });
            nodeLoaded[id] = true;
        }
    }
// }
// 生成 graph 数据 {
    ids = pastry.keys(depTree);
    pastry.each(ids, function(id) {
        addNodeById(id);
    });
    pastry.each(depTree, function(deps, id) {
        pastry.each(deps, function(dep) {
            dep = dep.replace(/\.\.\//g, '');
            addNodeById(dep);
            links.push({
                id    : 'S' + dep + 'T' + id,
                source: dep,
                target: id
            });
        });
    });
// }
// 是否有循环依赖 {
    console.log(circular.getArray(), !!circular.getArray().length);
// }
// 写入 graph 数据 {
    fs.writeFile(path + '/json/nodes.json', JSON.stringify(nodes, null, '\t'), 'utf-8', function(err) {
        if (err) {
            console.log(err);
        }
    });
    fs.writeFile(path + '/json/links.json', JSON.stringify(links, null, '\t'), 'utf-8', function(err) {
        if (err) {
            console.log(err);
        }
    });
    fs.writeFile(path + '/json/depTree.json', JSON.stringify(depTree, null, '\t'), 'utf-8', function(err) {
        if (err) {
            console.log(err);
        }
    });
// }
// 启动一个文件服务器 {
    fileServer = new staticSever.Server('./');

    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(port);
// }
// 打开浏览器 {
    exec('open -a "/Applications/Google Chrome.app" \'http://127.0.0.1:3000/' + path + '/index.html\'',
        function (error) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        }
    );
// }

