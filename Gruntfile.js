/* jshint strict: true, undef: true, unused: true */
/* global module */
var pastry = require('pastry');

module.exports = function (grunt) {
    'use strict';
    var pkg  = grunt.file.readJSON('package.json'),
        conf = {
            browserModules : grunt.file.readJSON('conf/json/browserModules.json'),
            nodeModules    : grunt.file.readJSON('conf/json/nodeModules.json')
        };

    grunt.initConfig({
        pkg: pkg,

        dist: {
            browser : 'dist/browser-debug.js',
            node    : 'dist/node-debug.js'
        },

        path: {
            release: 'release'
        },

        clean: {
            src: [
                '<%= path.release %>'
            ]
        },

        concat: {
            options: {
                separator: '',
            },
            browserDebug: {
                src  : conf.browserModules,
                dest : '<%= dist.browser %>'
            },
            nodeDebug: {
                src  : conf.nodeModules,
                dest : '<%= dist.node %>'
            },
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: {
                gruntfile: [
                    'Gruntfile.js'
                ],
                bin: [
                    'bin/js/*.js'
                ],
                json: [
                    'doc/json/*.json',
                    'package.json'
                ],
                src: [
                    'src/**/*.js'
                ],
                spec: [
                    'spec/*.js'
                ]
            }
        },

        jasmine: {
            src: '<%= dist.node %>',
            options: {
                specs: 'test/jasmine/**/*.spec.js'
            }
        },

        uglify: {
            options: {
            },
            core: {
                files: {
                    '<%= pkg.browser %>' : '<%= dist.browser %>',
                    '<%= pkg.main %>'    : '<%= dist.node %>'
                }
            }
        }
    });

    pastry.each([
        'clean',
        'concat',
        'jasmine',
        'jshint',
        'uglify'
    ], function (task) {
        grunt.loadNpmTasks('grunt-contrib-' + task);
    });

    grunt.registerTask('default', [
        'jshint',
        'concat',
        'uglify',
        'jasmine'
    ]);
    grunt.registerTask('travis', [
        'jshint',
        'jasmine'
    ]);
};

